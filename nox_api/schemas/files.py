"""
File operation schemas
"""
from typing import Optional, List

try:
    from pydantic import BaseModel
except ImportError:
    # Stub BaseModel when Pydantic is not available
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)


class FileInfo(BaseModel):
    """File information model."""
    type: str
    name: str
    size: Optional[int] = None
    modified: float


class DirectoryListing(BaseModel):
    """Directory listing model."""
    type: str
    path: str
    files: List[FileInfo]


class FileContent(BaseModel):
    """File content response model."""
    content: str


class DeleteResponse(BaseModel):
    """Delete operation response model."""
    message: str