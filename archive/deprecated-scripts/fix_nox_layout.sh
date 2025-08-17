#!/usr/bin/env bash
set -euo pipefail

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

SRC1="/home/lppoulin/nox-api"
SRC2="/home/lppoulin/nox"
SRC3="${HOME}/nox-api-src"   # notre source propre

ensure_root() { if [[ $EUID -ne 0 ]]; then exec sudo -E bash "$0" "$@"; fi; }

create_user_and_dirs() {
  id -u "${NOX_USER}" >/dev/null 2>&1 || adduser --disabled-password --gecos "" "${NOX_USER}"
  mkdir -p "${NOX_API_DIR}" "${NOX_SANDBOX}"
  chown -R "${NOX_USER}:${NOX_GROUP}" "${NOX_HOME}"
  chmod 755 "${NOX_HOME}"
  chmod -R 775 "${NOX_SANDBOX}"
}

migrate_tree() {
  local src="$1"
  [[ -d "$src" ]] || return 0
  echo "Migration depuis: $src"
  rsync -a --remove-source-files "$src"/ "${NOX_ROOT}/" || true
  rmdir "$src" 2>/dev/null || true
}

normalize_layout() {
  if [[ -d "${NOX_ROOT}/nox-api" && ! -d "${NOX_API_DIR}" ]]; then
    mkdir -p "${NOX_API_DIR}"
    rsync -a --remove-source-files "${NOX_ROOT}/nox-api/" "${NOX_API_DIR}/" || true
    rmdir "${NOX_ROOT}/nox-api" 2>/dev/null || true
  fi
  chown -R "${NOX_USER}:${NOX_GROUP}" "${NOX_ROOT}"
}

setup_venv() {
  if [[ ! -x "${NOX_VENV}/bin/uvicorn" ]]; then
    sudo -u "${NOX_USER}" python3 -m venv "${NOX_VENV}"
    sudo -u "${NOX_USER}" "${NOX_VENV}/bin/pip" install --upgrade pip
    sudo -u "${NOX_USER}" "${NOX_VENV}/bin/pip" install fastapi "uvicorn[standard]" python-multipart pydantic
  fi
}

write_env_file() {
  [[ -f "${ENV_FILE}" ]] || cat > "${ENV_FILE}" <<'EOT'
# /etc/default/nox-api
NOX_BIND_ADDR=127.0.0.1
NOX_PORT=8080
NOX_SANDBOX=/home/nox/nox/sandbox
# Ajouter ensuite:
# NOX_API_TOKEN=.......
EOT
  chmod 640 "${ENV_FILE}"
}

write_service() {
  cat > "${SERVICE_FILE}" <<EOF
[Unit]
Description=Nox API
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=${NOX_USER}
Group=${NOX_GROUP}
EnvironmentFile=${ENV_FILE}
WorkingDirectory=${NOX_API_DIR}
ExecStart=${NOX_VENV}/bin/uvicorn nox_api:app --host \${NOX_BIND_ADDR} --port \${NOX_PORT}
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
