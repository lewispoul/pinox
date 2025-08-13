#!/usr/bin/env bash
# Test upload de fichier via l'API Nox
set -euo pipefail

NOX_TOKEN="${1:-}"
BASE_URL="${2:-http://127.0.0.1:8080}"
FILE_PATH="${3:-test.txt}"

if [[ -z "$NOX_TOKEN" ]]; then
    if [[ -f "/etc/default/nox-api" ]]; then
        NOX_TOKEN=$(sudo grep "^NOX_API_TOKEN=" /etc/default/nox-api | cut -d= -f2)
    fi
fi

if [[ -z "$NOX_TOKEN" ]]; then
    echo "Usage: $0 [TOKEN] [BASE_URL] [REMOTE_PATH]"
    exit 1
fi

echo "Test upload vers $BASE_URL/put"

# Créer un fichier de test
TEST_FILE=$(mktemp)
echo "Contenu de test - $(date)" > "$TEST_FILE"

# Upload
echo -n "Upload du fichier vers $FILE_PATH... "
RESPONSE=$(curl -s -w "%{http_code}" \
    -H "Authorization: Bearer $NOX_TOKEN" \
    -X POST "$BASE_URL/put?path=$FILE_PATH" \
    -F "f=@$TEST_FILE")

HTTP_CODE=${RESPONSE: -3}
RESPONSE_BODY=${RESPONSE%???}

if [[ "$HTTP_CODE" == "200" ]]; then
    echo "✓ OK"
    echo "Réponse: $RESPONSE_BODY"
else
    echo "✗ FAIL (HTTP $HTTP_CODE)"
    echo "Réponse: $RESPONSE_BODY"
    rm -f "$TEST_FILE"
    exit 1
fi

rm -f "$TEST_FILE"
echo "Upload réussi !"
