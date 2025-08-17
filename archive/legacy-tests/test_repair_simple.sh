#!/usr/bin/env bash
# Test simple du script de réparation
set -euo pipefail

echo "Test du script de réparation (version simplifiée)"
echo "Statut initial: $(systemctl is-active nox-api 2>/dev/null || echo 'non disponible')"

# Test simple
echo "Test API health:"
if curl -s http://127.0.0.1:8080/health | grep -q "ok"; then
    echo "✓ API fonctionne"
    exit 0
else
    echo "✗ API ne fonctionne pas"
    exit 1
fi
