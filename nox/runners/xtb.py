import shutil
import pathlib
from nox.parsers.xtb_json import parse_xtbout_text


class XTBNotAvailable(RuntimeError):
    pass

def run_xtb(smiles: str | None = None, infile: str | None = None) -> dict:
    """
    Minimal placeholder: expects an existing input file and a neighboring xtbout.json.
    In real flow we'll invoke xtb; for CI we just parse the JSON so tests stay green.
    """
    # TODO: Ensure xtb binary is available in the environment
    if shutil.which("xtb") is None:
        raise XTBNotAvailable("xtb binary not found on PATH")
    # TODO: Validate input parameters
    if not infile and not smiles:
        raise ValueError("Provide infile or smiles")

    path = pathlib.Path(infile or "")
    # TODO: Check if the input file exists
    if not path.exists():
        raise FileNotFoundError(f"input file not found: {path}")

    out_json = path.with_name("xtbout.json")
    text = out_json.read_text(encoding="utf-8")
    return parse_xtbout_text(text)
