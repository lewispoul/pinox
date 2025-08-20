#!/usr/bin/env python3
"""Debug allowlist path checking."""

import re

def only_in_allowed_paths(patch_text: str, allowlist) -> bool:
    # naive path filter: forbid edits outside listed prefixes
    touched = set()
    for line in patch_text.splitlines():
        if line.startswith(("+++ ", "--- ")):
            path = line.split("\t")[0].split(" ", 1)[1].strip()
            if path.startswith(("a/", "b/")): path = path[2:]
            # Skip /dev/null which appears for new files
            if path != "/dev/null":
                touched.add(path)
    
    print(f"DEBUG: Touched paths: {touched}")
    print(f"DEBUG: Allowlist: {allowlist}")
    
    if not allowlist:
        return True
    
    for p in touched:
        allowed = False
        for prefix in allowlist:
            prefix_clean = prefix.rstrip("*").rstrip("/")
            if p.startswith(prefix_clean):
                allowed = True
                break
        if not allowed:
            print(f"DEBUG: Path '{p}' not allowed by any prefix in allowlist")
            return False
    
    return True

# Test with a sample patch
patch_text = """diff --git a/nox/runners/xtb.py b/nox/runners/xtb.py
index abcdef1..1234567 100644
--- a/nox/runners/xtb.py
+++ b/nox/runners/xtb.py
@@ -1,10 +1,12 @@
 import json
 
 def run_xtb(input_data):
-    return {'energy': 42.0, 'gap': 1.5, 'dipole': 0.1}
+    # Implement the actual logic to run XTB here
+    # For now, returning dummy values
+    return {'energy': 42.0, 'gap': 1.5, 'dipole': 0.1}

diff --git a/tests/xtb/test_xtb_end_to_end.py b/tests/xtb/test_xtb_end_to_end.py
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/tests/xtb/test_xtb_end_to_end.py
@@ -0,0 +1,10 @@
+import pytest
+from nox.runners.xtb import run_xtb
+
+def test_run_xtb():
+    result = run_xtb({})
+    assert result['energy'] == 42.0
+    assert result['gap'] == 1.5
+    assert result['dipole'] == 0.1
"""

allowlist = ["agent/**", "api/**", "nox/**", "tests/**", ".github/**", "dev-requirements.txt"]

result = only_in_allowed_paths(patch_text, allowlist)
print(f"Result: {result}")
