#!/usr/bin/env bash
set -euo pipefail

PROJECT="$HOME/pinox"
SERVICE="pinox-api"
VENV="$PROJECT/.venv"
API_PKG="nox_api.api.nox_api"
APP_ATTR="app"

echo "==> Projet   : $PROJECT"
echo "==> Service  : $SERVICE"
echo "==> Module   : $API_PKG:$APP_ATTR"

cd "$PROJECT"

# 0) Sécurité : vérifier que le venv existe
if [[ ! -d "$VENV" ]]; then
  echo "!! Venv manquant: $VENV"
  echo "   Crée-le:  python3 -m venv \"$VENV\" && source \"$VENV/bin/activate\" && pip install -U pip wheel uvicorn"
  exit 1
fi

# 1) Se remettre exactement sur origin/main (hard reset propre)
echo "==> Git: fetch + checkout main + reset --hard origin/main"
git fetch origin
git checkout main
git reset --hard origin/main

# 2) Nettoyer les stubs locaux qui masquent les vrais modules du repo
#    (on ne supprime que s'ils existent)
echo "==> Nettoyage des stubs locaux (s'ils existent)"
for f in \
  "nox-api/api/metrics_chatgpt.py" \
  "nox-api/api/middleware.py" \
  "nox-api/api/rate_limit_and_policy.py"
do
  if [[ -f "$f" ]]; then
    echo "   - rm $f"
    rm -f "$f"
  fi
done

# 3) Vérifier la structure de paquet (init)
[[ -d "nox-api/api" ]] || { echo "!! Dossier nox-api/api introuvable"; exit 1; }
[[ -f "nox-api/__init__.py" ]] || touch "nox-api/__init__.py"
[[ -f "nox-api/api/__init__.py" ]] || touch "nox-api/api/__init__.py"

# 4) Test d'import Python dans le venv
echo "==> Test import: $API_PKG"
source "$VENV/bin/activate"
python - <<PY
import importlib, sys
m = importlib.import_module("$API_PKG")
print("Import OK:", m.__name__)
if not hasattr(m, "$APP_ATTR"):
    raise SystemExit("ERROR: module imports but has no .$APP_ATTR")
print("Attr OK: .$APP_ATTR present")
PY

# 5) Redémarrer le service systemd
echo "==> Restart systemd: $SERVICE"
sudo systemctl daemon-reload || true
sudo systemctl restart "$SERVICE"
sleep 2
sudo systemctl status "$SERVICE" -n 40 --no-pager || true

# 6) Sonde l'API en local (docs)
echo "==> Probe /docs"
if command -v curl >/dev/null 2>&1; then
  if curl -sS http://127.0.0.1:8000/docs >/dev/null; then
    echo "API OK ✅"
  else
    echo "API KO ❌ — consulte: journalctl -u $SERVICE -n 200 --no-pager"
    exit 1
  fi
else
  echo "curl indisponible; teste manuellement http://127.0.0.1:8000/docs"
fi
