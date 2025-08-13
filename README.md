# Nox API - Plateforme d'exécution sandbox

## Vue d'ensemble

Nox API est une mini-plateforme d'exécution sécurisée qui expose une API REST F## Prochaines étapes

### ✅ Complétées

1. **Étape 1** : Installation standardisée ✅
2. **Étape 2** : Script de réparation/maintenance (`nox_repair.sh` / `nox_repair_v2.sh`) ✅  
3. **Étape 3** : Durcissement sécurisé - Venv migré vers `/opt/nox/.venv` ✅

### 🔄 Suivantes

4. **Étape 4** : Reverse-proxy Caddy/Nginx
5. **Étape 5** : Client Python et tests automatiques
6. **Étape 6** : Journalisation et rotation
7. **Étape 7** : Outils de qualité de vie (`noxctl`)mettant l'exécution de code Python et Shell dans un environnement sandbox contrôlé.

## État actuel - Étapes 1, 2 & 3 (13 août 2025) ✅

Les **Étapes 1, 2 et 3** du plan directeur ont été **complétées avec succès**.

### Fonctionnalités implémentées

- ✅ **Service systemd** : `nox-api.service` avec durcissement sécuritaire
- ✅ **API REST** : Endpoints `/health`, `/put`, `/run_py`, `/run_sh`
- ✅ **Authentification** : Bearer token obligatoire
- ✅ **Sandbox** : Isolation stricte dans `/home/nox/nox/sandbox`
- ✅ **Durcissement** : SystemD avec `ProtectSystem=strict`, `ProtectHome=read-only`, `NoNewPrivileges`, etc.
- ✅ **Scripts** : Installation idempotente et tests automatisés

### Endpoints disponibles

- `GET /health` - Vérification de santé
- `POST /put` - Upload de fichiers (avec auth)
- `POST /run_py` - Exécution de code Python (avec auth)
- `POST /run_sh` - Exécution de commandes shell (avec auth, blacklist sécurisée)

## Installation

### Installation automatique
```bash
# Depuis le répertoire de développement
./nox-api/deploy/install_nox.sh
```

### Validation
```bash
./validate_nox.sh
```

## Structure des fichiers

```
nox-api-src/
├── nox-api/
│   ├── api/
│   │   └── nox_api.py          # Code source de l'API
│   ├── deploy/
│   │   └── install_nox.sh      # Script d'installation idempotent
│   └── tests/
│       ├── curl_health.sh      # Test endpoint /health
│       ├── curl_put.sh         # Test endpoint /put
│       ├── curl_run_py.sh      # Test endpoint /run_py
│       ├── curl_run_sh.sh      # Test endpoint /run_sh
│       └── run_all_tests.sh    # Suite de tests complète
├── validate_nox.sh             # Script de validation global
└── COPILOT_PLAN.md            # Plan directeur complet
```

## Configuration système

### Service systemd
- **Fichier** : `/etc/systemd/system/nox-api.service`
- **Utilisateur** : `nox`
- **Port** : `127.0.0.1:8080` (local uniquement)
- **Durcissement** : NoNewPrivileges, ProtectHome=read-only, ProtectSystem=full

### Variables d'environnement
- **Fichier** : `/etc/default/nox-api`
- **NOX_API_TOKEN** : Token d'authentification Bearer
- **NOX_SANDBOX** : `/home/nox/nox/sandbox`
- **NOX_TIMEOUT** : `20` secondes
- **NOX_BIND_ADDR** : `127.0.0.1`
- **NOX_PORT** : `8080`

### Arborescence
```
/home/nox/nox/
├── .venv/              # Environnement virtuel Python
├── api/
│   └── nox_api.py      # Code de l'API
├── sandbox/            # Zone d'exécution sécurisée
└── logs/               # Logs de l'application
```

## Utilisation

### Test basique
```bash
# Health check
curl http://127.0.0.1:8080/health

# Upload (avec token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -X POST "http://127.0.0.1:8080/put?path=test.txt" \
     -F "f=@localfile.txt"

# Exécution Python (avec token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -X POST "http://127.0.0.1:8080/run_py" \
     -d '{"code": "print(\"Hello World\")"}'

# Exécution Shell (avec token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -X POST "http://127.0.0.1:8080/run_sh" \
     -d '{"cmd": "ls -la"}'
```

### Scripts de test
```bash
# Tests individuels
./nox-api/tests/curl_health.sh
./nox-api/tests/curl_put.sh TOKEN
./nox-api/tests/curl_run_py.sh TOKEN
./nox-api/tests/curl_run_sh.sh TOKEN

# Suite complète
./nox-api/tests/run_all_tests.sh TOKEN
```

## Sécurité

### Authentification
- Bearer token obligatoire pour tous les endpoints (sauf `/health`)
- Token généré automatiquement lors de l'installation

### Sandbox
- Exécution confinée dans `/home/nox/nox/sandbox`
- Protection contre l'échappement de chemin
- Timeout configuré pour éviter les boucles infinies

### Durcissement SystemD
- `NoNewPrivileges=yes` - Empêche l'escalade de privilèges
- `ProtectHome=read-only` - Accès lecture seule au home
- `ReadWritePaths=/home/nox/nox/sandbox` - Écriture autorisée uniquement dans sandbox
- `ProtectSystem=full` - Protection du système
- `PrivateTmp=yes` - Répertoire /tmp privé

### Blacklist Shell
Commandes interdites : `rm`, `reboot`, `shutdown`, `mkfs`, `dd`, `mount`, `umount`, `kill`, `pkill`, `sudo`

## Prochaines étapes

Selon le plan directeur (COPILOT_PLAN.md) :

1. **Étape 2** : Script de réparation/maintenance (`nox_repair.sh`)
2. **Étape 3** : Migration venv vers `/opt/nox/.venv` + `ProtectHome=yes`
3. **Étape 4** : Reverse-proxy Caddy/Nginx
4. **Étape 5** : Client Python et tests automatiques
5. **Étape 6** : Journalisation et rotation
6. **Étape 7** : Outils de qualité de vie (`noxctl`)

## Troubleshooting

### Vérifier le service
```bash
sudo systemctl status nox-api
sudo journalctl -u nox-api -f
```

### Vérifier la configuration
```bash
sudo cat /etc/default/nox-api
```

### Tests manuels
```bash
curl http://127.0.0.1:8080/health
./validate_nox.sh
```

## Support

Consultez le `COPILOT_PLAN.md` pour la documentation complète du plan directeur et les spécifications détaillées.
