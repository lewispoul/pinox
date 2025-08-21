import pytest

PY_SNIPPET = r"""
# petit script qui crée un fichier et print
from pathlib import Path
p = Path("artifacts")
p.mkdir(exist_ok=True)
out = p / "py_ok.txt"
out.write_text("PY_OK")
print("DONE")
"""

@pytest.mark.anyio
async def test_run_py_creates_file_and_returns_stdout(client):
    payload = {"code": PY_SNIPPET}
    r = await client.post("/run_py", json=payload)
    assert r.status_code == 200
    data = r.json() if r.headers.get("content-type","").startswith("application/json") else {"stdout": r.text}
    stdout = data.get("stdout", "")
    assert "DONE" in stdout

    # Vérifie que le fichier a bien été créé en sandbox
    # /list peut répondre pour "artifacts"
    r = await client.get("/list", params={"path": "artifacts"})
    assert r.status_code == 200
    assert "py_ok.txt" in r.text