"""
File operations service
"""
import os
import pathlib
from typing import List, Dict, Any

try:
    from fastapi import HTTPException
    FASTAPI_AVAILABLE = True
except ImportError:
    FASTAPI_AVAILABLE = False
    
    # Stub HTTPException when FastAPI is not available
    class HTTPException(Exception):
        def __init__(self, status_code, detail):
            self.status_code = status_code
            self.detail = detail
            super().__init__(detail)


class FileOperationsService:
    """Service for file operations within the sandbox."""
    
    def __init__(self, sandbox_path: str = None):
        self.sandbox = pathlib.Path(
            sandbox_path or os.getenv("NOX_SANDBOX", "/tmp/nox_sandbox")
        ).resolve()
        
        # Ensure sandbox exists
        try:
            self.sandbox.mkdir(parents=True, exist_ok=True)
        except PermissionError:
            import tempfile
            self.sandbox = pathlib.Path(tempfile.mkdtemp(prefix="nox_sandbox_"))
        except Exception:
            self.sandbox = pathlib.Path("/tmp")
    
    def safe_join(self, *paths) -> pathlib.Path:
        """Safely join paths within sandbox."""
        target = self.sandbox
        for path in paths:
            if path:
                # Remove leading slashes and ensure relative path
                clean_path = str(path).lstrip("/")
                target = target / clean_path
        
        # Resolve and check if within sandbox
        resolved = target.resolve()
        try:
            resolved.relative_to(self.sandbox.resolve())
            return resolved
        except ValueError:
            raise HTTPException(status_code=400, detail="Path outside sandbox")
    
    def list_directory(self, path: str = "", recursive: bool = False) -> Dict[str, Any]:
        """List files in directory."""
        target = self.safe_join(path or ".")
        if not target.exists():
            raise HTTPException(status_code=404, detail="Path not found")

        if target.is_file():
            stat = target.stat()
            return {
                "type": "file",
                "path": path,
                "files": [{
                    "type": "file",
                    "name": target.name,
                    "size": stat.st_size,
                    "modified": stat.st_mtime,
                }]
            }

        files = []
        pattern = "**/*" if recursive else "*"
        for item in sorted(target.glob(pattern)):
            try:
                stat = item.stat()
                files.append({
                    "type": "file" if item.is_file() else "dir",
                    "name": str(item.relative_to(target)),
                    "size": stat.st_size if item.is_file() else None,
                    "modified": stat.st_mtime,
                })
            except (OSError, ValueError):
                continue

        return {"type": "directory", "path": path, "files": files}
    
    def read_file(self, path: str) -> Dict[str, str]:
        """Read file contents."""
        target = self.safe_join(path)
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
    
    def delete_path(self, path: str) -> Dict[str, str]:
        """Delete file or directory."""
        target = self.safe_join(path)
        if not target.exists():
            raise HTTPException(status_code=404, detail="Path not found")

        if target.is_file():
            target.unlink()
            return {"message": f"Deleted file {path}"}
        elif target.is_dir():
            import shutil
            shutil.rmtree(target)
            return {"message": f"Deleted directory {path}"}
    
    def write_file(self, path: str, content: str) -> Dict[str, str]:
        """Write content to file."""
        target = self.safe_join(path)
        
        # Ensure parent directory exists
        target.parent.mkdir(parents=True, exist_ok=True)
        
        target.write_text(content, encoding="utf-8")
        return {"message": f"Written to file {path}"}