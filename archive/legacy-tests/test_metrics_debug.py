#!/usr/bin/env python3
"""
Debug script to test metrics endpoint
"""
import os

os.environ["NOX_QUOTAS_ENABLED"] = "1"

try:
    from quotas.metrics import get_quota_metrics_output

    print("✅ Import successful")

    output = get_quota_metrics_output()
    print("✅ Metrics generation successful")
    print(f"Output length: {len(output)} chars")
    print("First 500 chars:")
    print(output[:500])

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback

    traceback.print_exc()
