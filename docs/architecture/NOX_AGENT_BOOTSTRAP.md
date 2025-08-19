
# NOX Agent Bootstrap Pack (single file)
*Drop-in kit to let Copilot/GPT scaffold the self-coding agent for Nox.*

> Save this file at the repository root as **`NOX_AGENT_BOOTSTRAP.md`**, then copy the **Copilot Prompt** below into GitHub Copilot Chat (or your IDE assistant). It will read this file, create the files listed, and open a PR.

---

## 🚀 Copilot Prompt (copy me verbatim)

You are GitHub Copilot working in the **nox** repository. Implement the **Nox Agent** from the single-file spec below.

### Goals
- Create a safe, testable **self-coding agent** that opens PRs with small, scoped diffs.
- Provide an **agent loop** that reads `agent/tasks/backlog.yaml`, plans, proposes a patch, runs tests, and opens a PR.
- Add **CI** for tests and an optional **nightly agent** workflow.
- Add **guardrails**: scope allowlist, branch-only edits, PR template, secrets hygiene.
- Include minimal tests that pass now, plus placeholders for future end-to-end tests.

### Constraints
- Never push to `main`. Always work on branches `agent/<task-id>`.
- Edit **only** in allowed paths from the task scope.
- Write or update tests for new code. Initial e2e tests may be skipped with `@pytest.mark.skip` until features land.
- Do not leak secrets. Use CI secrets only.
- Keep diffs small and focused.

### Implementation steps
1) Read `NOX_AGENT_BOOTSTRAP.md` and extract the section **"Files to create"**.
2) Create each file exactly as defined, preserving paths and content.
3) If the repo already has conflicting paths, integrate without breaking existing code. Prefer additive changes.
4) Ensure `pytest` passes locally (at least the sanity tests).
5) Commit on a new branch `agent/bootstrap`, open a PR titled `agent: bootstrap self-coding framework` with the PR template.
6) In the PR body, include the **Run instructions** from this file and a short summary of what was created.

### After bootstrap
- Implement the first backlog item: `XTBA-001` (wire real XTB runner + parser) in a separate branch/PR.
- For each task, follow the planner prompt template in `agent/planner.py`.

### Deliverables
- All files from **"Files to create"** below.
- Passing `pytest` (sanity tests).
- A single PR with the branch `agent/bootstrap`.

Start now.

---

## 📦 Files to create

> Each block defines a file. Create them byte-for-byte unless noted.

### 1) `.github/PULL_REQUEST_TEMPLATE.md`
```md
### What
- Implements: <task id and title or "Bootstrap">

### How
- Key changes
- New tests

### Results
- pytest summary (paste relevant lines)
- benchmarks/artifacts if relevant

### Risks
- rollback plan

- [ ] New/updated tests included
- [ ] Scope respected
- [ ] No secrets in logs
```

### 2) `.github/workflows/ci.yml`
```yaml
name: CI
on:
  pull_request:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install deps
        run: |
          pip install -r requirements.txt || true
          pip install -r dev-requirements.txt || true
          pip install pytest pyyaml rich
      - name: Run tests
        run: pytest -q
```

### 3) `.github/workflows/agent-nightly.yml` (optional, can be disabled)
```yaml
name: Nox Agent Nightly
on:
  schedule: [{ cron: "0 3 * * *" }]
  workflow_dispatch:
jobs:
  agent:
    permissions:
      contents: write
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install deps
        run: |
          pip install -r requirements.txt || true
          pip install -r dev-requirements.txt || true
          pip install openai pyyaml rich pytest
      - name: Run agent loop (one-shot)
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: python -m agent.executor --once
```

### 4) `agent/config.yaml`
```yaml
# Nox Agent configuration
branch_prefix: "agent/"
planner:
  model: "gpt-4o-mini"
  max_tokens: 5000
  temperature: 0.2
files_allowlist:
  - "agent/**"
  - "api/**"
  - "nox/**"
  - "tests/**"
  - ".github/**"
  - "dev-requirements.txt"
policies:
  require_tests: true
  forbid_main_push: true
  max_patch_size_lines: 1200
```

### 5) `agent/policies.md`
```md
# Nox Agent Policies

1. The agent edits only in allowed paths (`agent/config.yaml` allowlist).
2. No direct pushes to `main`. All changes via branches and PRs.
3. Tests must be added or updated alongside code changes.
4. No secrets in code or logs. Use CI-provided secrets only.
5. Keep diffs small; split work if needed.
6. Every PR includes: summary, tests, risks, and rollback plan.
```

### 6) `agent/tasks/backlog.yaml`
```yaml
- id: XTBA-001
  title: Wire real XTB runner and robust xtbout.json parser
  priority: high
  scope:
    paths:
      - "nox/runners/xtb.py"
      - "nox/parsers/xtb_json.py"
      - "tests/xtb/"
  done_when:
    - "pytest -k xtb_end_to_end passes"
    - "endpoint /run_xtb returns energy, gap, dipole"

- id: JOBS-002
  title: Activate Dramatiq jobs from API with state polling
  priority: high
  scope:
    paths:
      - "api/routes/jobs.py"
      - "nox/jobs/"
      - "tests/jobs/"
  done_when:
    - "POST /jobs enqueues and /jobs/<id> shows states"

- id: CUBE-003
  title: Generate HOMO and LUMO .cube artifacts from XTB
  priority: medium
  scope:
    paths:
      - "nox/runners/xtb.py"
      - "nox/artifacts/"
      - "tests/cube/"
  done_when:
    - "endpoint returns cube artifacts; viewer test asserts presence"

- id: CJ-004
  title: Cantera CJ wrapper: Pcj, Tcj, CSV artifact
  priority: medium
  scope:
    paths:
      - "nox/runners/cantera_cj.py"
      - "api/routes/predict_cj.py"
      - "tests/cj/"
  done_when:
    - "simple CHNO case returns Pcj and Tcj with CSV"

- id: E2E-005
  title: End-to-end pytest: submit job, poll, collect results
  priority: medium
  scope:
    paths:
      - "tests/e2e/"
  done_when:
    - "submit -> poll -> results with scalars and artifacts"
```

### 7) `agent/planner.py`
```python
# file: agent/planner.py
from __future__ import annotations
import os, json, textwrap
from typing import Dict, Any, List, Tuple

PROMPT_TEMPLATE = textwrap.dedent("""\
System: You are the Nox Planner. Output only a compact JSON object with keys:
- rationale: short reasoning
- files_to_edit: list of paths (must be inside allowed scope)
- tests_to_add: list of test file paths
- commands_to_run: list of shell commands (pytest etc.)
- risks: short bullet list
- expected_outputs: short bullet list
- patch: a single unified diff covering all edits (unix newlines)

Constraints:
- Edit only within scope paths.
- Prefer test-first changes.
- Keep patch small and idempotent.
- No secrets, no external network calls.

User:
Task:
{task_yaml}

Repo tree (trimmed):
{repo_tree}

Key file snippets:
{file_snippets}

Current test output (if any):
{test_output}
""")

def build_planner_prompt(task_yaml: str, repo_tree: str, file_snippets: str, test_output: str="") -> str:
    return PROMPT_TEMPLATE.format(
        task_yaml=task_yaml.strip(),
        repo_tree=repo_tree.strip(),
        file_snippets=file_snippets.strip(),
        test_output=test_output.strip(),
    )

def parse_planner_json(text: str) -> Dict[str, Any]:
    # Be lenient: find the first { ... } block.
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("Planner did not return JSON.")
    raw = text[start:end+1]
    return json.loads(raw)
```

### 8) `agent/tools/fs.py`
```python
# file: agent/tools/fs.py
from __future__ import annotations
import os, io, subprocess, pathlib, difflib, re, yaml
from typing import Dict, Any

ROOT = pathlib.Path(__file__).resolve().parents[2]

def read(path: str) -> str:
    p = ROOT / path
    with open(p, "r", encoding="utf-8") as f:
        return f.read()

def write(path: str, content: str) -> None:
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)

def list_tree(base: str=".", max_depth: int=3) -> str:
    base_path = (ROOT / base).resolve()
    out = []
    for root, dirs, files in os.walk(base_path):
        depth = len(pathlib.Path(root).relative_to(base_path).parts)
        if depth > max_depth: 
            continue
        rel_root = str(pathlib.Path(root).relative_to(ROOT))
        out.append(rel_root + "/")
        for name in sorted(files):
            out.append(str(pathlib.Path(root, name).relative_to(ROOT)))
    return "\n".join(out)

def pick_task(backlog_path: str) -> Dict[str, Any]:
    import yaml as _yaml
    data = _yaml.safe_load(read(backlog_path)) or []
    if not data:
        raise RuntimeError("No tasks in backlog.")
    # naive: pick highest priority then first
    prio_order = {"high": 0, "medium": 1, "low": 2}
    data.sort(key=lambda t: prio_order.get(t.get("priority","medium"), 1))
    return data[0]

def read_context(task: Dict[str, Any]) -> Dict[str, Any]:
    scope_paths = task.get("scope", {}).get("paths", [])
    snippets = []
    for path in scope_paths:
        try:
            snippets.append(f"### {path}\n" + read(path)[:4000])
        except Exception:
            continue
    return {
        "task_yaml": yaml.safe_dump(task, sort_keys=False),
        "repo_tree": list_tree("."),
        "file_snippets": "\n\n".join(snippets),
    }
```

### 9) `agent/tools/git.py`
```python
# file: agent/tools/git.py
from __future__ import annotations
import subprocess

def sh(cmd: str) -> str:
    return subprocess.check_output(cmd, shell=True, text=True).strip()

def create_branch(branch: str) -> None:
    sh(f"git checkout -b {branch}")

def commit_all(msg: str) -> None:
    sh('git add -A')
    sh(f'git commit -m "{msg}"')

def open_pr(title: str, body: str) -> None:
    # Rely on GitHub CLI if available; otherwise print instructions.
    try:
        sh(f'gh pr create --title "{title}" --body "{body}"')
    except Exception:
        print("# gh not found. Open a PR manually via GitHub Web UI.")
        print("## PR TITLE:", title)
        print("## PR BODY:\n", body)
```

### 10) `agent/tools/shell.py`
```python
# file: agent/tools/shell.py
from __future__ import annotations
import subprocess, shlex, os

def run(cmd: str, timeout: int = 600) -> int:
    print(f"$ {cmd}")
    proc = subprocess.Popen(cmd, shell=True)
    try:
        return proc.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        proc.kill()
        return 124
```

### 11) `agent/tools/tests.py`
```python
# file: agent/tools/tests.py
from __future__ import annotations
import subprocess

_last_output = ""

def run_all() -> bool:
    global _last_output
    try:
        out = subprocess.check_output("pytest -q", shell=True, text=True, stderr=subprocess.STDOUT)
        _last_output = out
        print(out)
        return True
    except subprocess.CalledProcessError as e:
        _last_output = e.output
        print(e.output)
        return False

def last_output() -> str:
    return _last_output
```

### 12) `agent/tools/codeedit.py`
```python
# file: agent/tools/codeedit.py
from __future__ import annotations
import re, os, pathlib
from typing import Iterable

def check_unified_diff(patch_text: str) -> None:
    if not patch_text.strip().startswith(("diff --git", "@@")):
        # be permissive; many LLMs output pure @@ hunks
        pass
    if "diff --git" not in patch_text and "@@ " not in patch_text:
        raise ValueError("Patch does not look like a unified diff.")

def only_in_allowed_paths(patch_text: str, allowlist: Iterable[str]=()) -> bool:
    # naive path filter: forbid edits outside listed prefixes
    touched = set()
    for line in patch_text.splitlines():
        if line.startswith(("+++ ", "--- ")):
            path = line.split("\t")[0].split(" ", 1)[1].strip()
            if path.startswith(("a/", "b/")): path = path[2:]
            touched.add(path)
    if not allowlist:
        return True
    return all(any(p.startswith(prefix.rstrip("*").rstrip("/")) for prefix in allowlist) for p in touched)
```

### 13) `agent/reporter.py`
```python
# file: agent/reporter.py
from __future__ import annotations

def summarize_run(task, plan, patch_ok: bool, tests_ok: bool, test_output: str) -> str:
    lines = []
    lines.append(f"### Task\n- {task.get('id')} — {task.get('title')}")
    lines.append("### Plan")
    lines.append(f"```json\n{plan}\n```")
    lines.append("### Tests")
    lines.append("```\n" + (test_output[-2000:] if test_output else "no output") + "\n```")
    lines.append("### Status")
    lines.append(f"- Patch applied: {'yes' if patch_ok else 'no'}")
    lines.append(f"- Tests passed: {'yes' if tests_ok else 'no'}")
    lines.append("### Risks\n- See policies.md and plan.risks")
    return "\n\n".join(lines)
```

### 14) `agent/executor.py`
```python
# file: agent/executor.py
from __future__ import annotations
import argparse, json, yaml
from pathlib import Path
from agent.tools import fs, git, shell, tests, codeedit
from agent.planner import build_planner_prompt, parse_planner_json
from agent.reporter import summarize_run

def load_config():
    try:
        import yaml as _yaml
        return _yaml.safe_load(fs.read("agent/config.yaml")) or {}
    except Exception:
        return {}

def call_llm(prompt: str) -> str:
    # Placeholder: Copilot will wire actual LLM call if desired.
    # For bootstrap, just return a minimal plan with no patch.
    dummy = {
        "rationale": "Bootstrap run — no-op patch.",
        "files_to_edit": [],
        "tests_to_add": [],
        "commands_to_run": ["pytest -q"],
        "risks": ["No-op bootstrap"],
        "expected_outputs": ["CI sanity passes"],
        "patch": ""
    }
    return json.dumps(dummy, indent=2)

def apply_patch(patch: str, allowlist):
    if not patch.strip():
        return False
    codeedit.check_unified_diff(patch)
    if not codeedit.only_in_allowed_paths(patch, allowlist):
        raise RuntimeError("Patch touches files outside allowlist.")
    # Simple application via 'git apply' to keep it robust
    from subprocess import check_call, CalledProcessError
    try:
        Path(".agent_patch.diff").write_text(patch, encoding="utf-8")
        check_call("git apply --whitespace=nowarn .agent_patch.diff", shell=True)
        return True
    finally:
        try:
            Path(".agent_patch.diff").unlink()
        except Exception:
            pass

def run_once() -> bool:
    cfg = load_config()
    task = fs.pick_task("agent/tasks/backlog.yaml")
    ctx = fs.read_context(task)
    prompt = build_planner_prompt(ctx["task_yaml"], ctx["repo_tree"], ctx["file_snippets"])

    plan_text = call_llm(prompt)  # Copilot to replace with real LLM
    plan = plan_text
    try:
        plan_json = parse_planner_json(plan_text)
        plan = json.dumps(plan_json, indent=2)
    except Exception:
        plan_json = {"patch": ""}

    branch = f"{cfg.get('branch_prefix','agent/')}{task.get('id','task')}"
    git.create_branch(branch)

    patch_ok = apply_patch(plan_json.get("patch",""), cfg.get("files_allowlist", []))
    if patch_ok:
        git.commit_all(f"agent: apply patch for {task.get('id')}")

    tests_ok = tests.run_all()
    report = summarize_run(task, plan, patch_ok, tests_ok, tests.last_output())
    git.open_pr(title=f"agent: {task.get('id')} {task.get('title')}", body=report)
    return tests_ok

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--once", action="store_true", help="Run a single cycle")
    args = ap.parse_args()
    if args.once:
        run_once()
    else:
        # one-shot by default for bootstrap to avoid infinite loops in CI
        run_once()

if __name__ == "__main__":
    main()
```

### 15) `tests/e2e/test_agent_sanity.py`
```python
# file: tests/e2e/test_agent_sanity.py
import yaml, os, pathlib

def test_backlog_exists_and_has_tasks():
    path = pathlib.Path("agent/tasks/backlog.yaml")
    assert path.exists(), "backlog.yaml missing"
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    assert isinstance(data, list) and len(data) >= 1

def test_config_exists():
    path = pathlib.Path("agent/config.yaml")
    assert path.exists(), "agent/config.yaml missing"
```

### 16) `tests/xtb/test_xtb_end_to_end.py` (skipped placeholder)
```python
# file: tests/xtb/test_xtb_end_to_end.py
import pytest

@pytest.mark.skip("Will be enabled by task XTBA-001")
def test_xtb_end_to_end():
    assert False, "Implement real XTB integration and assertions"
```

### 17) `README_AGENT.md`
```md
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
```

---

## ▶️ Run instructions (paste into PR body too)
- Ensure Python 3.11+ and `pytest pyyaml rich` are available.
- Run locally: `python -m agent.executor --once`
- CI runs on every PR; the **nightly agent** workflow can be triggered manually in Actions.
- First backlog item is **XTBA-001**.

## ✅ What passes right now
- Sanity tests only. End-to-end tests are skipped until features are implemented.

## 🧰 Notes
- If you use GitHub CLI, `gh pr create` will be used automatically.
- Otherwise the executor prints PR title/body for manual creation.

---

## 🧩 What is this file
A single-file spec that Copilot reads to scaffold the initial agent system. After merging the bootstrap PR, proceed with the backlog tasks in small, reviewable PRs.
