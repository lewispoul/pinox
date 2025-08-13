#!/usr/bin/env bash
# Test d'exécution Shell via l'API Nox
set -euo pipefail

NOX_TOKEN="${1:-}"
BASE_URL="${2:-http://127.0.0.1:8080}"
SHELL_CMD="${3:-echo 'Hello from Nox Shell test!'}"

if [[ -z "$NOX_TOKEN" ]]; then
    if [[ -f "/etc/default/nox-api" ]]; then
        NOX_TOKEN=$(sudo grep "^NOX_API_TOKEN=" /etc/default/nox-api | cut -d= -f2)
    fi
fi

if [[ -z "$NOX_TOKEN" ]]; then
    echo "Usage: $0 [TOKEN] [BASE_URL] [SHELL_COMMAND]"
    exit 1
fi

echo "Test exécution Shell sur $BASE_URL/run_sh"
echo "Commande: $SHELL_CMD"

# Échapper le JSON
ESCAPED_CMD=$(printf '%s\n' "$SHELL_CMD" | jq -R .)
JSON_PAYLOAD="{\"cmd\": $ESCAPED_CMD}"

RESPONSE=$(curl -s -w "%{http_code}" \
    -H "Authorization: Bearer $NOX_TOKEN" \
    -H "Content-Type: application/json" \
    -X POST "$BASE_URL/run_sh" \
    -d "$JSON_PAYLOAD")

HTTP_CODE=${RESPONSE: -3}
RESPONSE_BODY=${RESPONSE%???}

echo "Réponse HTTP: $HTTP_CODE"
echo "Corps: $RESPONSE_BODY"

if [[ "$HTTP_CODE" == "200" ]]; then
    echo "✓ Exécution Shell réussie"
else
    echo "✗ Échec de l'exécution Shell"
    exit 1
fi
