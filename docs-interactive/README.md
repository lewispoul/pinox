# Nox API — README


## 1. Overview

Nox API is a secure, sandboxed execution platform built on **FastAPI**, designed for running Python and shell commands in a controlled environment.

**Key use cases:**

* Local or remote code execution over LAN or HTTPS
* Automated script deployment and testing
* DevOps sandbox for safe experimentation

**Key endpoints:** `/health`, `/put`, `/run_py`, `/run_sh`
**Target OS:** Ubuntu 22.04
**Deployment:** venv or Docker, with optional reverse proxy (Caddy/Nginx)


## 📚 Documentation


### 📚 Documentation Structure
All documentation is now organized in the [`/docs`](../docs/) directory for easy access and maintenance.

**Quick Links:**
- [Documentation Index](../docs/README.md)
- [Progress Tracker](../docs/progress-reports/M9_PROGRESS_TRACKER.md)
- [Latest Milestone](../docs/milestone-reports/M9.6_PERFORMANCE_COMPLETE.md)
- [Deployment Guides](../docs/deployment-guides/)

For navigation tips and a full directory map, see [`DOCUMENTATION.md`](../docs-interactive/DOCUMENTATION.md).

---

### 🚀 Onboarding for New Contributors
1. **Start with the [Documentation Index](../docs/README.md)** for an overview of all available guides and reports.
2. **Check the [Progress Tracker](../docs/progress-reports/M9_PROGRESS_TRACKER.md)** for current project status and milestones.
3. **Review [Deployment Guides](../docs/deployment-guides/)** for setup and operational instructions.
4. For technical questions, see the [FAQ](../docs/FAQ.md) or reach out via project channels listed in the documentation index.

**Tip:** All documentation is grouped by type (milestones, progress, deployment, planning) for fast navigation. Use the index and directory map for guidance.

---


## 2. Features

* Sandboxed execution — Restricts file paths and dangerous commands
* Bearer token authentication
* Systemd service — Automatic startup on boot
* Reverse proxy ready — HTTPS with Caddy or Nginx
* Git integration (optional) — Memory/history of scripts
* Environment-based config — `/etc/default/nox-api`

---


## 3. Repository Structure


```

nox/
├── api/
│   └── nox_api.py
├── deploy/
│   ├── install_nox.sh
│   ├── repair_nox.sh
│   └── harden_nox.sh              # optional, step 3
├── tests/
│   ├── test_health.sh
│   ├── test_put.sh
│   ├── test_run_py.sh
│   └── test_run_sh.sh
├── systemd/
│   └── nox-api.service
└── README.md

```

---


## 4. Installation


```bash
git clone https://github.com/<your-org-or-user>/nox.git
cd nox/deploy
sudo bash install_nox.sh

```

---


## 5. Configuration

Edit `/etc/default/nox-api`:


```ini
NOX_API_TOKEN=replace_with_secure_token
NOX_BIND_ADDR=127.0.0.1
NOX_PORT=8080
NOX_SANDBOX=/home/nox/nox/sandbox

```

Reload and restart:


```bash
sudo systemctl daemon-reload
sudo systemctl restart nox-api

```

---


## 6. API Endpoints


| Method | Endpoint | Description                      |

| ------ | -------- | -------------------------------- |

| GET    | /health  | Health check                     |

| POST   | /put     | Upload file to sandbox           |

| POST   | /run\_py | Execute Python code in sandbox   |

| POST   | /run\_sh | Execute shell command in sandbox |

---


## 7. Security Notes

* Keep `/run_sh` limited to non-destructive commands
* Always set a strong `NOX_API_TOKEN`
* Restrict `NOX_SANDBOX` to safe directories
* If exposed publicly, use HTTPS behind Caddy or Nginx and a firewall (UFW)
* Consider systemd hardening options in `nox-api.service`

---


## 8. Tests

After installation:


```bash
bash tests/test_health.sh
bash tests/test_put.sh
bash tests/test_run_py.sh
bash tests/test_run_sh.sh

```

---


## 9. Troubleshooting - Guide complet


### 🔧 Commandes de diagnostic rapide


#### Diagnostic automatique (Recommandé)

```bash

# Diagnostic complet avec outil intégré
nox-debug                    # Analyse complète
nox-debug health            # Tests de santé uniquement
nox-debug status            # Statut des services
nox-debug logs              # Consultation des logs

```


#### Vérifications manuelles de base

```bash

# 1. Statut du service
sudo systemctl status nox-api
sudo systemctl is-active nox-api    # Doit retourner "active"
sudo systemctl is-enabled nox-api   # Doit retourner "enabled"


# 2. Test de connectivité
curl -i http://127.0.0.1:8080/health  # API directe
curl -i http://localhost/health        # Via reverse proxy (si configuré)


# 3. Consultation des logs
sudo tail -f /var/log/nox-api/nox-api.log     # Logs applicatifs dédiés
sudo tail -f /var/log/nox-api/error.log       # Logs d'erreurs
sudo journalctl -u nox-api -f                 # Logs systemd (historiques)

```


### 📋 Check-list de validation


#### ✅ Configuration de base

- [ ] Service `nox-api` actif : `systemctl is-active nox-api`

- [ ] Configuration présente : `ls -la /etc/default/nox-api`

- [ ] Token défini : `sudo grep NOX_API_TOKEN /etc/default/nox-api`

- [ ] Port configuré : `sudo grep NOX_PORT /etc/default/nox-api`

- [ ] Sandbox accessible : `ls -la /home/nox/nox/sandbox`


#### ✅ Réseau et ports

- [ ] Port 8080 en écoute locale : `sudo ss -lntp | grep :8080`

- [ ] API répond : `curl -s http://127.0.0.1:8080/health`

- [ ] Proxy configuré (optionnel) : `curl -s http://localhost/health`

- [ ] Firewall cohérent : `sudo ufw status`


#### ✅ Permissions et sécurité

- [ ] Utilisateur `nox` existe : `id nox`

- [ ] Répertoire sandbox : `sudo -u nox ls /home/nox/nox/sandbox`

- [ ] Virtual env présent : `ls -la /home/nox/nox/.venv` ou `ls -la /opt/nox/.venv`

- [ ] Service systemd durci : `grep ProtectHome /etc/systemd/system/nox-api.service`


#### ✅ Logs et monitoring

- [ ] Logs dédiés : `sudo ls -la /var/log/nox-api/`

- [ ] Rotation configurée : `ls -la /etc/logrotate.d/nox-api`

- [ ] Outils de diagnostic : `which nox-debug`


### 🐛 Problèmes courants et solutions


#### 1. **Service ne démarre pas**

**Symptômes :**
- `systemctl status nox-api` montre "failed" ou "inactive"
- Erreur "ExecStart operation timed out"

**Diagnostic :**

```bash

# Vérifier les logs détaillés
sudo journalctl -u nox-api -n 50 --no-pager
sudo systemctl show nox-api | grep ExecStart

```

**Solutions :**

```bash

# A. Vérifier le chemin Python
sudo systemctl edit nox-api

# Ajouter:

# [Service]

# ExecStart=

# ExecStart=/home/nox/nox/.venv/bin/python3 -m uvicorn nox_api:app --host 127.0.0.1 --port 8080


# B. Réinitialiser avec le script de réparation
sudo bash nox-api/scripts/nox_repair.sh


# C. Vérifier les dépendances Python
sudo -u nox /home/nox/nox/.venv/bin/pip list | grep -E "(fastapi|uvicorn)"

```


#### 2. **API ne répond pas (Connection refused)**

**Symptômes :**
- `curl http://127.0.0.1:8080/health` → "Connection refused"
- Service actif mais pas de port en écoute

**Diagnostic :**

```bash

# Vérifier l'adresse de liaison
sudo grep NOX_BIND_ADDR /etc/default/nox-api
sudo ss -lntp | grep python3
sudo netstat -tlnp | grep :8080

```

**Solutions :**

```bash

# A. Corriger l'adresse de liaison
sudo sed -i 's/NOX_BIND_ADDR=.*/NOX_BIND_ADDR=127.0.0.1/' /etc/default/nox-api
sudo systemctl restart nox-api


# B. Vérifier les conflits de ports
sudo lsof -i :8080

# Si conflit, changer le port dans /etc/default/nox-api


# C. Diagnostic complet
nox-debug status

```


#### 3. **Erreur 401 Unauthorized**

**Symptômes :**
- API répond mais refuse les requêtes authentifiées
- `curl -H "Authorization: Bearer TOKEN" ...` → 401

**Diagnostic :**

```bash

# Vérifier le token configuré
sudo grep NOX_API_TOKEN /etc/default/nox-api
echo "Token actuel: $(sudo grep NOX_API_TOKEN /etc/default/nox-api | cut -d= -f2)"

```

**Solutions :**

```bash

# A. Générer un nouveau token sécurisé
NEW_TOKEN=$(openssl rand -hex 32)
sudo sed -i "s/NOX_API_TOKEN=.*/NOX_API_TOKEN=$NEW_TOKEN/" /etc/default/nox-api
sudo systemctl restart nox-api
echo "Nouveau token: $NEW_TOKEN"


# B. Test avec le bon token
TOKEN=$(sudo grep "^NOX_API_TOKEN=" /etc/default/nox-api | cut -d= -f2)
curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8080/health

```


#### 4. **Erreur 400/500 lors de l'exécution**

**Symptômes :**
- `/run_py` ou `/run_sh` retourne des erreurs 400/500
- Sandbox inaccessible ou permissions incorrectes

**Diagnostic :**

```bash

# Vérifier la sandbox
sudo -u nox ls -la /home/nox/nox/sandbox
sudo -u nox touch /home/nox/nox/sandbox/test_permissions.txt


# Vérifier les logs d'erreur
sudo tail -20 /var/log/nox-api/error.log

```

**Solutions :**

```bash

# A. Réparer les permissions sandbox
sudo chown -R nox:nox /home/nox/nox/sandbox
sudo chmod 755 /home/nox/nox/sandbox


# B. Test de l'environnement Python
sudo -u nox /home/nox/nox/.venv/bin/python3 -c "print('Python OK')"


# C. Nettoyer la sandbox si pleine
sudo -u nox find /home/nox/nox/sandbox -type f -mtime +7 -delete

```


#### 5. **Problèmes de proxy (Caddy/Nginx)**

**Symptômes :**
- `curl http://localhost/health` ne fonctionne pas
- Certificats SSL expirés ou inaccessibles

**Diagnostic :**

```bash

# Statut proxy
sudo systemctl status caddy
sudo systemctl status nginx


# Tests de connectivité
curl -I http://localhost/health        # HTTP
curl -I https://votre-domaine/health   # HTTPS

```

**Solutions :**

```bash

# A. Caddy - Redémarrer et vérifier config
sudo systemctl restart caddy
sudo caddy validate --config /etc/caddy/Caddyfile


# B. Nginx - Recharger configuration  
sudo nginx -t
sudo systemctl reload nginx


# C. Diagnostiquer les certificats
sudo certbot certificates
sudo systemctl status snapd  # Pour certbot snap

```


#### 6. **Performance dégradée**

**Symptômes :**
- Réponses lentes (> 5 secondes)
- Utilisation mémoire/CPU élevée

**Diagnostic :**

```bash

# Monitoring en temps réel
nox-monitor 10        # Surveillance chaque 10 secondes
htop                  # CPU/Mémoire globale
sudo iotop            # I/O disque


# Statistiques détaillées
ps aux | grep python3 | grep nox_api
sudo ss -tupln | grep :8080
df -h /home/nox/nox/sandbox

```

**Solutions :**

```bash

# A. Nettoyer la sandbox
sudo -u nox find /home/nox/nox/sandbox -type f -size +10M -delete
sudo -u nox find /home/nox/nox/sandbox -type f -mtime +1 -delete


# B. Redémarrer le service
sudo systemctl restart nox-api


# C. Vérifier les logs volumineux
sudo du -sh /var/log/nox-api/
sudo logrotate -f /etc/logrotate.d/nox-api

```


### 🔍 Commandes systemd utiles


```bash

# Gestion du service
sudo systemctl start nox-api      # Démarrer
sudo systemctl stop nox-api       # Arrêter  
sudo systemctl restart nox-api    # Redémarrer
sudo systemctl reload nox-api     # Recharger config
sudo systemctl enable nox-api     # Activer au démarrage
sudo systemctl disable nox-api    # Désactiver au démarrage


# Diagnostic avancé
sudo systemctl show nox-api                    # Configuration complète
sudo systemctl list-dependencies nox-api      # Dépendances
sudo systemctl is-active nox-api              # Statut actif
sudo systemctl is-enabled nox-api             # Statut activation
sudo systemctl is-failed nox-api              # Vérifier échec


# Logs et debugging
sudo journalctl -u nox-api -f                 # Logs en temps réel
sudo journalctl -u nox-api --since "1 hour ago"  # Logs dernière heure
sudo journalctl -u nox-api -n 100 --no-pager # 100 dernières lignes
sudo journalctl -u nox-api -p err             # Erreurs uniquement

```


### 📊 Variables d'environnement critiques


| Variable | Valeur par défaut | Description | Validation |

|----------|-------------------|-------------|------------|

| `NOX_API_TOKEN` | - | Token d'authentification (requis) | `[[ -n "$NOX_API_TOKEN" ]]` |

| `NOX_BIND_ADDR` | `127.0.0.1` | Adresse d'écoute | `ping -c 1 $NOX_BIND_ADDR` |

| `NOX_PORT` | `8080` | Port d'écoute | `sudo ss -lntp \| grep :$NOX_PORT` |

| `NOX_SANDBOX` | `/home/nox/nox/sandbox` | Répertoire sandbox | `sudo -u nox ls -la $NOX_SANDBOX` |

| `NOX_TIMEOUT` | `20` | Timeout exécution (sec) | `[[ "$NOX_TIMEOUT" =~ ^[0-9]+$ ]]` |


### 🛠️ Outils de maintenance


```bash

# Scripts automatisés
nox-debug              # Diagnostic complet
nox-debug health      # Tests de santé
nox-monitor 30        # Surveillance 30s
make demo             # Tests automatiques complets
make repair           # Réparation automatique


# Maintenance manuelle
sudo logrotate -f /etc/logrotate.d/nox-api    # Rotation logs forcée
sudo systemctl daemon-reload                   # Recharger systemd
sudo -u nox find /home/nox/nox/sandbox -type f -mtime +7 -delete  # Nettoyage sandbox

```


### 🚨 En cas de problème persistant


1. **Sauvegarder les logs :**
   ```bash
   sudo cp -r /var/log/nox-api /tmp/nox-api-logs-$(date +%Y%m%d)
   sudo journalctl -u nox-api --no-pager > /tmp/nox-systemd-logs-$(date +%Y%m%d).log
   ```


2. **Réinstallation complète :**
   ```bash
   # Sauvegarder la configuration
   sudo cp /etc/default/nox-api /tmp/nox-api-config-backup
   
   # Réinstaller
   cd nox-api-src
   sudo ./nox-api/deploy/install_nox.sh
   
   # Restaurer la configuration si nécessaire
   sudo cp /tmp/nox-api-config-backup /etc/default/nox-api
   sudo systemctl restart nox-api
   ```


3. **Support et debugging :**
   - Consulter les logs : `/var/log/nox-api/`
   - Vérifier la configuration : `/etc/default/nox-api`
   - Tester avec : `make demo`
   - Diagnostic : `nox-debug full`

---


## 10. License

Choose a license (MIT, Apache 2.0, etc.) and include it here.
