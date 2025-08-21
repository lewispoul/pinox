"""
Pydantic schemas for Nox API
"""

try:
    from .common import BaseResponse, ErrorResponse
    from .health import HealthResponse
    from .files import FileInfo, DirectoryListing
    
    __all__ = [
        "BaseResponse",
        "ErrorResponse", 
        "HealthResponse",
        "FileInfo",
        "DirectoryListing"
    ]
except ImportError:
    # Some dependencies not available
    __all__ = []