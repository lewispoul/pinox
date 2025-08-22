import pytest

@pytest.mark.anyio
async def test_run_sh_executes_shell(client):
    # Fixed: API expects "cmd" not "script"
    payload = {"cmd": "echo 'SHELL_OK' && mkdir -p artifacts && echo 1 > artifacts/sh_ok.txt"}
    r = await client.post("/run_sh", json=payload)
    assert r.status_code == 200
    data = r.json() if r.headers.get("content-type","").startswith("application/json") else {"stdout": r.text}
    stdout = data.get("stdout", "")
    assert "SHELL_OK" in stdout

    r = await client.get("/list", params={"path": "artifacts"})
    assert r.status_code == 200
    assert "sh_ok.txt" in r.text