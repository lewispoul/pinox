# Copilot Kickoff — Continue NOX + IAM 2.0

Context:
- NOX is an API platform with interactive docs, AI helper, and live API explorer.
- IAM 2.0 is a separate backend project. We integrate via **Option A** (separate repos + SDK/API).
- P3.3 (UX) is at 50%: M9.1–M9.3 DONE. Next: **M9.4 SDK Generator**, then M9.5, M9.6.
- After P3.3, publish IAM SDKs and connect IAM dev sandbox to NOX.
- Then start **M10 Jobs Core + DB** with IAM integration in mind.

Your tasks (follow in order; update trackers after each):
1) Implement **M9.4 SDK Generator** in the interactive docs: generate TS/Python/curl snippets from OpenAPI + current form state. One‑click copy/download.
2) Polish UI (**M9.5**): search, filter, favorites, responsive layout.
3) Optimize perf (**M9.6**): lazy loading, WS reconnection, reduce bundle size.
4) Publish **IAM SDKs** (TS + Py) to GitHub Packages; add IAM API section to Live Explorer.
5) Start **M10 Jobs Core + DB**: migrations (jobs/modules), endpoints, minimal worker, metrics, RBAC.

Rules:
- Keep NOX and IAM in separate repos. Refer to **CONNECTING_NOX_IAM.md** (Option A).
- Do not remove or overwrite existing docs. Append **SESSION COMPLETION SUMMARY** each session.
- After each milestone, update: PROJECT_NEXT_STEPS.md, PHASE2_PHASE3_PROGRESS.md, and relevant trackers.

Artifacts to open:
- PROJECT_NEXT_STEPS.md — the sequence to follow
- CONNECTING_NOX_IAM.md — integration plan (Option A)

Go to: **M9.4 SDK Generator** now.
