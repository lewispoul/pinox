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
