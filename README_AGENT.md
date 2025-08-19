# Nox Agent

A safe, testable self-coding agent that proposes patches via PRs.

## Run locally
```bash
python -m agent.executor --once
```

## Flow
1. Picks highest-priority task from `agent/tasks/backlog.yaml`
2. Builds planner prompt with repo context
3. Produces a patch (initially no-op)
4. Runs tests and opens a PR with results

Wire a real LLM in `agent/executor.py:call_llm` when ready.
