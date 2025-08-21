#!/usr/bin/env bash
set -euo pipefail

# ---------- helpers ----------
C_GREEN='\e[0;32m'; C_YELLOW='\e[0;33m'; C_RED='\e[0;31m'; C_RESET='\e[0m'
ok(){ echo -e "${C_GREEN}✔ $*${C_RESET}"; }
warn(){ echo -e "${C_YELLOW}⚠ $*${C_RESET}"; }
fail(){ echo -e "${C_RED}✖ $*${C_RESET}"; exit 1; }

# Workdir defaults (edit if needed)
PINOX_DIR=${PINOX_DIR:-"$HOME/pinox"}
APP_DIR=${APP_DIR:-"$PINOX_DIR/nox"}
DEPLOY_DIR=${DEPLOY_DIR:-"$PINOX_DIR/deploy"}
ENV_FILE=${ENV_FILE:-"$DEPLOY_DIR/.env"}
SERVICE_NAME=${SERVICE_NAME:-nox}
EXPECTED_PORT=${EXPECTED_PORT:-8008}

printf "\n=== PiNox Environment Verification ===\n"

# 1) docker
if command -v docker >/dev/null 2>&1; then
  ok "docker found: $(docker --version | sed 's/,.*//')"
else
  fail "docker not found. Install Docker first."
fi

# 2) compose (plugin or standalone)
if docker compose version >/dev/null 2>&1; then
  ok "docker compose plugin found: $(docker compose version | head -n1)"
elif command -v docker-compose >/dev/null 2>&1; then
  ok "docker-compose standalone found: $(docker-compose --version)"
else
  fail "Neither 'docker compose' nor 'docker-compose' found."
fi

# 3) user in docker group
if id -nG "$USER" | tr ' ' '\n' | grep -qx docker; then
  ok "user '$USER' is in docker group"
else
  warn "user '$USER' not in docker group (run: sudo usermod -aG docker $USER && newgrp docker)"
fi

# 4) directories
[[ -d "$PINOX_DIR" ]] && ok "pinox dir: $PINOX_DIR" || warn "pinox dir missing: $PINOX_DIR"
[[ -d "$APP_DIR" ]] && ok "nox app dir: $APP_DIR" || warn "nox app dir missing: $APP_DIR"
[[ -d "$DEPLOY_DIR" ]] && ok "deploy dir: $DEPLOY_DIR" || warn "deploy dir missing: $DEPLOY_DIR"

# 5) .env checks (mask secrets)
if [[ -f "$ENV_FILE" ]]; then
  ok ".env present at $ENV_FILE"
  while IFS='=' read -r k v; do
    [[ -z "${k// }" || "$k" =~ ^# ]] && continue
    masked="$v"; [[ ${#v} -gt 8 ]] && masked="${v:0:4}****${v: -4}"
    echo "  - $k=${masked}"
  done < "$ENV_FILE"
else
  warn ".env not found at $ENV_FILE"
fi

# 6) container status (if compose file exists)
COMPOSE_FILE="$DEPLOY_DIR/docker-compose.yml"
if [[ -f "$COMPOSE_FILE" ]]; then
  ok "compose file: $COMPOSE_FILE"
  # Try both compose flavors
  if docker compose -f "$COMPOSE_FILE" ps >/dev/null 2>&1; then
    docker compose -f "$COMPOSE_FILE" ps || true
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose -f "$COMPOSE_FILE" ps || true
  fi
else
  warn "docker-compose.yml not found (expected at $COMPOSE_FILE)"
fi

# 7) port check
if ss -lntp 2>/dev/null | grep -q ":$EXPECTED_PORT"; then
  ok "port $EXPECTED_PORT is listening"
else
  warn "port $EXPECTED_PORT not listening (expected once container/service is running)"
fi

# 8) basic repo sanity
if [[ -d "$APP_DIR/.git" ]]; then
  ok "nox repo is a git repository"
  git -C "$APP_DIR" status -s || true
else
  warn "nox repo does not appear to be a git repo at $APP_DIR"
fi

printf "\nAll checks done.\n"
