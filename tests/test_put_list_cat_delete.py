import io
import json
import pytest

@pytest.mark.anyio
async def test_put_list_cat_delete_roundtrip(client):
    # 1) Upload d’un fichier
    content = b"hello-from-tests\n"
    files = {
        "file": ("hello.txt", io.BytesIO(content), "text/plain"),
    }
    data = {"path": "uploads/hello.txt"}     # selon ton handler /put
    r = await client.post("/put", files=files, data=data)
    assert r.status_code in (200, 201)

    # 2) List: doit contenir notre fichier
    r = await client.get("/list", params={"path": "uploads"})
    assert r.status_code == 200
    listing = r.json()
    # listing peut être une liste ou un dict -> on teste “dedans”
    flat = json.dumps(listing)
    assert "hello.txt" in flat

    # 3) Cat: le contenu doit correspondre
    r = await client.get("/cat", params={"path": "uploads/hello.txt"})
    assert r.status_code == 200
    assert r.text.endswith("hello-from-tests\n")

    # 4) Delete
    r = await client.delete("/delete", params={"path": "uploads/hello.txt"})
    assert r.status_code in (200, 204)

    # 5) Vérifie que list ne le voit plus
    r = await client.get("/list", params={"path": "uploads"})
    assert r.status_code == 200
    assert "hello.txt" not in r.text