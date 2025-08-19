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
            # Skip /dev/null which appears for new files
            if path != "/dev/null":
                touched.add(path)
    if not allowlist:
        return True
    return all(any(p.startswith(prefix.rstrip("*").rstrip("/")) for prefix in allowlist) for p in touched)

def count_added_lines(patch_text: str) -> int:
    """Count the number of lines added in a unified diff (excluding +++ headers)."""
    return sum(1 for line in patch_text.splitlines() 
               if line.startswith("+") and not line.startswith("+++"))

def ensure_directories_for_new_files(patch_text: str) -> None:
    """Create directories for any new files in the patch."""
    import pathlib
    for line in patch_text.splitlines():
        if line.startswith("new file mode"):
            # Look for the next +++ line to get the file path
            continue
        if line.startswith("+++ ") and "/dev/null" not in line:
            path = line.split("\t")[0].split(" ", 1)[1].strip()
            if path.startswith("b/"):
                path = path[2:]
            file_path = pathlib.Path(path)
            if not file_path.exists():
                file_path.parent.mkdir(parents=True, exist_ok=True)
