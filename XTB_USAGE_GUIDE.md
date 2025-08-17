# 🧪 Guide d'utilisation - Socle XTB API

## Vue d'ensemble

Ce socle fournit une **API REST complète** pour intégrer XTB (quantum chemistry engine) dans un écosystème modern avec **FastAPI + Dramatiq + Redis**.

### Architecture

```
api/                 # API REST avec FastAPI
├── main.py         # Point d'entrée principal 
├── routes/         # Endpoints REST
│   └── jobs.py     # Gestion jobs XTB (/jobs, /jobs/{id}, /jobs/{id}/artifacts)
├── schemas/        # Modèles Pydantic v2
│   └── jobs.py     # JobRequest, JobResponse, JobResults
└── services/       # Services business
    ├── queue.py    # Configuration Dramatiq + Redis
    ├── jobs.py     # JobManager avec UUID + cache
    └── settings.py # Configuration centralisée

ai/runners/xtb.py   # Engine XTB avec parsers JSON + texte

tests/              # Tests async avec pytest-asyncio
└── test_api_minimal.py  # Tests complets API + job flow
```

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
pip install fastapi uvicorn dramatiq redis pydantic-settings pytest pytest-asyncio httpx anyio
```

### 2. Démarrage Redis (requis pour Dramatiq)

```bash
redis-server  # ou via Docker: docker run -d -p 6379:6379 redis
```

### 3. Démarrage de l'API

```bash
cd /path/to/nox-api-src
uvicorn api.main:app --reload --port 8000
```

### 4. Démarrage du worker Dramatiq (en parallèle)

```bash
cd /path/to/nox-api-src  
dramatiq api.routes.jobs:process_xtb_job
```

### 5. Test de l'API

```bash
# Health check
curl http://localhost:8000/health

# Soumission job XTB  
curl -X POST http://localhost:8000/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "engine": "xtb",
    "kind": "opt_properties", 
    "inputs": {
      "xyz": "2\\nH2\\nH 0 0 0\\nH 0 0 0.74\\n",
      "charge": 0,
      "multiplicity": 1
    }
  }'

# Récupération statut job
curl http://localhost:8000/jobs/{job_id}

# Récupération artifacts (une fois terminé)
curl http://localhost:8000/jobs/{job_id}/artifacts
```

## 🧪 Intégration XTB

### Configuration XTB

Le binaire XTB doit être disponible dans le PATH ou configuré via `.env`:

```bash
# .env
XTB_BIN=xtb                    # ou /path/to/xtb
ARTIFACTS_ROOT=./artifacts     # stockage résultats
REDIS_URL=redis://127.0.0.1:6379/0
```

### Parsers intégrés

Le runner XTB dispose de **2 parsers robustes** :

1. **Parser JSON** (`parse_xtb_json`) : Extrait depuis `xtbout.json`
   - Énergie totale (hartree)
   - Gap HOMO-LUMO (eV)  
   - Moment dipolaire (Debye)
   - Masse moléculaire, charge totale

2. **Parser texte** (`parse_xtb_simple`) : Fallback sur `xtb.log`
   - Pattern matching énergie totale
   - Résistant aux variations de format

### Paramètres de calcul supportés

```python
{
  "gfn": 2,              # GFN2-xTB (défaut), 1 pour GFN1-xTB  
  "opt": True,           # Optimisation géométrie
  "hess": False,         # Calcul hessienne
  "uhf": False,          # Unrestricted HF
  "chrg": 0,             # Charge moléculaire
  "json_output": True    # Sortie JSON structurée
}
```

## 🔧 Tests

### Exécution des tests

```bash
cd /path/to/nox-api-src
python -m pytest tests/test_api_minimal.py -xvs
```

**Tests inclus** :
- ✅ `test_health` : Endpoint santé API  
- ✅ `test_jobs_flow` : Cycle complet création job → statut → artifacts

### Tests de charge (à venir)

Le socle est **prêt pour la montée en charge** avec Dramatiq :
- Jobs parallèles via Redis queue
- Workers distribuables sur plusieurs machines  
- Monitoring via Dramatiq dashboard

## 🎯 Points d'extension

### 1. Monitoring avancé
```python
# Intégration Prometheus/Grafana via FastAPI middleware
# Métriques : temps calcul, taux succès, queue depth
```

### 2. Authentification
```python
# OAuth2 via FastAPI security (déjà présent dans le projet NOX parent)
# JWT tokens pour accès API
```

### 3. Stockage persistant  
```python
# Base de données jobs (PostgreSQL via SQLModel)
# S3 pour artifacts volumineux
```

### 4. Autres engines chimiques
```python
# Structure modulaire prête pour ORCA, Gaussian, etc.
# Ajout dans ai/runners/
```

## 📋 Statuts de jobs

- **`pending`** : Job en queue Dramatiq, pas encore traité
- **`running`** : Calcul XTB en cours d'exécution
- **`completed`** : Succès, résultats disponibles dans `/jobs/{id}/artifacts`  
- **`failed`** : Échec calcul, logs d'erreur disponibles

## 🎉 Socle complété

Le socle XTB est **100% fonctionnel** avec :

✅ API REST moderne (FastAPI + Pydantic v2)  
✅ Job queue asynchrone (Dramatiq + Redis)  
✅ Intégration XTB avec parsers robustes  
✅ Tests automatisés (pytest-asyncio)  
✅ Architecture extensible et scalable  
✅ Documentation complète

**Prêt pour développement chimie computationnelle !** 🚀
