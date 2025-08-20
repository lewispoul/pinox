#!/usr/bin/env bash
set -euo pipefail

# ---------- Paramètres ----------
NOX_USER="nox"
NOX_GROUP="nox"
NOX_HOME="/home/${NOX_USER}"
NOX_ROOT="${NOX_HOME}/nox"
NOX_API_DIR="${NOX_ROOT}/api"
NOX_SANDBOX="${NOX_ROOT}/sandbox"
NOX_VENV="${NOX_ROOT}/.venv"
SERVICE_NAME="nox-api"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
ENV_FILE="/etc/default/${SERVICE_NAME}"
DEFAULT_TIMEOUT="12"        # secondes d’exécution max
BIND_ADDR="127.0.0.1"
PORT="8080"

ensure_root() { if [[ $EUID -ne 0 ]]; then exec sudo -E bash "$0" "$@"; fi; }

log() { printf "\n[NOX] %s\n" "$*" ; }

# ---------- Préparation comptes et dossiers ----------
prep_layout() {
  log "Création utilisateur et arborescence"
  id -u "${NOX_USER}" >/dev/null 2>&1 || adduser --disabled-password --gecos "" "${NOX_USER}"
  install -d -m 0755 -o "${NOX_USER}" -g "${NOX_GROUP}" "${NOX_ROOT}"
  install -d -m 0755 -o "${NOX_USER}" -g "${NOX_GROUP}" "${NOX_API_DIR}"
  install -d -m 0775 -o "${NOX_USER}" -g "${NOX_GROUP}" "${NOX_SANDBOX}"
}

# ---------- Environnement Python ----------
prep_venv() {
  log "Installation venv et dépendances"
  command -v python3 >/dev/null || apt-get update && apt-get install -y python3 python3-venv
  if [[ ! -x "${NOX_VENV}/bin/python" ]]; then
    sudo -u "${NOX_USER}" python3 -m venv "${NOX_VENV}"
  fi
  sudo -u "${NOX_USER}" "${NOX_VENV}/bin/pip" install --quiet --upgrade pip
  sudo -u "${NOX_USER}" "${NOX_VENV}/bin/pip" install --quiet fastapi "uvicorn[standard]" python-multipart pydantic
}

# ---------- API FastAPI ----------
write_api() {
  log "Écriture du fichier API"
  local tmp="$(mktemp)"
  cat > "${tmp}" <<'PY'
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
import os, subprocess, tempfile, pathlib, shutil

app = FastAPI(title="Nox API")

NOX_TOKEN = os.getenv("NOX_API_TOKEN", "")
SANDBOX = pathlib.Path(os.getenv("NOX_SANDBOX", "/home/nox/nox/sandbox")).resolve()
TIMEOUT = int(os.getenv("NOX_TIMEOUT", "12"))

FORBIDDEN = {
    "rm", "shutdown", "reboot", "halt", "poweroff", "mkfs", "fdisk", "mount", "umount",
    "dd", "chown", "chmod", "chgrp", "useradd", "userdel", "usermod", "groupadd",
    "groupdel", "groupmod", "sysctl", "modprobe", "insmod", "rmmod", "iptables", "nft",
    "curl", "wget", "scp", "ssh", "nc", "socat", "python", "python2", "perl"
}

def require_auth(auth: Optional[str] = None):
    # FastAPI fournit l’en-tête Authorization dans request.headers
    # Ici on récupère via dépendance explicite pour rester simple
    import starlette.requests
    from fastapi import Request
    def _dep(req: Request):
        if not NOX_TOKEN:
            raise HTTPException(status_code=503, detail="Server not configured with NOX_API_TOKEN")
        header = req.headers.get("authorization") or ""
        if not header.lower().startswith("bearer "):
            raise HTTPException(status_code=401, detail="Unauthorized")
        tok = header.split(" ", 1)[1].strip()
        if tok != NOX_TOKEN:
            raise HTTPException(status_code=401, detail="Unauthorized")
        return True
    return _dep

def ensure_in_sandbox(target: pathlib.Path) -> pathlib.Path:
    target = (SANDBOX / target).resolve()
    try:
        target.relative_to(SANDBOX)
    except ValueError:
        raise HTTPException(status_code=400, detail="Path escapes sandbox")
    return target

@app.get("/health")
def health():
    return {"status": "ok", "sandbox": str(SANDBOX)}

@app.post("/put")
async def put_file(path: str, f: UploadFile = File(...), _: bool = Depends(require_auth())):
    dest = ensure_in_sandbox(pathlib.Path(path))
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        with dest.open("wb") as out:
            while True:
                chunk = await f.read(1024 * 1024)
                if not chunk:
                    break
                out.write(chunk)
    finally:
        await f.close()
    return {"saved": str(dest)}

class RunPy(BaseModel):
    code: Optional[str] = Field(None, description="Code Python à exécuter")
    filename: Optional[str] = Field(None, description="Fichier existant dans la sandbox")

class RunSh(BaseModel):
    cmd: List[str] = Field(..., description="Commande et arguments sous forme de liste")

def run_subprocess(argv: List[str], cwd: pathlib.Path) -> JSONResponse:
    try:
        proc = subprocess.run(
            argv,
            cwd=str(cwd),
            capture_output=True,
            text=True,
            timeout=TIMEOUT,
            check=False
        )
        # Tronquage de sécurité
        out = proc.stdout[-10000:]
        err = proc.stderr[-10000:]
        return JSONResponse({"returncode": proc.returncode, "stdout": out, "stderr": err})
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Execution timed out")

@app.post("/run_py")
def run_py(payload: RunPy, _: bool = Depends(require_auth())):
    if not payload.code and not payload.filename:
        raise HTTPException(status_code=422, detail="Provide either code or filename")
    workdir = SANDBOX
    if payload.filename:
        script = ensure_in_sandbox(pathlib.Path(payload.filename))
        if not script.exists():
            raise HTTPException(status_code=404, detail="File not found")
        return run_subprocess(["python3", "-I", "-S", "-B", str(script)], workdir)
    # exécution à partir du code
    with tempfile.TemporaryDirectory(dir=str(SANDBOX)) as td:
        p = pathlib.Path(td) / "run.py"
        p.write_text(payload.code, encoding="utf-8")
        return run_subprocess(["python3", "-I", "-S", "-B", str(p)], workdir)

@app.post("/run_sh")
def run_sh(payload: RunSh, _: bool = Depends(require_auth())):
    if not payload.cmd:
        raise HTTPException(status_code=422, detail="Empty command")
    cmd0 = pathlib.Path(payload.cmd[0]).name
    if cmd0 in FORBIDDEN:
        raise HTTPException(status_code=400, detail=f"Forbidden command: {cmd0}")
    # pas de shell=True, exécution dans la sandbox
    return run_subprocess(payload.cmd, SANDBOX)
PY
  install -o "${NOX_USER}" -g "${NOX_GROUP}" -m 0644 "${tmp}" "${NOX_API_DIR}/nox_api.py"
  rm -f "${tmp}"
}

# ---------- Service systemd ----------
write_unit() {
  log "Mise en place du service systemd"
  cat > "${SERVICE_FILE}" <<EOF
[Unit]
Description=Nox API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=${NOX_USER}
Group=${NOX_GROUP}
EnvironmentFile=${ENV_FILE}
WorkingDirectory=${NOX_API_DIR}
ExecStart=${NOX_VENV}/bin/uvicorn nox_api:app --host ${BIND_ADDR} --port ${PORT}
Restart=on-failure
RestartSec=2

NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=full
ProtectHome=yes
ReadWritePaths=${NOX_SANDBOX}
LockPersonality=yes
RestrictRealtime=yes
RestrictSUIDSGID=yes
MemoryDenyWriteExecute=yes
RuntimeMaxSec=12h

[Install]
WantedBy=multi-user.target
EOF
  systemctl daemon-reload
  systemctl enable "${SERVICE_NAME}" >/dev/null 2>&1 || true
}

# ---------- Fichier d’environnement ----------
write_env() {
  log "Configuration du fichier /etc/default"
  if [[ ! -f "${ENV_FILE}" ]]; then
    install -m 0640 -o root -g root /dev/null "${ENV_FILE}"
  fi
  # NOX_SANDBOX toujours défini
  if ! grep -q '^NOX_SANDBOX=' "${ENV_FILE}"; then
    echo "NOX_SANDBOX=${NOX_SANDBOX}" >> "${ENV_FILE}"
  fi
  # NOX_TIMEOUT si absent
  if ! grep -q '^NOX_TIMEOUT=' "${ENV_FILE}"; then
    echo "NOX_TIMEOUT=${DEFAULT_TIMEOUT}" >> "${ENV_FILE}"
  fi
  # NOX_API_TOKEN: conserver si déjà présent, sinon générer un token
  if grep -q '^NOX_API_TOKEN=' "${ENV_FILE}"; then
    TOKEN="$(. "${ENV_FILE}"; echo "${NOX_API_TOKEN}")"
  else
    TOKEN="$(tr -dc 'A-Za-z0-9' </dev/urandom | head -c 24)"
    echo "NOX_API_TOKEN=${TOKEN}" >> "${ENV_FILE}"
  fi
  chmod 640 "${ENV_FILE}"
  echo "${TOKEN}" > /run/nox_api_token  # pour que je te l’affiche à la fin
}

# ---------- Redémarrage et tests ----------
restart_and_test() {
  log "Redémarrage du service"
  systemctl restart "${SERVICE_NAME}"
  sleep 1
  systemctl --no-pager --full status "${SERVICE_NAME}" | sed -n '1,25p' || true

  local TOKEN="$(cat /run/nox_api_token 2>/dev/null || true)"
  [[ -z "${TOKEN}" ]] && TOKEN="$(. "${ENV_FILE}"; echo "${NOX_API_TOKEN:-}")"

  log "Tests API"
  set +e
  echo -e "\n[TEST] /health"
  curl -sS http://127.0.0.1:${PORT}/health ; echo

  echo -e "\n[TEST] /put -> tests/hello.py"
  echo 'print("hello Nox")' > /tmp/hello.py
  curl -sS -H "Authorization: Bearer ${TOKEN}" -F "f=@/tmp/hello.py" \
       "http://127.0.0.1:${PORT}/put?path=tests/hello.py" ; echo

  echo -e "\n[TEST] /run_py with code"
  curl -sS -X POST -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
       -d '{"code":"print(2+3)","filename":"run.py"}' \
       "http://127.0.0.1:${PORT}/run_py" ; echo

  echo -e "\n[TEST] /run_sh echo"
  curl -sS -X POST -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
       -d '{"cmd":["echo","NOX_OK"]}' \
       "http://127.0.0.1:${PORT}/run_sh" ; echo
  set -e

  log "Token actif pour les requêtes"
  echo "NOX_API_TOKEN=${TOKEN}"
}

# ---------- Main ----------
ensure_root
prep_layout
prep_venv
write_api
write_env
write_unit
restart_and_test
log "Terminé."
