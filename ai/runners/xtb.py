import json, subprocess, shlex
from pathlib import Path
from typing import Dict, Any
from api.services.settings import settings

def write_xyz(xyz_text: str, path: Path):
    path.write_text(xyz_text.strip() + "\n", encoding="utf-8")

def run_cmd(cmd: str, cwd: Path, log_path: Path):
    with log_path.open("w", encoding="utf-8") as logf:
        proc = subprocess.Popen(
            shlex.split(cmd),
            cwd=str(cwd),
            stdout=logf,
            stderr=subprocess.STDOUT,
            text=True,
        )
        ret = proc.wait()
    return ret

def parse_xtb_simple(out_text: str) -> Dict[str, float]:
    scalars: Dict[str, float] = {}
    # à compléter: parser robuste de l’énergie, du gap, et du dipôle si disponible
    return scalars

def run_xtb_job(job_dir: Path, xyz: str, charge: int, multiplicity: int, params: dict) -> Dict[str, Any]:
    inp = job_dir / "input.xyz"
    write_xyz(xyz, inp)
    log = job_dir / "xtb.log"
    json_out = job_dir / "xtbout.json"

    gfn = int(params.get("gfn", 2))
    base_cmd = f"{settings.xtb_bin} {inp.name} --gfn {gfn}"
    if params.get("opt", True):
        base_cmd += " --opt"
    if params.get("hess", False):
        base_cmd += " --hess"
    if params.get("uhf", False):
        base_cmd += " --uhf"
    chrg = int(params.get("chrg", charge))
    if chrg != 0:
        base_cmd += f" --chrg {chrg}"
    if params.get("json_output", True):
        base_cmd += " --json"

    ret = run_cmd(base_cmd, job_dir, log)

    scalars = {}
    if json_out.exists():
        try:
            j = json.loads(json_out.read_text(encoding="utf-8"))
            # extraire valeurs utiles si présentes
            pass
        except Exception:
            pass

    artifacts = []
    if json_out.exists():
        artifacts.append({"name": "xtbout.json", "path": str(json_out), "mime": "application/json", "size": json_out.stat().st_size})
    if log.exists():
        artifacts.append({"name": "xtb.log", "path": str(log), "mime": "text/plain", "size": log.stat().st_size})

    return {"scalars": scalars, "series": {}, "artifacts": artifacts, "returncode": ret}
