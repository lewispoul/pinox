#!/bin/bash

# Script de débogage pour le conteneur nox-api

echo "🔍 Débogage du conteneur nox-api..."

# 1. Nettoyer les conteneurs existants
echo "Nettoyage des conteneurs..."
docker-compose down --remove-orphans 2>/dev/null

# 2. Reconstruire l'image API
echo "Reconstruction de l'image nox-api..."
docker build -f Dockerfile.api -t nox-api-debug .

# 3. Tester l'import Python dans le conteneur
echo "Test des imports Python dans le conteneur..."
docker run --rm \
  --env-file .env \
  -v "$(pwd)/nox-api:/app" \
  nox-api-debug \
  python3 -c "
import sys
print('Python path:', sys.path)
print('Testing imports...')

try:
    import fastapi
    print('✅ FastAPI OK')
except ImportError as e:
    print('❌ FastAPI error:', e)

try:
    from api.nox_api import app
    print('✅ nox_api OK')  
except ImportError as e:
    print('❌ nox_api error:', e)

try:
    from auth import oauth2_config
    print('✅ oauth2_config OK')
except ImportError as e:
    print('❌ oauth2_config error:', e)

try:
    from auth import oauth2_service  
    print('✅ oauth2_service OK')
except ImportError as e:
    print('❌ oauth2_service error:', e)

try:
    from auth import oauth2_endpoints
    print('✅ oauth2_endpoints OK')  
except ImportError as e:
    print('❌ oauth2_endpoints error:', e)
"

# 4. Tester le démarrage de l'API directement
echo "Test de démarrage direct de l'API..."
docker run --rm \
  --env-file .env \
  -v "$(pwd)/nox-api:/app" \
  -p 8001:8000 \
  nox-api-debug \
  bash -c "
    echo 'Contenu du répertoire /app:'
    ls -la /app/
    echo 'Contenu du répertoire /app/auth:'
    ls -la /app/auth/
    echo 'PYTHONPATH: $PYTHONPATH'
    echo 'Démarrage de l\'API...'
    cd /app && python3 -m uvicorn api.nox_api:app --host 0.0.0.0 --port 8000 --reload
  " &

# 5. Attendre quelques secondes et tester le health check
sleep 5
echo "Test du health check..."
curl -f http://localhost:8001/health 2>/dev/null && echo "✅ Health check OK" || echo "❌ Health check failed"

# Nettoyer
docker stop $(docker ps -q --filter ancestor=nox-api-debug) 2>/dev/null
