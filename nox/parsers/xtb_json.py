import json

REQUIRED = ("energy", "homo_lumo_gap_ev", "dipole_debye")


class XTBParseError(ValueError):
    pass


def parse_xtbout_text(text: str) -> dict:
    """Parse xtbout.json text and normalize schema to {energy, gap, dipole}."""
    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        raise XTBParseError(f"invalid JSON: {e}") from e

    missing = [k for k in REQUIRED if k not in data]
    if missing:
        raise XTBParseError(f"missing field(s): {', '.join(missing)}")

    return {
        "energy": float(data["energy"]),  # Hartree (Eh)
        "gap": float(data["homo_lumo_gap_ev"]),  # eV
        "dipole": float(data["dipole_debye"]),  # Debye
    }
