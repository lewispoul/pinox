# Nox Agent

A safe, testable self-coding agent that proposes patches via PRs with OpenAI integration and comprehensive guardrails.

## Environment Variables

- `OPENAI_API_KEY`: Required for LLM integration
- `GITHUB_TOKEN`: Required for PR creation (provided by CI)

## Run locally

### Standard run (applies patches and opens PR)
```bash
export OPENAI_API_KEY="sk-your-key-here"
python -m agent.executor --once
```

### Dry-run (plan and preview only)
```bash
export OPENAI_API_KEY="sk-your-key-here"
python -m agent.executor --once --dry-run
```

### Apply patches but skip PR creation
```bash
export OPENAI_API_KEY="sk-your-key-here"  
python -m agent.executor --once --no-pr
```

## Safety Features

### Branch Protection
- Agent refuses to run on `main` branch
- Working tree must be clean (no uncommitted changes)
- All changes via feature branches: `agent/<task-id>`

### Scope Control  
- Only edits files in `agent/config.yaml` allowlist
- Diff size limited by `max_patch_size_lines` setting
- Secrets automatically redacted from logs and PR bodies

### Guardrails
- Preflight checks before any LLM calls
- JSON validation of planner responses
- Unified diff validation before applying patches
- Test execution with results in PR

## Flow
1. Picks highest-priority task from `agent/tasks/backlog.yaml`
2. Builds planner prompt with repo context  
3. Calls OpenAI GPT-4o-mini for structured planning
4. Validates and applies patch within scope limits
5. Runs tests and opens PR with redacted results

## Configuration

Edit `agent/config.yaml` to adjust:
- File allowlists
- Diff size limits  
- LLM model and parameters
- Branch naming conventions
