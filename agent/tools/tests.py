# file: agent/tools/tests.py
from __future__ import annotations
import subprocess
import sys

_last_output = ""


def run_all() -> bool:
    """Run the test suite using the current Python interpreter.

    This avoids depending on the PATH or an external 'pytest' binary.
    Returns True if tests exit with code 0, False otherwise. The
    combined stdout/stderr is stored in _last_output.
    """
    global _last_output
    cmd = [sys.executable, "-m", "pytest", "-q"]
    try:
        out = subprocess.check_output(cmd, text=True, stderr=subprocess.STDOUT)
        _last_output = out
        print(out)
        return True
    except subprocess.CalledProcessError as e:
        # pytest returned non-zero (tests failed or runtime error)
        _last_output = e.output
        print(e.output)
        return False
    except FileNotFoundError as e:
        # Extremely unlikely since sys.executable exists, but handle defensively
        _last_output = str(e)
        print(f"Failed to run tests: {e}")
        return False


def last_output() -> str:
    return _last_output
