#!/usr/bin/env bash
# Test d'exécution Python via l'API Nox
set -euo pipefail

NOX_TOKEN="${1:-}"
BASE_URL="${2:-http://127.0.0.1:8080}"
PYTHON_CODE="${3:-print('Hello from Nox Python test!')}"

if [[ -z "$NOX_TOKEN" ]]; then
    if [[ -f "/etc/default/nox-api" ]]; then
        NOX_TOKEN=$(sudo grep "^NOX_API_TOKEN=" /etc/default/nox-api | cut -d= -f2)
    fi
fi

if [[ -z "$NOX_TOKEN" ]]; then
    echo "Usage: $0 [TOKEN] [BASE_URL] [PYTHON_CODE]"
    exit 1
fi

echo "Test exécution Python sur $BASE_URL/run_py"
echo "Code: $PYTHON_CODE"

# Échapper le JSON
ESCAPED_CODE=$(printf '%s\n' "$PYTHON_CODE" | jq -R .)
JSON_PAYLOAD="{\"code\": $ESCAPED_CODE}"

RESPONSE=$(curl -s -w "%{http_code}" \
    -H "Authorization: Bearer $NOX_TOKEN" \
    -H "Content-Type: application/json" \
    -X POST "$BASE_URL/run_py" \
    -d "$JSON_PAYLOAD")

HTTP_CODE=${RESPONSE: -3}
RESPONSE_BODY=${RESPONSE%???}

echo "Réponse HTTP: $HTTP_CODE"
echo "Corps: $RESPONSE_BODY"

if [[ "$HTTP_CODE" == "200" ]]; then
    echo "✓ Exécution Python réussie"
else
    echo "✗ Échec de l'exécution Python"
    exit 1
fi
