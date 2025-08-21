import os
import shutil
import subprocess


def have(cmd: str) -> bool:
    return shutil.which(cmd) is not None


def run(cmd: str, *, check=True, cwd=None, env=None, capture_output=True) -> dict:
    # Hard gate for service mode
    if os.getenv("NOX_AGENT_MODE") == "service" or os.getenv("NOX_AGENT_DISABLE_SHELL") == "1":
        return {"skipped": True, "reason": "service mode", "cmd": cmd, "rc": 0, "out": "", "err": ""}
    proc = subprocess.run(
        cmd, shell=True, cwd=cwd, env=env, text=True, capture_output=capture_output
    )
    if check and proc.returncode != 0:
        raise RuntimeError(f"cmd failed: {cmd}\n{proc.stdout}\n{proc.stderr}")
    return {"skipped": False, "rc": proc.returncode, "out": proc.stdout, "err": proc.stderr}
