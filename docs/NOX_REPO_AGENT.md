# Repo Agent for Nox

A meta-agent that manages tasks and instructions inside the repo.

## Purpose
- Prevent getting lost in the repo or backlog.
- Read/write `TASKS.md`, `ROADMAP.md`, and ADRs.
- Generate or update instructions, stubs, and checklists.
- Open PRs with changes.

## Flow
1. **Scan** repo (TASKS.md, TODOs in code, open issues).
2. **Plan** next actions.
3. **Act**: edit docs, create stubs, open PR.
4. **Report**: update tasks status, nightly recap.

## Endpoints
- `POST /repo-agent/ask` → plan or run instructions.
- Config in `/.nox/agent.yaml`.

## Benefits
- Centralized task list.
- Daily recap and “next actions” always visible.
- Keeps code/docs/tasks synchronized.