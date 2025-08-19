import json

def run_xtb(input_data):
    # Process input_data and run XTB
    # Implement the actual logic to run XTB here
    # For now, returning dummy values
    return {'energy': 42.0, 'gap': 1.5, 'dipole': 0.1}

def parse_xtbout(json_data):
    # Robust parsing implementation
    try:
        data = json.loads(json_data)
        # Validate required fields
        if 'energy' not in data or 'gap' not in data or 'dipole' not in data:
            raise ValueError('Missing required fields in JSON data')
        return data
    except json.JSONDecodeError:
        raise ValueError('Invalid JSON data')

def main():
    pass

if __name__ == '__main__':
    main()
