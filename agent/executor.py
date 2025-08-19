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
