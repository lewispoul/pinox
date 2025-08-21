#!/usr/bin/env bash
set -euo pipefail

C_GREEN='\e[0;32m'; C_YELLOW='\e[0;33m'; C_RED='\e[0;31m'; C_RESET='\e[0m'
ok(){ echo -e "${C_GREEN}✔ $*${C_RESET}"; }
warn(){ echo -e "${C_YELLOW}⚠ $*${C_RESET}"; }
fail(){ echo -e "${C_RED}✖ $*${C_RESET}"; exit 1; }

SERVICE=${SERVICE:-nox}
UNIT_FILE=${UNIT_FILE:-/etc/systemd/system/${SERVICE}.service}

printf "\n=== Systemd Service Verification: %s ===\n" "$SERVICE"

# 1) unit file exists
[[ -f "$UNIT_FILE" ]] || fail "Unit file not found: $UNIT_FILE"
ok "Unit file present: $UNIT_FILE"

echo "-- unit file --"
sudo awk '{print NR ": " $0}' "$UNIT_FILE" | sed -n '1,200p'

# 2) daemon reload (safe)
sudo systemctl daemon-reload
ok "daemon-reload ok"

# 3) show status
if sudo systemctl status "$SERVICE" --no-pager; then
  ok "systemctl status succeeded"
else
  warn "systemctl status returned non-zero (service may be stopped or failing)"
fi

# 4) recent logs
echo "-- recent logs --"
sudo journalctl -u "$SERVICE" -n 80 --no-pager || warn "no logs yet"

# 5) quick health: exit if failing
if ! sudo systemctl is-active --quiet "$SERVICE"; then
  warn "Service not active. Try: sudo systemctl start $SERVICE"
  exit 1
fi
ok "Service is active"

printf "\nTips: restart with 'sudo systemctl restart %s' | disable with 'sudo systemctl disable --now %s'\n" "$SERVICE" "$SERVICE"
