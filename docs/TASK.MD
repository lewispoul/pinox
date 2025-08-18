# Nox – Master Task List

This file is the **single source of truth** for all ongoing tasks, milestones, and backlogs.  
Every task is tracked here with:
- **id**: unique slug
- **status**: todo / in-progress / done
- **owner**: default = lpp
- **depends_on**: list of ids
- **files**: key files involved
- **done_when**: completion criteria
- **next_actions**: actionable steps

---

## References
- [NOX_PURPOSE.md](./NOX_PURPOSE.md) – global purpose
- [NOX_AGENTS.md](./NOX_AGENTS.md) – agent types
- [NOX_INTELLIGENT_API.md](./NOX_INTELLIGENT_API.md) – intelligent API design
- [NOX_CJ_MODULE.md](./NOX_CJ_MODULE.md) – Cantera CJ module
- [NOX_REPO_AGENT.md](./NOX_REPO_AGENT.md) – repo agent design

---

## Milestones

### [M1] Intelligent AI API
- id: m1-intelligent-api
- status: in-progress
- owner: lpp
- depends_on: []
- files: [/nox/agent/core.py, /nox/api/agent.py, /nox/agent/router.py]
- done_when:
  - `POST /agent/ask` returns summary + artifacts
  - Guardrails active (modeling-only)
  - IAM UI can query `/agent/ask`
- next_actions:
  1. Implement agent core loop in `core.py`
  2. Map intents to jobs in `router.py`
  3. Add FastAPI routes in `agent.py`
  4. Write 3 unit tests for basic intents

---

### [M2] Cantera CJ Module
- id: m2-cj-module
- status: todo
- owner: lpp
- depends_on: []
- files: [/nox/runners/cantera_cj.py, data/thermo/energetics.yaml]
- done_when:
  - `POST /predict/cj/v1` works for CHNO
  - `POST /predict/cj-metals/v1` supports B/Al afterburn
  - Outputs Pcj, VoD, Tcj, composition
- next_actions:
  1. Collect NASA-7 thermo data (CHNO, B2O3, Al2O3, etc.)
  2. Implement Gibbs minimization + CJ search loop
  3. Benchmark vs CHEETAH/Explo5 values for TNT, RDX

---

### [M3] Repo Agent
- id: m3-repo-agent
- status: in-progress
- owner: lpp
- depends_on: [m1-intelligent-api]
- files: [/nox/agent/repo_agent.py, TASKS.md, ROADMAP.md]
- done_when:
  - Repo agent can scan TASKS.md and open PR with updates
  - Nightly CI workflow triggers with a recap
- next_actions:
  1. Implement `scan_repo` to parse TASKS.md + TODOs
  2. Implement `make_plan` to propose next actions
  3. Wire `/repo-agent/ask` FastAPI route
  4. Add GitHub Actions workflow

---

### [M4] IAM Integration
- id: m4-iam-integration
- status: todo
- owner: lpp
- depends_on: [m1-intelligent-api]
- files: [IAM_GUI/*, /nox/api/agent.py]
- done_when:
  - IAM UI can call `/agent/ask` and display answer + trace
- next_actions:
  1. Add “Ask Nox” panel in IAM frontend
  2. Display summary + artifact links
  3. Test with simple SMILES input

---

### [M5] Autonomy (Watchers + Schedulers)
- id: m5-autonomy
- status: todo
- owner: lpp
- depends_on: [m1-intelligent-api, m2-cj-module]
- files: [/nox/watchers/*, /nox/agent/core.py]
- done_when:
  - Nox can auto-run QuickPredict when `.xyz` appears in `ToAnalyze/`
  - Daily summary written at 22:00
- next_actions:
  1. Implement folder watcher for `ToAnalyze/`
  2. Add scheduler for daily recap
  3. Extend agent memory with daily logs