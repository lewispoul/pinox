import json
import subprocess
import shlex
from pathlib import Path
from typing import Dict, Any
from api.services.settings import settings

def write_xyz(xyz_text: str, path: Path):
    """Write XYZ coordinates to file"""
    path.write_text(xyz_text.strip() + "\n", encoding="utf-8")

def run_cmd(cmd: str, cwd: Path, log_path: Path):
    """Run shell command and log output"""
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

def parse_xtb_json(json_data: dict) -> Dict[str, float]:
    """Parser amélioré pour extraire les scalaires depuis xtbout.json"""
    scalars = {}
    try:
        # Énergie totale
        if "total energy" in json_data:
            scalars["E_total_hartree"] = float(json_data["total energy"])
        elif "energy" in json_data:
            scalars["E_total_hartree"] = float(json_data["energy"])
            
        # Gap HOMO-LUMO
        if "gap" in json_data:
            scalars["gap_eV"] = float(json_data["gap"])
        elif "HOMO-LUMO gap" in json_data:
            scalars["gap_eV"] = float(json_data["HOMO-LUMO gap"])
            
        # Moment dipolaire
        if "dipole moment" in json_data:
            scalars["dipole_D"] = float(json_data["dipole moment"])
        elif "dipole" in json_data:
            scalars["dipole_D"] = float(json_data["dipole"])
            
        # Autres propriétés utiles
        if "total charge" in json_data:
            scalars["total_charge"] = float(json_data["total charge"])
        if "molecular mass" in json_data:
            scalars["molecular_mass_u"] = float(json_data["molecular mass"])
            
    except (KeyError, ValueError, TypeError) as e:
        print(f"Warning: Error parsing XTB JSON: {e}")
    return scalars

def parse_xtb_simple(out_text: str) -> Dict[str, float]:
    """Parser simple pour extraire l'énergie depuis la sortie texte"""
    scalars: Dict[str, float] = {}
    lines = out_text.split('\n')
    for line in lines:
        if "TOTAL ENERGY" in line.upper():
            try:
                # Recherche pattern typique: | TOTAL ENERGY    -4.123456 Eh
                parts = line.split()
                for i, part in enumerate(parts):
                    if "ENERGY" in part.upper() and i + 1 < len(parts):
                        try:
                            energy = float(parts[i + 1])
                            scalars["E_total_hartree"] = energy
                            break
                        except ValueError:
                            continue
            except:
                pass
    return scalars

def run_xtb_job(job_dir: Path, xyz: str, charge: int, multiplicity: int, params: dict) -> Dict[str, Any]:
    """Exécute un calcul XTB et retourne les résultats"""
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
    
    # Priorité au JSON si disponible
    if json_out.exists():
        try:
            j = json.loads(json_out.read_text(encoding="utf-8"))
            scalars = parse_xtb_json(j)
        except Exception as e:
            print(f"Warning: Failed to parse XTB JSON: {e}")
    
    # Fallback sur la sortie texte
    if not scalars and log.exists():
        try:
            log_text = log.read_text(encoding="utf-8")
            scalars = parse_xtb_simple(log_text)
        except Exception as e:
            print(f"Warning: Failed to parse XTB log: {e}")

    artifacts = []
    if json_out.exists():
        artifacts.append({
            "name": "xtbout.json", 
            "path": str(json_out), 
            "mime": "application/json", 
            "size": json_out.stat().st_size
        })
    if log.exists():
        artifacts.append({
            "name": "xtb.log", 
            "path": str(log), 
            "mime": "text/plain", 
            "size": log.stat().st_size
        })

    return {
        "scalars": scalars, 
        "series": {}, 
        "artifacts": artifacts, 
        "returncode": ret
    }
