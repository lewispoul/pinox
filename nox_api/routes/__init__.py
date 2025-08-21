"""
Routes package for Nox API
"""

try:
    from . import health, files
    __all__ = ["health", "files"]
except ImportError:
    # FastAPI not available
    __all__ = []