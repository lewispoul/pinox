#!/bin/bash
echo "Testing API on port 8082..."
curl -s http://127.0.0.1:8082/health
echo ""
echo "API test completed."
