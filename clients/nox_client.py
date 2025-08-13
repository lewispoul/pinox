#!/usr/bin/env python3
"""
Nox API Client - Python library for interacting with Nox API
Provides a clean interface for health checks, file uploads, and code execution.
"""

import json
import os
import pathlib
import requests
from typing import Dict, Any, Union, Optional
from urllib.parse import urljoin


class NoxClientError(Exception):
    """Base exception for Nox client operations"""
    pass


class NoxAuthError(NoxClientError):
    """Authentication error"""
    pass


class NoxServerError(NoxClientError):
    """Server-side error"""
    pass


class NoxClient:
    """
    Nox API Client
    
    Provides methods to interact with the Nox API:
    - health(): Check API health
    - put(path, file_or_content): Upload files to sandbox
    - run_py(code, filename): Execute Python code
    - run_sh(cmd): Execute shell commands
    
    Example:
        client = NoxClient("http://localhost", "your-bearer-token")
        print(client.health())
        client.put("test.py", "print('Hello World')")
        result = client.run_py("print(2+2)", "calc.py")
    """
    
    def __init__(self, base_url: str, token: str, timeout: int = 30):
        """
        Initialize Nox API client
        
        Args:
            base_url: Base URL of the Nox API (e.g., http://localhost or https://api.example.com)
            token: Bearer token for authentication
            timeout: Request timeout in seconds (default: 30)
        """
        self.base_url = base_url.rstrip('/')
        self.token = token.strip()
        self.timeout = timeout
        self.session = requests.Session()
        
        # Set up headers
        if self.token:
            self.session.headers.update({
                'Authorization': f'Bearer {self.token}',
                'User-Agent': 'NoxClient/1.0'
            })
    
    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[Any, Any]:
        """
        Make HTTP request to the API
        
        Args:
            method: HTTP method (GET, POST, etc.)
            endpoint: API endpoint path
            **kwargs: Additional arguments for requests
            
        Returns:
            JSON response as dictionary
            
        Raises:
            NoxAuthError: On authentication errors
            NoxServerError: On server errors
            NoxClientError: On other errors
        """
        url = urljoin(self.base_url + '/', endpoint.lstrip('/'))
        
        try:
            kwargs.setdefault('timeout', self.timeout)
            response = self.session.request(method, url, **kwargs)
            
            # Handle authentication errors
            if response.status_code == 401:
                raise NoxAuthError("Invalid or missing authentication token")
            
            # Handle client errors (4xx)
            if 400 <= response.status_code < 500:
                try:
                    error_detail = response.json().get('detail', response.text)
                except:
                    error_detail = response.text
                raise NoxClientError(f"Client error {response.status_code}: {error_detail}")
            
            # Handle server errors (5xx)
            if response.status_code >= 500:
                raise NoxServerError(f"Server error {response.status_code}: {response.text}")
            
            # Parse JSON response
            try:
                return response.json()
            except json.JSONDecodeError:
                raise NoxClientError(f"Invalid JSON response: {response.text}")
                
        except requests.exceptions.Timeout:
            raise NoxClientError(f"Request timeout after {self.timeout} seconds")
        except requests.exceptions.ConnectionError as e:
            raise NoxClientError(f"Connection error: {e}")
        except requests.exceptions.RequestException as e:
            raise NoxClientError(f"Request error: {e}")
    
    def health(self) -> Dict[str, str]:
        """
        Check API health status
        
        Returns:
            Dictionary with status information
            
        Example:
            >>> client.health()
            {'status': 'ok'}
        """
        return self._request('GET', '/health')
    
    def put(self, path: str, file_or_content: Union[str, bytes, pathlib.Path]) -> Dict[str, str]:
        """
        Upload file to the sandbox
        
        Args:
            path: Destination path in sandbox (relative)
            file_or_content: File path, string content, or bytes content
            
        Returns:
            Dictionary with saved file information
            
        Example:
            >>> client.put("hello.py", "print('Hello World')")
            {'saved': '/home/nox/nox/sandbox/hello.py'}
            
            >>> client.put("data.txt", pathlib.Path("local_file.txt"))
            {'saved': '/home/nox/nox/sandbox/data.txt'}
        """
        # Prepare file data
        if isinstance(file_or_content, pathlib.Path):
            # Read from local file path
            with open(file_or_content, 'rb') as f:
                file_data = f.read()
            filename = file_or_content.name
        elif isinstance(file_or_content, str):
            # String content
            file_data = file_or_content.encode('utf-8')
            filename = pathlib.Path(path).name
        elif isinstance(file_or_content, bytes):
            # Bytes content
            file_data = file_or_content
            filename = pathlib.Path(path).name
        else:
            raise ValueError("file_or_content must be str, bytes, or pathlib.Path")
        
        # Prepare multipart upload
        files = {'f': (filename, file_data)}
        params = {'path': path}
        
        return self._request('POST', '/put', files=files, params=params)
    
    def run_py(self, code: str, filename: str = "run.py") -> Dict[str, Any]:
        """
        Execute Python code in the sandbox
        
        Args:
            code: Python code to execute
            filename: Filename for the code (default: run.py)
            
        Returns:
            Dictionary with execution results (returncode, stdout, stderr)
            
        Example:
            >>> result = client.run_py("print(2 + 2)")
            >>> print(result['stdout'])
            4
            >>> print(result['returncode'])
            0
        """
        payload = {
            'code': code,
            'filename': filename
        }
        return self._request('POST', '/run_py', json=payload)
    
    def run_sh(self, cmd: str) -> Dict[str, Any]:
        """
        Execute shell command in the sandbox
        
        Args:
            cmd: Shell command to execute
            
        Returns:
            Dictionary with execution results (returncode, stdout, stderr)
            
        Example:
            >>> result = client.run_sh("ls -la")
            >>> print(result['stdout'])
            total 4
            drwxrwxr-x 2 nox nox 4096 Aug 13 12:00 .
            >>> print(result['returncode'])
            0
        """
        payload = {'cmd': cmd}
        return self._request('POST', '/run_sh', json=payload)
    
    def __repr__(self) -> str:
        return f"NoxClient(base_url='{self.base_url}', timeout={self.timeout})"


def create_client_from_env() -> NoxClient:
    """
    Create NoxClient from environment variables
    
    Environment variables:
    - NOX_API_URL: Base URL (default: http://localhost)
    - NOX_API_TOKEN: Bearer token (required)
    - NOX_API_TIMEOUT: Timeout in seconds (default: 30)
    
    Returns:
        Configured NoxClient instance
        
    Raises:
        ValueError: If NOX_API_TOKEN is not set
        
    Example:
        # Set environment
        export NOX_API_URL="http://localhost"
        export NOX_API_TOKEN="your-token-here"
        
        # Create client
        client = create_client_from_env()
    """
    base_url = os.getenv('NOX_API_URL', 'http://localhost')
    token = os.getenv('NOX_API_TOKEN', '').strip()
    timeout = int(os.getenv('NOX_API_TIMEOUT', '30'))
    
    if not token:
        raise ValueError("NOX_API_TOKEN environment variable is required")
    
    return NoxClient(base_url, token, timeout)


if __name__ == "__main__":
    # Simple command-line interface for testing
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python nox_client.py <command> [args...]")
        print("Commands:")
        print("  health                    - Check API health")
        print("  put <path> <content>      - Upload file")
        print("  run_py <code> [filename]  - Execute Python code")
        print("  run_sh <command>          - Execute shell command")
        print()
        print("Environment variables:")
        print("  NOX_API_URL     - API base URL (default: http://localhost)")
        print("  NOX_API_TOKEN   - Bearer token (required)")
        print("  NOX_API_TIMEOUT - Timeout in seconds (default: 30)")
        sys.exit(1)
    
    try:
        client = create_client_from_env()
        command = sys.argv[1]
        
        if command == "health":
            result = client.health()
            print(json.dumps(result, indent=2))
            
        elif command == "put":
            if len(sys.argv) < 4:
                print("Usage: put <path> <content>")
                sys.exit(1)
            path, content = sys.argv[2], sys.argv[3]
            result = client.put(path, content)
            print(json.dumps(result, indent=2))
            
        elif command == "run_py":
            if len(sys.argv) < 3:
                print("Usage: run_py <code> [filename]")
                sys.exit(1)
            code = sys.argv[2]
            filename = sys.argv[3] if len(sys.argv) > 3 else "run.py"
            result = client.run_py(code, filename)
            print(json.dumps(result, indent=2))
            
        elif command == "run_sh":
            if len(sys.argv) < 3:
                print("Usage: run_sh <command>")
                sys.exit(1)
            cmd = sys.argv[2]
            result = client.run_sh(cmd)
            print(json.dumps(result, indent=2))
            
        else:
            print(f"Unknown command: {command}")
            sys.exit(1)
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
