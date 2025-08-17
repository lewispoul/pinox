#!/bin/bash
export PYTHONPATH=.

echo "Testing Nox API health endpoint..."
curl -s http://127.0.0.1:8081/health

echo -e "\nTesting POST /jobs..."
curl -s -X POST http://127.0.0.1:8081/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "engine": "xtb",
    "kind": "opt_properties", 
    "inputs": {
      "xyz": "2\nH2\nH 0 0 0\nH 0 0 0.74\n",
      "charge": 0,
      "multiplicity": 1
    }
  }'

echo -e "\n\nAPI tests completed."
