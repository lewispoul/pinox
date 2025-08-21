#!/usr/bin/env python3
"""
Test script to verify nox-api package structure and functionality
"""
import subprocess
import sys
import time
import requests
from pathlib import Path

def test_import():
    """Test that nox_api.api.nox_api:app can be imported"""
    try:
        from nox_api.api.nox_api import app
        print("✅ Import test passed: nox_api.api.nox_api:app")
        return True
    except Exception as e:
        print(f"❌ Import test failed: {e}")
        return False

def test_package_structure():
    """Test that proper __init__.py files exist"""
    required_files = [
        "nox_api/__init__.py",
        "nox_api/api/__init__.py",
        "nox_api/api/nox_api.py",
        "nox_api/api/metrics.py",
        "nox_api/api/middleware.py",
        "nox_api/api/rate_limit_and_policy.py"
    ]
    
    all_exist = True
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"✅ Found: {file_path}")
        else:
            print(f"❌ Missing: {file_path}")
            all_exist = False
    
    return all_exist

def test_uvicorn_startup():
    """Test that uvicorn can start the service"""
    try:
        # Start uvicorn in background
        proc = subprocess.Popen([
            sys.executable, "-m", "uvicorn",
            "nox_api.api.nox_api:app",
            "--host", "127.0.0.1",
            "--port", "8003"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait for startup
        time.sleep(3)
        
        # Test if service is responding
        try:
            response = requests.get("http://127.0.0.1:8003/health", timeout=5)
            if response.status_code == 200:
                print("✅ Uvicorn startup test passed")
                result = True
            else:
                print(f"❌ Health check failed with status {response.status_code}")
                result = False
        except Exception as e:
            print(f"❌ Health check request failed: {e}")
            result = False
        
        # Clean up
        proc.terminate()
        proc.wait()
        return result
        
    except Exception as e:
        print(f"❌ Uvicorn startup test failed: {e}")
        return False

def test_docs_endpoint():
    """Test that /docs endpoint works"""
    try:
        # Start uvicorn in background
        proc = subprocess.Popen([
            sys.executable, "-m", "uvicorn",
            "nox_api.api.nox_api:app",
            "--host", "127.0.0.1",
            "--port", "8004"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait for startup
        time.sleep(3)
        
        try:
            response = requests.get("http://127.0.0.1:8004/docs", timeout=5)
            if response.status_code == 200 and "swagger-ui" in response.text.lower():
                print("✅ /docs endpoint test passed")
                result = True
            else:
                print(f"❌ /docs endpoint test failed with status {response.status_code}")
                result = False
        except Exception as e:
            print(f"❌ /docs endpoint request failed: {e}")
            result = False
        
        # Clean up
        proc.terminate()
        proc.wait()
        return result
        
    except Exception as e:
        print(f"❌ /docs endpoint test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing nox-api package structure and functionality...\n")
    
    tests = [
        ("Package structure", test_package_structure),
        ("Import functionality", test_import),
        ("Uvicorn startup", test_uvicorn_startup),
        ("Docs endpoint", test_docs_endpoint),
    ]
    
    all_passed = True
    for test_name, test_func in tests:
        print(f"\n📋 Running {test_name} test...")
        if not test_func():
            all_passed = False
    
    print(f"\n🎯 Final result: {'All tests passed! 🎉' if all_passed else 'Some tests failed 😞'}")
    sys.exit(0 if all_passed else 1)