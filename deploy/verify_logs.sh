#!/usr/bin/env bash
set -euo pipefail

# Tail the service logs and print a short summary (last 100 lines)
unit=nox.service

echo "Last 100 lines for $unit:\n"
sudo journalctl -u "$unit" -n 100 --no-pager

echo "\nFollow live logs with: sudo journalctl -u $unit -f"
