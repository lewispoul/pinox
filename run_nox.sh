#!/usr/bin/env bash
set -euo pipefail

# Load conda
source /home/lppou/miniconda3/etc/profile.d/conda.sh
conda activate nox-env

# Load env (if present)
if [ -f /home/lppou/pinox/.env ]; then
  set -a
  source /home/lppou/pinox/.env
  set +a
fi

cd /home/lppou/pinox

# >>> If your entrypoint is different, change the next line <<<
exec python -m nox
