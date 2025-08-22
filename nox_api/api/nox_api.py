import os
import subprocess
import shlex
import pathlib
import json
import tempfile
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import Response, HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Local imports
from .metrics_chatgpt import metrics_response, update_sandbox_metrics
from .middleware import MetricsMiddleware
from .rate_limit_and_policy import RateLimitAndPolicyMiddleware

app = FastAPI(
    title="Nox API",
    description="API sécurisée d'exécution de code - Phase 2.2 avec Observabilité",
    version="2.2.0",
)

NOX_METRICS_ENABLED = os.getenv("NOX_METRICS_ENABLED", "1") == "1"

# Application des middlewares dans l'ordre recommandé par ChatGPT
app.add_middleware(MetricsMiddleware)
app.add_middleware(RateLimitAndPolicyMiddleware)

NOX_TOKEN = os.getenv("NOX_API_TOKEN", "").strip()
SANDBOX = pathlib.Path(os.getenv("NOX_SANDBOX", "/tmp/nox_sandbox")).resolve()
TIMEOUT_SEC = int(os.getenv("NOX_TIMEOUT", "20"))

try:
    SANDBOX.mkdir(parents=True, exist_ok=True)
except PermissionError:
    # Fallback to a temporary directory if we don't have permissions
    import tempfile
    SANDBOX = pathlib.Path(tempfile.mkdtemp(prefix="nox_sandbox_"))
    print(f"Warning: Using temporary sandbox at {SANDBOX}")
except Exception as e:
    print(f"Warning: Could not create sandbox: {e}")
    # Still set SANDBOX to avoid import errors
    SANDBOX = pathlib.Path("/tmp")


def check_auth(auth: str | None):
    if not NOX_TOKEN:
        return
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    if auth.removeprefix("Bearer ").strip() != NOX_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")


def safe_join(relpath: str) -> pathlib.Path:
    # Remove leading slashes to prevent absolute path escapes
    cleaned_path = relpath.lstrip("/")
    p = (SANDBOX / cleaned_path).resolve()
    if SANDBOX not in p.parents and p != SANDBOX:
        raise HTTPException(status_code=400, detail="Path escapes sandbox")
    return p


@app.get("/health")
async def health(request: Request):
    """Endpoint de vérification de santé"""
    return {"status": "ok", "sandbox": str(SANDBOX)}


# === ENDPOINT MÉTRIQUES PROMETHEUS ===
@app.get("/metrics")
def metrics():
    if not NOX_METRICS_ENABLED:
        raise HTTPException(status_code=404, detail="metrics disabled")
    # mise à jour ponctuelle des métriques sandbox
    update_sandbox_metrics(os.getenv("NOX_SANDBOX", "/home/nox/nox/sandbox"))
    ct, payload = metrics_response()
    return Response(content=payload, media_type=ct)


# === UPLOAD DE FICHIERS ===
@app.post("/put")
def put(
    path: str,
    f: UploadFile = File(),
    authorization: str | None = Header(default=None, alias="Authorization"),
):
    check_auth(authorization)

    data = f.file.read()
    target = safe_join(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    return {"message": f"Uploaded {len(data)} bytes to {path}"}


# === EXÉCUTION PYTHON ===
class RunPy(BaseModel):
    code: str
    filename: str = "run.py"


@app.post("/run_py")
def run_py(
    body: RunPy,
    request: Request,
    authorization: str | None = Header(default=None, alias="Authorization"),
):
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
            timeout=TIMEOUT_SEC,
        )
        return {
            "returncode": proc.returncode,
            "stdout": proc.stdout,
            "stderr": proc.stderr,
        }

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Timeout")


# === EXÉCUTION SHELL ===
FORBIDDEN = {
    "rm",
    "reboot",
    "shutdown",
    "mkfs",
    "dd",
    "mount",
    "umount",
    "kill",
    "pkill",
    "sudo",
}


class RunSh(BaseModel):
    cmd: str


@app.post("/run_sh")
def run_sh(
    body: RunSh,
    request: Request,
    authorization: str | None = Header(default=None, alias="Authorization"),
):
    check_auth(authorization)

    parts = shlex.split(body.cmd)
    if not parts:
        raise HTTPException(status_code=400, detail="Empty command")
    if parts[0] in FORBIDDEN:
        raise HTTPException(status_code=400, detail="Forbidden command")

    try:
        proc = subprocess.run(
            parts, cwd=str(SANDBOX), capture_output=True, text=True, timeout=TIMEOUT_SEC
        )
        return {
            "returncode": proc.returncode,
            "stdout": proc.stdout,
            "stderr": proc.stderr,
        }
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Timeout")


# === LISTING DE FICHIERS ===
@app.get("/list")
def list_files(
    path: str = "",
    recursive: bool = False,
    authorization: str | None = Header(default=None, alias="Authorization"),
):
    check_auth(authorization)

    target = safe_join(path or ".")
    if not target.exists():
        raise HTTPException(status_code=404, detail="Path not found")

    if target.is_file():
        stat = target.stat()
        return {
            "type": "file",
            "name": target.name,
            "size": stat.st_size,
            "modified": stat.st_mtime,
        }

    files = []
    pattern = "**/*" if recursive else "*"
    for item in sorted(target.glob(pattern)):
        try:
            stat = item.stat()
            files.append(
                {
                    "type": "file" if item.is_file() else "dir",
                    "name": str(item.relative_to(target)),
                    "size": stat.st_size if item.is_file() else None,
                    "modified": stat.st_mtime,
                }
            )
        except (OSError, ValueError):
            continue

    return {"type": "directory", "path": path, "files": files}


# === LECTURE DE FICHIERS ===
@app.get("/cat")
def cat(
    path: str, authorization: str | None = Header(default=None, alias="Authorization")
):
    check_auth(authorization)

    target = safe_join(path)
    if not target.exists():
        raise HTTPException(status_code=404, detail="File not found")
    if not target.is_file():
        raise HTTPException(status_code=400, detail="Path is not a file")

    try:
        content = target.read_text(encoding="utf-8")
        return {"content": content}
    except UnicodeDecodeError:
        content_bytes = target.read_bytes()
        return {"content": f"<binary file, {len(content_bytes)} bytes>"}


# === SUPPRESSION DE FICHIERS ===
@app.delete("/delete")
def delete(
    path: str, authorization: str | None = Header(default=None, alias="Authorization")
):
    check_auth(authorization)

    target = safe_join(path)
    if not target.exists():
        raise HTTPException(status_code=404, detail="Path not found")

    if target.is_file():
        target.unlink()
        return {"message": f"Deleted file {path}"}
    elif target.is_dir():
        import shutil

        shutil.rmtree(target)
        return {"message": f"Deleted directory {path}"}


# === NEW ENDPOINTS FOR AGENT GUI ===

# Chat endpoint
class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    model: Optional[str] = "gpt-3.5-turbo"

@app.post("/chat")
async def chat(
    body: ChatRequest,
    authorization: str | None = Header(default=None, alias="Authorization"),
):
    check_auth(authorization)
    
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not openai_key:
        raise HTTPException(status_code=501, detail="LLM not configured")
    
    try:
        # For now, return a simple mock response
        # TODO: Replace with actual OpenAI API call when dependencies are available
        last_message = body.messages[-1]["content"] if body.messages else "Hello"
        return {
            "reply": f"I received your message: '{last_message}'. OpenAI integration will be enabled when dependencies are installed."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


# Test runner endpoint
class RunTestsRequest(BaseModel):
    test_path: Optional[str] = ""
    args: Optional[List[str]] = []

@app.post("/run_tests")
async def run_tests(
    body: RunTestsRequest,
    request: Request,
    authorization: str | None = Header(default=None, alias="Authorization"),
):
    check_auth(authorization)
    
    try:
        # Build pytest command
        cmd = ["python", "-m", "pytest", "-q"]
        if body.test_path:
            cmd.append(body.test_path)
        if body.args:
            cmd.extend(body.args)
            
        # Check Accept header for streaming
        accept = request.headers.get("accept", "")
        if "text/event-stream" in accept:
            # TODO: Implement SSE streaming
            def generate_events():
                yield f"data: Starting tests...\n\n"
                yield f"data: Tests completed (streaming not yet implemented)\n\n"
                yield f"data: [DONE]\n\n"
            
            return StreamingResponse(
                generate_events(),
                media_type="text/event-stream"
            )
        else:
            # Run tests synchronously
            proc = subprocess.run(
                cmd, cwd=str(SANDBOX), capture_output=True, text=True, timeout=TIMEOUT_SEC
            )
            return {
                "ok": proc.returncode == 0,
                "returncode": proc.returncode,
                "summary": proc.stdout + proc.stderr,
                "stdout": proc.stdout,
                "stderr": proc.stderr,
            }
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Test timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Test runner error: {str(e)}")


# Email endpoint
class EmailRequest(BaseModel):
    to: str
    subject: str
    body: str
    attachments: Optional[List[str]] = []

@app.post("/mail")
async def send_email(
    body: EmailRequest,
    authorization: str | None = Header(default=None, alias="Authorization"),
):
    check_auth(authorization)
    
    # Check SMTP configuration
    smtp_host = os.getenv("SMTP_HOST", "").strip()
    if not smtp_host:
        raise HTTPException(status_code=501, detail="SMTP not configured")
        
    # For now, return a mock response
    # TODO: Implement actual SMTP sending when dependencies are available
    return {
        "sent": True,
        "message": f"Email would be sent to {body.to} with subject '{body.subject}' (SMTP not yet implemented)"
    }


# WebSocket terminal endpoint
@app.websocket("/ws/terminal")
async def terminal_websocket(websocket: WebSocket, token: Optional[str] = None):
    # Check auth for WebSocket
    if NOX_TOKEN:
        if not token or token != NOX_TOKEN:
            await websocket.close(code=4001, reason="Unauthorized")
            return
    
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                cmd = message.get("cmd", "")
                
                if not cmd:
                    await websocket.send_json({
                        "error": "No command provided",
                        "returncode": 1
                    })
                    continue
                    
                # Check for forbidden commands (same as /run_sh)
                parts = shlex.split(cmd)
                if not parts:
                    await websocket.send_json({
                        "error": "Empty command",
                        "returncode": 1
                    })
                    continue
                    
                if parts[0] in FORBIDDEN:
                    await websocket.send_json({
                        "error": "Forbidden command",
                        "returncode": 400
                    })
                    continue
                
                # Execute command
                proc = subprocess.run(
                    parts, 
                    cwd=str(SANDBOX), 
                    capture_output=True, 
                    text=True, 
                    timeout=TIMEOUT_SEC
                )
                
                await websocket.send_json({
                    "returncode": proc.returncode,
                    "stdout": proc.stdout,
                    "stderr": proc.stderr
                })
                
            except json.JSONDecodeError:
                await websocket.send_json({
                    "error": "Invalid JSON",
                    "returncode": 1
                })
            except subprocess.TimeoutExpired:
                await websocket.send_json({
                    "error": "Command timeout",
                    "returncode": 408
                })
            except Exception as e:
                await websocket.send_json({
                    "error": f"Execution error: {str(e)}",
                    "returncode": 1
                })
                
    except WebSocketDisconnect:
        pass


# GUI frontend endpoint  
@app.get("/gui", response_class=HTMLResponse)
async def gui():
    """Serve the agent GUI interface"""
    try:
        gui_path = pathlib.Path(__file__).parent.parent.parent / "static" / "gui.html"
        if gui_path.exists():
            return HTMLResponse(content=gui_path.read_text(encoding='utf-8'))
    except Exception:
        pass
    
    # Fallback to simple HTML if file not found
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pinox Agent GUI</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .panel { border: 1px solid #ccc; margin: 10px 0; padding: 15px; }
            .coming-soon { color: #666; font-style: italic; }
        </style>
    </head>
    <body>
        <h1>Pinox Agent GUI</h1>
        <div class="panel">
            <h2>Terminal</h2>
            <p class="coming-soon">Interactive terminal coming soon...</p>
        </div>
        <div class="panel">
            <h2>Chat</h2>
            <p class="coming-soon">AI chat interface coming soon...</p>
        </div>
        <div class="panel">
            <h2>File Explorer</h2>
            <p class="coming-soon">File management interface coming soon...</p>
        </div>
        <div class="panel">
            <h2>Test Runner</h2>
            <p class="coming-soon">Test execution interface coming soon...</p>
        </div>
        <div class="panel">
            <h2>Request Builder</h2>
            <p class="coming-soon">API testing interface coming soon...</p>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)


# Serve static files
try:
    static_path = pathlib.Path(__file__).parent.parent.parent / "static"
    if static_path.exists():
        app.mount("/static", StaticFiles(directory=str(static_path)), name="static")
except ImportError:
    # StaticFiles not available, skip
    pass


# === LANCEMENT DU SERVEUR ===
if __name__ == "__main__":
    import uvicorn

    host = os.getenv("NOX_BIND_ADDR", "127.0.0.1")
    port = int(os.getenv("NOX_PORT", "8080"))
    uvicorn.run(app, host=host, port=port)
