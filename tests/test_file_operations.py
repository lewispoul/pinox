import pytest
import tempfile
import pathlib

@pytest.mark.anyio
async def test_file_upload_happy_path(client, sandbox_path):
    """Test file upload works correctly"""
    test_content = b"Hello, this is test file content!"
    
    # Create a temporary file to upload
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(test_content)
        temp_file.flush()
        
        # Upload the file
        with open(temp_file.name, 'rb') as f:
            files = {'f': ('test.txt', f, 'text/plain')}
            r = await client.post("/put", params={"path": "uploaded_test.txt"}, files=files)
        
        # Cleanup temp file
        pathlib.Path(temp_file.name).unlink()
    
    assert r.status_code == 200
    data = r.json()
    assert "Uploaded" in data["message"]
    assert str(len(test_content)) in data["message"]


@pytest.mark.anyio
async def test_file_list_and_cat(client, sandbox_path):
    """Test file listing and reading"""
    # First, create a test file in the sandbox
    test_file = sandbox_path / "list_test.txt"
    test_content = "This is content for list and cat test"
    test_file.write_text(test_content)
    
    # Test listing
    r = await client.get("/list", params={"path": ""})
    assert r.status_code == 200
    data = r.json()
    assert data["type"] == "directory"
    
    # Check that our test file appears in the listing
    file_names = [f["name"] for f in data["files"]]
    assert "list_test.txt" in file_names
    
    # Test reading the file
    r = await client.get("/cat", params={"path": "list_test.txt"})
    assert r.status_code == 200
    data = r.json()
    assert data["content"] == test_content


@pytest.mark.anyio
async def test_file_delete(client, sandbox_path):
    """Test file deletion"""
    # Create a test file
    test_file = sandbox_path / "delete_test.txt"
    test_file.write_text("File to be deleted")
    assert test_file.exists()
    
    # Delete the file
    r = await client.delete("/delete", params={"path": "delete_test.txt"})
    assert r.status_code == 200
    data = r.json()
    assert "Deleted file" in data["message"]
    
    # Verify file is gone
    assert not test_file.exists()


@pytest.mark.anyio
async def test_file_operations_with_auth(client, monkeypatch, sandbox_path):
    """Test file operations require auth when token is set"""
    monkeypatch.setenv("NOX_API_TOKEN", "test-token-123")
    
    # Test file upload without auth
    test_content = b"auth test content"
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(test_content)
        temp_file.flush()
        
        with open(temp_file.name, 'rb') as f:
            files = {'f': ('auth_test.txt', f, 'text/plain')}
            r = await client.post("/put", params={"path": "auth_test.txt"}, files=files)
        
        pathlib.Path(temp_file.name).unlink()
    
    assert r.status_code == 401
    
    # Test with correct auth
    headers = {"Authorization": "Bearer test-token-123"}
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(test_content)
        temp_file.flush()
        
        with open(temp_file.name, 'rb') as f:
            files = {'f': ('auth_test.txt', f, 'text/plain')}
            r = await client.post("/put", params={"path": "auth_test.txt"}, files=files, headers=headers)
        
        pathlib.Path(temp_file.name).unlink()
    
    assert r.status_code == 200


@pytest.mark.anyio
async def test_cat_nonexistent_file(client):
    """Test reading nonexistent file returns 404"""
    r = await client.get("/cat", params={"path": "nonexistent.txt"})
    assert r.status_code == 404
    data = r.json()
    assert "not found" in data["detail"].lower()


@pytest.mark.anyio
async def test_list_nonexistent_path(client):
    """Test listing nonexistent path returns 404"""
    r = await client.get("/list", params={"path": "nonexistent_dir"})
    assert r.status_code == 404