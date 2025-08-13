#!/usr/bin/env bash
set -euo pipefail
NOX_USER="nox"
NOX_GROUP="nox"
NOX_HOME="/home/${NOX_USER}/nox"
NOX_PORT="8080"
NOX_API_TOKEN="Xmf7vYpHipwaR3TKyvVC"
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update
sudo apt-get install -y git python3 python3-venv python3-pip ufw

if ! id -u "${NOX_USER}" >/dev/null 2>&1; then
  sudo adduser --disabled-password --gecos "" "${NOX_USER}"
fi
sudo install -d -o "${NOX_USER}" -g "${NOX_GROUP}" "${NOX_HOME}"/{api,sandbox,logs,repos}

sudo -u "${NOX_USER}" bash -lc "
  python3 -m venv ${NOX_HOME}/.venv
  source ${NOX_HOME}/.venv/bin/activate
  pip install --upgrade pip
  pip install fastapi uvicorn[standard] pydantic[dotenv] python-multipart
"

sudo tee "${NOX_HOME}/api/nox_api.py" >/dev/null << 'PY'
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import subprocess, os, pathlib
API_TOKEN = os.getenv("NOX_API_TOKEN","change_me")
SANDBOX = pathlib.Path(os.getenv("NOX_SANDBOX","/tmp")).resolve()
security = HTTPBearer()
app = FastAPI(title="Nox API", version="0.1")
def check(creds: HTTPAuthorizationCredentials = Depends(security)):
    if creds.credentials != API_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
@app.get("/health")
def health(): return {"status":"ok"}
@app.post("/put", dependencies=[Depends(check)])
async def put_file(path: str, f: UploadFile = File(...)):
    dst = (SANDBOX / path).resolve()
    if SANDBOX not in dst.parents and dst != SANDBOX:
        raise HTTPException(status_code=400, detail="Path escapes sandbox")
    dst.parent.mkdir(parents=True, exist_ok=True)
    with open(dst,"wb") as out: out.write(await f.read())
    return {"saved": str(dst)}
class RunPy(BaseModel):
    code: str; filename: str = "snippet.py"; args: list[str] = []
@app.post("/run_py", dependencies=[Depends(check)])
def run_py(req: RunPy):
    target = (SANDBOX / req.filename).resolve()
    if SANDBOX not in target.parents:
        raise HTTPException(status_code=400, detail="Path escapes sandbox")
    target.write_text(req.code)
    try:
        out = subprocess.run(["python3", str(target), *req.args],
            cwd=SANDBOX, capture_output=True, text=True, timeout=60)
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Timeout")
    return {"returncode": out.returncode, "stdout": out.stdout, "stderr": out.stderr}
class RunSh(BaseModel): cmd: list[str]
@app.post("/run_sh", dependencies=[Depends(check)])
def run_sh(req: RunSh):
    blocked = {"sudo","chmod","chown","mount","rm","reboot","shutdown","poweroff","useradd","usermod"}
    if any(tok in blocked for tok in req.cmd):
        raise HTTPException(status_code=400, detail="Blocked command")
    try:
        out = subprocess.run(req.cmd, cwd=SANDBOX, capture_output=True, text=True, timeout=30)
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Timeout")
    return {"returncode": out.returncode, "stdout": out.stdout, "stderr": out.stderr}
PY
sudo chown "${NOX_USER}:${NOX_GROUP}" "${NOX_HOME}/api/nox_api.py"

sudo tee /etc/systemd/system/nox-api.service >/dev/null <<UNIT
[Unit]
Description=Nox API
After=network-online.target
Wants=network-online.target
[Service]
User=${NOX_USER}
Group=${NOX_GROUP}
Environment=NOX_API_TOKEN=${NOX_API_TOKEN}
Environment=NOX_SANDBOX=${NOX_HOME}/sandbox
WorkingDirectory=${NOX_HOME}/api
ExecStart=${NOX_HOME}/.venv/bin/uvicorn nox_api:app --host 0.0.0.0 --port ${NOX_PORT}
Restart=on-failure
RuntimeMaxSec=3600
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=false
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
LockPersonality=true
[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable --now nox-api

sudo ufw allow OpenSSH
sudo ufw allow ${NOX_PORT}/tcp
sudo ufw --force enable || true

echo "OK"
