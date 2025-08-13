import os, io, json, subprocess, shlex, tempfile, pathlib
from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from pydantic import BaseModel, Field

app = FastAPI()

NOX_TOKEN   = os.getenv("NOX_API_TOKEN", "").strip()
SANDBOX     = pathlib.Path(os.getenv("NOX_SANDBOX", "/home/nox/nox/sandbox")).resolve()
TIMEOUT_SEC = int(os.getenv("NOX_TIMEOUT", "20"))

SANDBOX.mkdir(parents=True, exist_ok=True)

def check_auth(auth: str | None):
    if not NOX_TOKEN:
        return
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    if auth.removeprefix("Bearer ").strip() != NOX_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")

def safe_join(relpath: str) -> pathlib.Path:
    p = (SANDBOX / relpath.lstrip("/")).resolve()
    if SANDBOX not in p.parents and p != SANDBOX:
        raise HTTPException(status_code=400, detail="Path escapes sandbox")
    return p

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/put")
async def put_file(path: str, f: UploadFile = File(...), authorization: str | None = Header(default=None, alias="Authorization")):
    check_auth(authorization)
    dest = safe_join(path)
    dest.parent.mkdir(parents=True, exist_ok=True)
    data = await f.read()
    dest.write_bytes(data)
    return {"saved": str(dest)}

class RunPy(BaseModel):
    code: str
    filename: str = Field(default="run.py")

@app.post("/run_py")
def run_py(body: RunPy, authorization: str | None = Header(default=None, alias="Authorization")):
    check_auth(authorization)
    target = safe_join(body.filename)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(body.code)
    try:
        proc = subprocess.run(
            ["python3", str(target)],
            cwd=str(SANDBOX),
            capture_output=True,
            text=True,
            timeout=TIMEOUT_SEC
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Timeout")
    return {"returncode": proc.returncode, "stdout": proc.stdout, "stderr": proc.stderr}

FORBIDDEN = {"rm", "reboot", "shutdown", "mkfs", "dd", "mount", "umount", "kill", "pkill", "sudo"}
class RunSh(BaseModel):
    cmd: str

@app.post("/run_sh")
def run_sh(body: RunSh, authorization: str | None = Header(default=None, alias="Authorization")):
    check_auth(authorization)
    parts = shlex.split(body.cmd)
    if not parts:
        raise HTTPException(status_code=400, detail="Empty command")
    if parts[0] in FORBIDDEN:
        raise HTTPException(status_code=400, detail="Forbidden command")
    try:
        proc = subprocess.run(parts, cwd=str(SANDBOX), capture_output=True, text=True, timeout=TIMEOUT_SEC)
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Timeout")
    return {"returncode": proc.returncode, "stdout": proc.stdout, "stderr": proc.stderr}
