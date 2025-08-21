#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Create virtual environment if it doesn't exist, otherwise activate it
if [[ ! -d .venv ]]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

source .venv/bin/activate
pip install -r requirements.txt
exec uvicorn nox_api.api.nox_api:app --host 0.0.0.0 --port 8000