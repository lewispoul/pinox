from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Pinox Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/api/v1/files")
def list_files(path: str = "."):
    # TODO: use Git service; stub
    return {"files": ["README.md", "main.py"]}

@app.post("/api/v1/runs")
def start_run():
    # TODO: enqueue a sandbox run via Redis/Dramatiq
    return {"id": 1, "status": "queued"}

@app.websocket("/ws/chat")
async def ws_chat(ws: WebSocket):
    await ws.accept()
    await ws.send_json({"type": "chat.delta", "token": "Hello from FastAPI WS!"})
    await ws.close()
