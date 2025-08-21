"""
Nox API Package
Secure code execution API with observability and policy enforcement.
"""

__version__ = "2.2.0"

# Import main components for easy access
try:
    from .main import app
    from . import routes, schemas, services, middleware
    __all__ = ["app", "routes", "schemas", "services", "middleware", "__version__"]
except ImportError:
    # Some dependencies not available, export only version
    __all__ = ["__version__"]