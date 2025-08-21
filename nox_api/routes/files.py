"""
File operations endpoints
"""
import os
import pathlib
import shlex
import subprocess
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, Header, UploadFile, File
from fastapi.responses import Response
from ..schemas.files import FileInfo, DirectoryListing

router = APIRouter()

# Configuration
NOX_TOKEN = os.getenv("NOX_API_TOKEN", "").strip()
SANDBOX = pathlib.Path(os.getenv("NOX_SANDBOX", "/tmp/nox_sandbox")).resolve()
TIMEOUT_SEC = int(os.getenv("NOX_TIMEOUT", "20"))


def check_auth(auth: Optional[str]):
    """Check authorization header."""
    if not NOX_TOKEN:
        return
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    if auth.removeprefix("Bearer ").strip() != NOX_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")


def safe_join(*paths) -> pathlib.Path:
    """Safely join paths within sandbox."""
    target = SANDBOX
    for path in paths:
        if path:
            # Remove leading slashes and ensure relative path
            clean_path = str(path).lstrip("/")
            target = target / clean_path
    
    # Resolve and check if within sandbox
    resolved = target.resolve()
    try:
        resolved.relative_to(SANDBOX.resolve())
        return resolved
    except ValueError:
        raise HTTPException(status_code=400, detail="Path outside sandbox")





@router.get("/list", response_model=DirectoryListing)
def list_files(
    path: str = "",
    recursive: bool = False,
    authorization: Optional[str] = Header(default=None, alias="Authorization"),
):
    """List files in directory."""
    check_auth(authorization)

    target = safe_join(path or ".")
    if not target.exists():
        raise HTTPException(status_code=404, detail="Path not found")

    if target.is_file():
        stat = target.stat()
        return DirectoryListing(
            type="file",
            path=path,
            files=[FileInfo(
                type="file",
                name=target.name,
                size=stat.st_size,
                modified=stat.st_mtime,
            )]
        )

    files = []
    pattern = "**/*" if recursive else "*"
    for item in sorted(target.glob(pattern)):
        try:
            stat = item.stat()
            files.append(FileInfo(
                type="file" if item.is_file() else "dir",
                name=str(item.relative_to(target)),
                size=stat.st_size if item.is_file() else None,
                modified=stat.st_mtime,
            ))
        except (OSError, ValueError):
            continue

    return DirectoryListing(type="directory", path=path, files=files)


@router.get("/cat")
def cat_file(
    path: str,
    authorization: Optional[str] = Header(default=None, alias="Authorization"),
):
    """Read file contents."""
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


@router.delete("/delete")
def delete_file_or_directory(
    path: str,
    authorization: Optional[str] = Header(default=None, alias="Authorization")
):
    """Delete file or directory."""
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