#!/usr/bin/env python3
"""
Nox API Demo Tests - Comprehensive test suite for Nox API functionality
Demonstrates all API features with real-world examples and error handling.
"""

import json
import os
import sys
import tempfile
import pathlib
import time
from typing import Dict, Any

# Add clients directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from nox_client import NoxClient, NoxClientError, NoxAuthError, create_client_from_env


class TestResults:
    """Track test results and generate summary report"""
    
    def __init__(self):
        self.tests = []
        self.passed = 0
        self.failed = 0
        self.start_time = time.time()
    
    def add_test(self, name: str, success: bool, message: str = "", details: Dict = None):
        """Add a test result"""
        self.tests.append({
            'name': name,
            'success': success,
            'message': message,
            'details': details or {},
            'timestamp': time.time()
        })
        
        if success:
            self.passed += 1
        else:
            self.failed += 1
    
    def print_summary(self):
        """Print comprehensive test summary"""
        duration = time.time() - self.start_time
        
        print("\n" + "="*60)
        print("🧪 NOX API DEMO TESTS - COMPREHENSIVE REPORT")
        print("="*60)
        
        # Overall results
        total = self.passed + self.failed
        success_rate = (self.passed / total * 100) if total > 0 else 0
        
        print(f"📊 RESULTS SUMMARY:")
        print(f"   Total Tests: {total}")
        print(f"   ✅ Passed: {self.passed}")
        print(f"   ❌ Failed: {self.failed}")
        print(f"   📈 Success Rate: {success_rate:.1f}%")
        print(f"   ⏱️  Duration: {duration:.2f}s")
        
        # Detailed results
        print(f"\n📋 DETAILED RESULTS:")
        for i, test in enumerate(self.tests, 1):
            status = "✅ PASS" if test['success'] else "❌ FAIL"
            print(f"   {i:2d}. {status} - {test['name']}")
            
            if test['message']:
                print(f"       💬 {test['message']}")
            
            if test['details'] and not test['success']:
                print(f"       🔍 Details: {json.dumps(test['details'], indent=10)}")
        
        # Final verdict
        print(f"\n🎯 FINAL VERDICT:")
        if self.failed == 0:
            print("   🎉 ALL TESTS PASSED! Nox API is fully operational.")
        else:
            print(f"   ⚠️  {self.failed} test(s) failed. Please check the details above.")
        
        print("="*60)
        return self.failed == 0


def run_demo_tests():
    """
    Run comprehensive demo tests for Nox API
    
    Tests include:
    1. Connection and authentication
    2. Health check endpoint
    3. File upload functionality
    4. Python code execution
    5. Shell command execution
    6. Error handling scenarios
    7. Performance validation
    """
    results = TestResults()
    client = None
    
    print("🚀 Starting Nox API Demo Tests...")
    print(f"📍 Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test 1: Client initialization
    try:
        print("\n1️⃣  Testing client initialization...")
        client = create_client_from_env()
        results.add_test(
            "Client Initialization", 
            True, 
            f"Successfully created client for {client.base_url}"
        )
        print(f"   ✅ Client created: {client}")
    except Exception as e:
        results.add_test(
            "Client Initialization", 
            False, 
            str(e),
            {"error_type": type(e).__name__}
        )
        print(f"   ❌ Failed to create client: {e}")
        print("   💡 Check NOX_API_TOKEN environment variable")
        results.print_summary()
        return False
    
    # Test 2: Health check
    try:
        print("\n2️⃣  Testing health check endpoint...")
        health_response = client.health()
        expected_status = health_response.get('status') == 'ok'
        
        results.add_test(
            "Health Check", 
            expected_status,
            f"API status: {health_response.get('status', 'unknown')}",
            health_response
        )
        
        if expected_status:
            print(f"   ✅ API is healthy: {health_response}")
        else:
            print(f"   ⚠️  Unexpected health status: {health_response}")
            
    except Exception as e:
        results.add_test(
            "Health Check", 
            False, 
            str(e),
            {"error_type": type(e).__name__}
        )
        print(f"   ❌ Health check failed: {e}")
    
    # Test 3: File upload (string content)
    try:
        print("\n3️⃣  Testing file upload (string content)...")
        test_content = "# Demo Python file\nprint('Hello from uploaded file!')\nprint('Current timestamp:', __import__('time').time())\n"
        
        upload_response = client.put("demo/hello_upload.py", test_content)
        upload_success = 'saved' in upload_response
        
        results.add_test(
            "File Upload (String)", 
            upload_success,
            f"File saved to: {upload_response.get('saved', 'unknown')}",
            upload_response
        )
        
        if upload_success:
            print(f"   ✅ File uploaded: {upload_response['saved']}")
        else:
            print(f"   ❌ Upload failed: {upload_response}")
            
    except Exception as e:
        results.add_test(
            "File Upload (String)", 
            False, 
            str(e),
            {"error_type": type(e).__name__}
        )
        print(f"   ❌ File upload failed: {e}")
    
    # Test 4: File upload (from local file)
    try:
        print("\n4️⃣  Testing file upload (local file)...")
        
        # Create a temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as tmp:
            tmp.write("print('Hello from temporary file!')\n")
            tmp.write(f"print('File created at: {time.strftime('%Y-%m-%d %H:%M:%S')}')\n")
            tmp_path = pathlib.Path(tmp.name)
        
        try:
            upload_response = client.put("demo/temp_upload.py", tmp_path)
            upload_success = 'saved' in upload_response
            
            results.add_test(
                "File Upload (Local File)", 
                upload_success,
                f"Local file {tmp_path.name} uploaded to: {upload_response.get('saved', 'unknown')}",
                upload_response
            )
            
            if upload_success:
                print(f"   ✅ Local file uploaded: {upload_response['saved']}")
            else:
                print(f"   ❌ Upload failed: {upload_response}")
        finally:
            # Clean up temporary file
            tmp_path.unlink(missing_ok=True)
            
    except Exception as e:
        results.add_test(
            "File Upload (Local File)", 
            False, 
            str(e),
            {"error_type": type(e).__name__}
        )
        print(f"   ❌ Local file upload failed: {e}")
    
    # Test 5: Python code execution (simple)
    try:
        print("\n5️⃣  Testing Python code execution (simple)...")
        simple_code = "print('Hello from Python execution!')\nresult = 2 + 2\nprint(f'Calculation result: {result}')"
        
        exec_response = client.run_py(simple_code, "test_simple.py")
        exec_success = exec_response.get('returncode') == 0 and 'Hello from Python execution!' in exec_response.get('stdout', '')
        
        results.add_test(
            "Python Execution (Simple)", 
            exec_success,
            f"Exit code: {exec_response.get('returncode')}, Output lines: {len(exec_response.get('stdout', '').splitlines())}",
            {
                'returncode': exec_response.get('returncode'),
                'stdout_preview': exec_response.get('stdout', '')[:200],
                'stderr': exec_response.get('stderr', '')
            }
        )
        
        if exec_success:
            print(f"   ✅ Python execution successful:")
            print(f"      📤 Exit code: {exec_response['returncode']}")
            print(f"      📋 Output: {exec_response['stdout'].strip()}")
        else:
            print(f"   ❌ Python execution failed:")
            print(f"      📤 Exit code: {exec_response.get('returncode')}")
            print(f"      📋 Stdout: {exec_response.get('stdout', '')}")
            print(f"      📋 Stderr: {exec_response.get('stderr', '')}")
            
    except Exception as e:
        results.add_test(
            "Python Execution (Simple)", 
            False, 
            str(e),
            {"error_type": type(e).__name__}
        )
        print(f"   ❌ Python execution failed: {e}")
    
    # Test 6: Python code execution (advanced)
    try:
        print("\n6️⃣  Testing Python code execution (advanced)...")
        advanced_code = """
import json
import sys
import os

# Demonstrate various Python features
data = {
    'python_version': sys.version,
    'platform': sys.platform,
    'current_dir': os.getcwd(),
    'env_vars': len(os.environ),
    'calculation': sum(range(1, 11))
}

print("Advanced Python execution test:")
print(json.dumps(data, indent=2))
print("Test completed successfully!")
"""
        
        exec_response = client.run_py(advanced_code, "test_advanced.py")
        exec_success = (exec_response.get('returncode') == 0 and 
                       'Test completed successfully!' in exec_response.get('stdout', '') and
                       'python_version' in exec_response.get('stdout', ''))
        
        results.add_test(
            "Python Execution (Advanced)", 
            exec_success,
            f"Exit code: {exec_response.get('returncode')}, JSON output detected: {'python_version' in exec_response.get('stdout', '')}",
            {
                'returncode': exec_response.get('returncode'),
                'stdout_lines': len(exec_response.get('stdout', '').splitlines()),
                'stderr': exec_response.get('stderr', '')
            }
        )
        
        if exec_success:
            print(f"   ✅ Advanced Python execution successful:")
            print(f"      📤 Exit code: {exec_response['returncode']}")
            print(f"      📊 Output contains JSON data and system info")
        else:
            print(f"   ❌ Advanced Python execution failed:")
            print(f"      📤 Exit code: {exec_response.get('returncode')}")
            print(f"      📋 Stderr: {exec_response.get('stderr', '')}")
            
    except Exception as e:
        results.add_test(
            "Python Execution (Advanced)", 
            False, 
            str(e),
            {"error_type": type(e).__name__}
        )
        print(f"   ❌ Advanced Python execution failed: {e}")
    
    # Test 7: Shell command execution
    try:
        print("\n7️⃣  Testing shell command execution...")
        
        # Test basic shell command
        shell_response = client.run_sh("echo 'Hello from shell!' && pwd && date")
        shell_success = (shell_response.get('returncode') == 0 and 
                        'Hello from shell!' in shell_response.get('stdout', ''))
        
        results.add_test(
            "Shell Command Execution", 
            shell_success,
            f"Exit code: {shell_response.get('returncode')}, Commands: echo, pwd, date",
            {
                'returncode': shell_response.get('returncode'),
                'stdout_preview': shell_response.get('stdout', '')[:200],
                'stderr': shell_response.get('stderr', '')
            }
        )
        
        if shell_success:
            print(f"   ✅ Shell execution successful:")
            print(f"      📤 Exit code: {shell_response['returncode']}")
            print(f"      📋 Output preview: {shell_response['stdout'][:100]}...")
        else:
            print(f"   ❌ Shell execution failed:")
            print(f"      📤 Exit code: {shell_response.get('returncode')}")
            print(f"      📋 Stderr: {shell_response.get('stderr', '')}")
            
    except Exception as e:
        results.add_test(
            "Shell Command Execution", 
            False, 
            str(e),
            {"error_type": type(e).__name__}
        )
        print(f"   ❌ Shell execution failed: {e}")
    
    # Test 8: Execute uploaded file
    try:
        print("\n8️⃣  Testing execution of uploaded file...")
        
        # Execute the file we uploaded earlier
        exec_response = client.run_py("exec(open('demo/hello_upload.py').read())", "execute_uploaded.py")
        exec_success = (exec_response.get('returncode') == 0 and 
                       'Hello from uploaded file!' in exec_response.get('stdout', ''))
        
        results.add_test(
            "Execute Uploaded File", 
            exec_success,
            f"Executed previously uploaded file, Exit code: {exec_response.get('returncode')}",
            {
                'returncode': exec_response.get('returncode'),
                'stdout_preview': exec_response.get('stdout', '')[:200]
            }
        )
        
        if exec_success:
            print(f"   ✅ Uploaded file execution successful:")
            print(f"      📤 Exit code: {exec_response['returncode']}")
            print(f"      📋 Output: {exec_response['stdout'].strip()}")
        else:
            print(f"   ❌ Uploaded file execution failed:")
            print(f"      📤 Exit code: {exec_response.get('returncode')}")
            print(f"      📋 Stderr: {exec_response.get('stderr', '')}")
            
    except Exception as e:
        results.add_test(
            "Execute Uploaded File", 
            False, 
            str(e),
            {"error_type": type(e).__name__}
        )
        print(f"   ❌ Uploaded file execution failed: {e}")
    
    # Test 9: Error handling (forbidden command)
    try:
        print("\n9️⃣  Testing error handling (forbidden command)...")
        
        # Try a forbidden command - should fail gracefully
        try:
            shell_response = client.run_sh("sudo echo 'This should fail'")
            # If we get here, the forbidden command wasn't blocked
            error_success = False
            error_message = "Forbidden command was not blocked"
        except NoxClientError as e:
            # Expected - forbidden command should be blocked
            error_success = "Forbidden command" in str(e)
            error_message = f"Correctly blocked forbidden command: {str(e)}"
        
        results.add_test(
            "Error Handling (Forbidden Command)", 
            error_success,
            error_message,
            {"expected_behavior": "Command should be blocked"}
        )
        
        if error_success:
            print(f"   ✅ Forbidden command correctly blocked")
        else:
            print(f"   ⚠️  Forbidden command was not properly handled")
            
    except Exception as e:
        results.add_test(
            "Error Handling (Forbidden Command)", 
            False, 
            str(e),
            {"error_type": type(e).__name__}
        )
        print(f"   ❌ Error handling test failed: {e}")
    
    # Test 10: Performance validation
    try:
        print("\n🔟 Testing performance validation...")
        
        start_time = time.time()
        
        # Quick performance test
        perf_code = """
# Quick performance test
import time
start = time.time()
result = sum(x*x for x in range(1000))
duration = time.time() - start
print(f"Calculated sum of squares: {result}")
print(f"Execution time: {duration:.4f} seconds")
"""
        
        exec_response = client.run_py(perf_code, "performance_test.py")
        execution_time = time.time() - start_time
        
        perf_success = (exec_response.get('returncode') == 0 and 
                       execution_time < 10.0 and  # Should complete within 10 seconds
                       'Calculated sum of squares:' in exec_response.get('stdout', ''))
        
        results.add_test(
            "Performance Validation", 
            perf_success,
            f"API response time: {execution_time:.2f}s, Code executed successfully: {exec_response.get('returncode') == 0}",
            {
                'api_response_time': execution_time,
                'returncode': exec_response.get('returncode'),
                'performance_threshold': '< 10s'
            }
        )
        
        if perf_success:
            print(f"   ✅ Performance test passed:")
            print(f"      ⏱️  API response time: {execution_time:.2f}s")
            print(f"      🎯 Performance within acceptable limits")
        else:
            print(f"   ⚠️  Performance concerns:")
            print(f"      ⏱️  API response time: {execution_time:.2f}s")
            print(f"      📋 Exit code: {exec_response.get('returncode')}")
            
    except Exception as e:
        results.add_test(
            "Performance Validation", 
            False, 
            str(e),
            {"error_type": type(e).__name__}
        )
        print(f"   ❌ Performance test failed: {e}")
    
    # Print final results
    return results.print_summary()


def main():
    """Main entry point for demo tests"""
    print("🎯 NOX API DEMO TESTS")
    print("="*40)
    
    # Check environment
    if not os.getenv('NOX_API_TOKEN'):
        print("❌ ERROR: NOX_API_TOKEN environment variable is required")
        print("\n💡 Setup instructions:")
        print("   export NOX_API_TOKEN='your-token-here'")
        print("   export NOX_API_URL='http://localhost'  # Optional, defaults to http://localhost")
        print("   python clients/tests_demo.py")
        return False
    
    base_url = os.getenv('NOX_API_URL', 'http://localhost')
    print(f"🎯 Target API: {base_url}")
    print(f"🔑 Token: {'*' * (len(os.getenv('NOX_API_TOKEN', '')) - 4) + os.getenv('NOX_API_TOKEN', '')[-4:]}")
    
    # Run the tests
    success = run_demo_tests()
    
    if success:
        print("\n🎉 All tests passed! Nox API is ready for production.")
        return True
    else:
        print("\n⚠️  Some tests failed. Please review the results above.")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
