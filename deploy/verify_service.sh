#!/usr/bin/env bash
set -euo pipefail

UNIT_PATH=/etc/systemd/system/nox.service

if [ -f "$UNIT_PATH" ]; then
  echo "Found $UNIT_PATH"
else
  echo "$UNIT_PATH not found; check /home/lppou/pinox/deploy/nox.service for template"
fi

echo "Systemctl status (may require sudo):"
if systemctl status nox.service >/dev/null 2>&1; then
  systemctl status nox.service --no-pager
else
  echo "Service not active or not installed. To install:"
  echo "  sudo cp /home/lppou/pinox/deploy/nox.service /etc/systemd/system/nox.service"
  echo "  sudo systemctl daemon-reload"
  echo "  sudo systemctl enable --now nox.service"
fi
