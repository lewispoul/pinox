#!/usr/bin/env bash
# Test de santé de l'API Nox
set -euo pipefail

NOX_TOKEN="${1:-}"
BASE_URL="${2:-http://127.0.0.1:8080}"

if [[ -z "$NOX_TOKEN" ]]; then
    if [[ -f "/etc/default/nox-api" ]]; then
        NOX_TOKEN=$(sudo grep "^NOX_API_TOKEN=" /etc/default/nox-api | cut -d= -f2)
    fi
fi

if [[ -z "$NOX_TOKEN" ]]; then
    echo "Usage: $0 [TOKEN] [BASE_URL]"
    echo "Ou utiliser le token depuis /etc/default/nox-api"
    exit 1
fi

echo "Test de santé de l'API Nox sur $BASE_URL"
echo "Token utilisé: ${NOX_TOKEN:0:8}..."

# Test /health
echo -n "Test /health... "
RESPONSE=$(curl -s "$BASE_URL/health")
if [[ "$RESPONSE" == *"ok"* ]]; then
    echo "✓ OK"
else
    echo "✗ FAIL: $RESPONSE"
    exit 1
fi

echo "API Nox fonctionnelle !"
