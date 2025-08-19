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

CRITICAL DIFF FORMAT:
For new files that don't exist yet, use this format:
diff --git a/path/to/newfile.py b/path/to/newfile.py
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/path/to/newfile.py
@@ -0,0 +1,10 @@
+#!/usr/bin/env python3
+
+def new_function():
+    return "hello world"
+
+if __name__ == "__main__":
+    print(new_function())

For existing files, show the changes:
diff --git a/path/to/file.py b/path/to/file.py
index abcdef1..1234567 100644  
--- a/path/to/file.py
+++ b/path/to/file.py
@@ -10,3 +10,5 @@ def existing_function():
     return value
 
 def other_function():
+    # New code here
+    pass

IMPORTANT: Keep all lines in the patch under 120 characters. Do not let lines wrap or break in the middle. If a line is too long, break it naturally at appropriate points with proper indentation.

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
