# E2E Milestone — Hermetic Tests for NOX API

Milestone date: 2025-08-20

Goal
- Provide a hermetic E2E testing capability for the NOX API that runs fully in-process (no external dramatiq/redis required) and is fast and deterministic for CI.

What was delivered
- `tests/e2e/test_end_to_end.py` — end-to-end tests using `httpx.ASGITransport`.
- Injectable XTB runner (`set_xtb_runner`) so tests can stub expensive binary calls.
- `JOBS_FORCE_LOCAL` env knob + `settings.jobs_force_local` to force local thread runner in tests.
- Payload preservation so worker results include original payload for assertions.
- Background dispatch for enqueue to reduce synchronous actor execution in test environments.

Acceptance criteria (status)
- E2E tests run hermetically and pass locally: PASSED
- Full pytest run is green: PASSED (50 passed, 1 skipped)

Key files modified/added
- `api/services/queue.py` — runner injection, payload injection, returncode handling
- `api/services/settings.py` — `jobs_force_local` flag
- `tests/e2e/test_end_to_end.py` — E2E tests (existing)
- `tests/unit/test_xtb_runner.py` — unit tests for runner injection
- `docs/dev/E2E-SESSION_SUMMARY.md` — summary and run instructions

Risks / constraints
- Timing/race differences between local-mode and external queue mode can make strict state assertions brittle; tests are currently tolerant where necessary.

Next milestone
- Implement a small in-process queue that provides deterministic actor dispatch for test environments so tests can assert strict ordering and states.
