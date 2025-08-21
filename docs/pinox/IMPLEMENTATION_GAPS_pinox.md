# Implementation Gaps — Pinox

This file tracks missing pieces required to make Pinox production-ready.

---

## 1. Core Data & API
- [ ] Define **Job model** with status transitions (queued → running → succeeded/failed).
- [ ] Implement DB migrations (jobs, runs, artifacts, users).
- [ ] Add artifact store (MinIO buckets for logs/results).
- [ ] Flesh out `/api/v1/jobs` (create/list/get/update).

## 2. Runner & Sandbox
- [ ] Wire Dramatiq queue between gateway and runner.
- [ ] Implement Docker sandbox policy (caps, timeouts, logs).
- [ ] Provide base images (python, xtb, psi4, cantera).

## 3. Nox + IAM Integration
- [ ] Proxy Nox endpoints in gateway (`/predict/xtb`, `/predict/psi4`, `/predict/vod`, `/predict/cj`).
- [ ] Register job types with schemas (params + expected artifacts).

## 4. Mail + Inbox Loop
- [ ] Complete IMAP poller (allowlist, HMAC verify).
- [ ] Implement inbox watcher YAML → job.
- [ ] Result notifier: send signed artifact links.

## 5. IDE GUI
- [ ] Add Monaco editor + FileTree.
- [ ] Run button → POST job.
- [ ] WebSocket logs.
- [ ] Diff viewer + approval gate.

## 6. Auth & Security
- [ ] JWT middleware (users + service tokens).
- [ ] Role-based access (admin, runner, viewer).
- [ ] Rate limits, CORS, secret hygiene.

## 7. Observability
- [ ] Structured logging (JSON with job_id).
- [ ] Metrics endpoints (Prometheus).
- [ ] Backups: DB + MinIO snapshot scripts.

## 8. CI/CD
- [ ] CI pipeline: lint, typecheck, unit + e2e tests.
- [ ] Versioned Docker images.
- [ ] Multi-arch builds (x86_64 + arm64 for Pi).

## 9. Tests
- [ ] Unit: HMAC, YAML parser, job validation.
- [ ] Contract: each job type input/output.
- [ ] E2E: REST, mail, inbox, IDE flows.

---

## MVP Definition of Done
- `docker compose up` brings all services.
- One happy-path job (e.g. XTB opt) runs end-to-end:
  - Submit job via REST → queue → runner → artifact in MinIO.
  - Same via inbox and via IDE.
- CI green with unit + e2e tests.
