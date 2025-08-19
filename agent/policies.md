# Nox Agent Policies

1. The agent edits only in allowed paths (`agent/config.yaml` allowlist).
2. No direct pushes to `main`. All changes via branches and PRs.
3. Tests must be added or updated alongside code changes.
4. No secrets in code or logs. Use CI-provided secrets only.
5. Keep diffs small; split work if needed.
6. Every PR includes: summary, tests, risks, and rollback plan.
