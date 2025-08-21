#!/usr/bin/env bash
set -euo pipefail

# Verify conda and nox env
if ! command -v conda >/dev/null 2>&1; then
  echo "conda not found in PATH"
  exit 2
fi

# Source conda activation script if present
if [ -f "${HOME}/miniconda3/etc/profile.d/conda.sh" ]; then
  # shellcheck disable=SC1091
  source "${HOME}/miniconda3/etc/profile.d/conda.sh"
fi

if conda info --envs | grep -q '^nox-env'; then
  echo "conda env 'nox-env' exists"
else
  echo "conda env 'nox-env' not found"
  exit 3
fi

echo "Installed packages (first 30 lines):"
conda activate nox-env >/dev/null 2>&1 || true
pip freeze | head -n 30

echo "Python executable:"
which python || true
python --version || true

echo "Check importing the nox module (dry import):"
python -c "import importlib,sys
try:
    importlib.import_module('nox')
    print('nox module import OK')
except Exception as e:
    print('nox import failed:', e)
    sys.exit(4)"
