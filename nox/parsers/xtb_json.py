import json

def parse_xtbout(json_string):
    # Robust parsing implementation
    try:
        data = json.loads(json_string)
        # Validate required fields
        if 'energy' not in data or 'gap' not in data or 'dipole' not in data:
            raise ValueError('Missing required fields in JSON data')
        return data
    except json.JSONDecodeError:
        raise ValueError('Invalid JSON data')
