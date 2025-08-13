# observability/metrics.py
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
import os, pathlib

REQS = Counter(
    "nox_requests_total",
    "Total des requêtes",
    ["endpoint","method","code"]
)
LAT = Histogram(
    "nox_request_seconds",
    "Durée des requêtes en secondes",
    ["endpoint","method","code"],
    buckets=(0.01,0.025,0.05,0.1,0.25,0.5,1,2,5,10)
)
SANDBOX_FILES = Gauge("nox_sandbox_files","Nombre de fichiers dans le sandbox")
SANDBOX_BYTES = Gauge("nox_sandbox_bytes","Taille totale sandbox en octets")

def update_sandbox_metrics(root: str) -> None:
    p = pathlib.Path(root)
    files = 0
    size = 0
    if p.exists():
        for f in p.rglob("*"):
            try:
                if f.is_file():
                    files += 1
                    size += f.stat().st_size
            except Exception:
                pass
    SANDBOX_FILES.set(files)
    SANDBOX_BYTES.set(size)

def metrics_response():
    return CONTENT_TYPE_LATEST, generate_latest()
