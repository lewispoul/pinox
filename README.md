# NOX API

A secure, sandboxed execution platform built on **FastAPI** for autonomous computational chemistry workflows.

## 🚀 Overview

NOX API combines secure Python/shell execution with advanced AI agent capabilities, designed for computational chemistry research and automation.

**Key Features:**
- 🤖 **NOX Agent**: Autonomous coding system with file operations and LLM integration
- ⚗️ **XTB Integration**: Quantum chemistry computation workflows with JSON parsing
- 🔒 **Secure Execution**: Sandboxed environment with comprehensive safety guardrails
- 📊 **Job Management**: Asynchronous task processing with state tracking
- 🔑 **OAuth2 + IAM**: Advanced authentication and role-based access control

## 📚 Documentation

All documentation has been comprehensively organized in the [`docs/`](./docs/) directory.

**Quick Start:**
- 📖 **[Documentation Index](./docs/README.md)** - Complete documentation overview
- 🎯 **[Current Project Status](./docs/PROJECT_STATUS_2025-08-19.md)** - Latest development status
- 📋 **[Latest Session Summary](./docs/SESSION_SUMMARY_2025-08-19.md)** - Recent achievements
- 🚀 **[Deployment Guides](./docs/deployment-guides/)** - Production setup instructions

**Recent Major Achievements (August 19, 2025):**
- ✅ **File-Operations System v0.2** - Revolutionary 24x performance improvement
- ✅ **XTBA-001 XTB Integration** - Complete quantum chemistry workflow automation
- ✅ **Offline Plan Injection** - Deterministic execution without external API dependencies
- ✅ **Comprehensive Documentation** - 91+ organized documentation files

## 🛠️ Quick Setup

```bash
```bash
# Clone the repository
git clone https://github.com/lewispoul/nox.git
cd nox

# Install dependencies
pip install -r requirements.txt

# Run the API
python -m uvicorn nox_api.api.nox_api:app --host 0.0.0.0 --port 8000
```

### 🚀 Agent GUI Quickstart (30 seconds)

For the full interactive experience:

```bash
# Start with GUI enabled (recommended)
make dev
# or: uvicorn nox_api.api.nox_api:app --host 0.0.0.0 --port 8000 --reload

# Open browser to: http://localhost:8000/gui
```

**🎯 Instant Agent Features:**
- **Interactive Terminal** - Safe command execution in sandbox
- **AI Chat Interface** - Code assistance (set OPENAI_API_KEY)  
- **File Management** - Drag-drop uploads, instant browser
- **Test Runner** - One-click pytest with live results
- **API Builder** - Test all endpoints interactively

## 🎯 Agent GUI Interface

Pinox now includes a comprehensive web-based GUI for agent development and testing.

### Starting the GUI

```bash
# Development mode with auto-reload
source .venv/bin/activate && uvicorn nox_api.api.nox_api:app --host 0.0.0.0 --port 8000 --reload

# Or using Makefile
make dev
```

Visit the GUI at: **http://localhost:8000/gui**

### GUI Features

**🖥️ Interactive Terminal**
- Sandboxed command execution via WebSocket
- Real-time output streaming
- Safe command filtering (forbidden: `rm`, `sudo`, `kill`, etc.)

**💬 AI Chat Interface**
- Direct integration with OpenAI API
- Contextual conversations about your code
- Requires `OPENAI_API_KEY` environment variable

**📁 File Explorer**
- Drag-and-drop file uploads
- File viewing and deletion
- Integrated with existing `/put`, `/list`, `/cat`, `/delete` endpoints

**🧪 Test Runner**  
- One-click pytest execution
- Live output streaming
- Support for custom test paths and arguments

**🔧 Request Builder**
- Interactive API testing interface
- JSON request/response formatting
- Auto-filled authentication headers

### Keyboard Shortcuts

- **Ctrl+Enter** in Chat: Send message
- **Ctrl+R** in Test Runner: Run tests  
- **Ctrl+U** anywhere: Focus file upload

## 📧 Email Integration

Send emails with attachments from the sandboxed environment:

```bash
# Configure SMTP settings
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USERNAME=your-email@gmail.com
export SMTP_PASSWORD=your-app-password
export SMTP_USE_TLS=1
export SMTP_FROM=your-email@gmail.com

# Send email via API
curl -X POST http://localhost:8000/mail \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test from Pinox",
    "body": "Hello from the sandbox!",
    "attachments": ["results.txt", "logs/output.log"]
  }'
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
pytest -q

# Run specific test categories
pytest tests/test_chat.py -v
pytest tests/test_run_tests.py -v  
pytest tests/test_mail.py -v
pytest tests/test_file_operations.py -v

# Run with authentication tests
export NOX_API_TOKEN=test-token-123
pytest tests/test_*auth* -v
```

## 📋 API Reference

### Core Endpoints

```bash
# Health check
curl -sS http://127.0.0.1:8000/health

# Execute Python code
curl -sS -X POST http://127.0.0.1:8000/run_py \
  -H 'Content-Type: application/json' \
  -d '{"code":"print(2+2)"}'

# Execute shell command
curl -sS -X POST http://127.0.0.1:8000/run_sh \
  -H 'Content-Type: application/json' \
  -d '{"cmd":"echo ok"}'

# Upload file
curl -X POST http://127.0.0.1:8000/put \
  -F "f=@example.txt" \
  -F "path=uploaded_file.txt"

# List files
curl -sS http://127.0.0.1:8000/list?path=

# Read file content
curl -sS http://127.0.0.1:8000/cat?path=uploaded_file.txt

# Delete file
curl -X DELETE http://127.0.0.1:8000/delete?path=uploaded_file.txt
```

### Agent Features

```bash
# Chat with AI assistant
curl -sS -X POST http://127.0.0.1:8000/chat \
  -H 'Content-Type: application/json' \
  -d '{
    "messages": [
      {"role": "user", "content": "Help me debug this Python code"}
    ]
  }'

# Run tests
curl -sS -X POST http://127.0.0.1:8000/run_tests \
  -H 'Content-Type: application/json' \
  -d '{"test_path": "tests/", "args": ["-v"]}'

# Send email
curl -sS -X POST http://127.0.0.1:8000/mail \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "me@example.com",
    "subject": "Results from Pinox",
    "body": "Please find the analysis results attached.",
    "attachments": ["results.csv", "plots/analysis.png"]
  }'

# Get metrics (Prometheus format)
curl -sS http://127.0.0.1:8000/metrics
```

### With Authentication

When `NOX_API_TOKEN` is set, include the Bearer token:

```bash
# Set your token
export NOX_API_TOKEN=your-secret-token

# Authenticated request
curl -sS -X POST http://127.0.0.1:8000/run_py \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your-secret-token' \
  -d '{"code":"print(\"Hello, authenticated world!\")"}'
```

## 📸 Screenshots

### Agent GUI Interface

The Pinox Agent GUI provides a comprehensive web-based interface for development and testing:

**Main Interface Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│                     Pinox Agent GUI                            │
├─────────────────┬───────────────────────────────────────────────┤
│  📁 File        │  🖥️ Terminal | 💬 Chat | 🧪 Tests | 🔧 API     │
│   Explorer      │                                               │
│                 │  ┌─────────────────────────────────────────┐  │
│ ┌─────────────┐ │  │ $ echo "Hello from terminal"           │  │
│ │ Upload Area │ │  │ Hello from terminal                     │  │
│ │ (Drag&Drop) │ │  │ $ ls -la                                │  │
│ └─────────────┘ │  │ total 8                                 │  │
│                 │  │ drwx------ 2 user user 4096 Aug 22     │  │
│ File List:      │  │ -rw-r--r-- 1 user user   13 Aug 22     │  │
│ • script.py     │  │                                         │  │
│ • results.txt   │  │ $ |                                     │  │
│ • logs/         │  └─────────────────────────────────────────┘  │
│                 │                                               │
└─────────────────┴───────────────────────────────────────────────┘
```

**Key Visual Features:**
- **Responsive 2-column layout** with file explorer on left, tabbed interface on right
- **Modern styling** using Tailwind CSS with professional color scheme
- **Interactive terminal** with green-on-black retro styling 
- **Real-time file management** with drag-drop upload zones
- **Tabbed interface** for easy navigation between tools
- **Keyboard shortcuts** prominently displayed for power users

**Tab Interfaces:**

1. **🖥️ Terminal Tab:**
   - Black background with green text (classic terminal aesthetic)
   - Real-time command execution via WebSocket
   - Command history and scrollable output
   - Safe command filtering indicators

2. **💬 Chat Tab:**
   - Clean chat bubble interface
   - User messages (blue) vs AI responses (gray)
   - Configuration status indicators
   - Ctrl+Enter quick send functionality

3. **🧪 Test Runner Tab:**
   - Live test output streaming
   - Green/red status indicators
   - One-click "Run Tests" button
   - Progress indicators and final summaries

4. **🔧 Request Builder Tab:**
   - HTTP method selector dropdown
   - URL path input field
   - JSON body editor with syntax highlighting
   - Response viewer with status code colors

**Mobile Responsive Design:**
- Stacked layout on mobile devices
- Touch-optimized buttons and controls
- Swipe gestures for tab navigation
- Collapsible file explorer on small screens

### Development Screenshots

*(Screenshots would be taken here when the server is running)*

**To generate screenshots:**
```bash
# Start the server
make dev

# Open browser to http://localhost:8000/gui
# Take screenshots of each tab interface
# Show file upload in action
# Demonstrate terminal commands
# Show chat interface with AI responses
```

### Integration Examples

**File Management in Action:**
- Drag files from desktop → immediate upload to sandbox
- Click file names → instant content preview in new tab
- Delete confirmations with one-click cleanup
- Real-time file list updates

**Terminal Capabilities:**
- Safe command execution (`echo`, `ls`, `cat`, `python`)
- Blocked dangerous commands (`rm`, `sudo`, `kill`)
- Real-time output streaming
- HTTP fallback when WebSocket unavailable

**AI Chat Integration:**
- Context-aware conversations about uploaded code
- Error analysis and debugging suggestions  
- Code review and optimization recommendations
- Integration with file contents for contextual help

```bash
# Core settings
export NOX_SANDBOX=/tmp/nox_sandbox     # Sandbox directory
export NOX_TIMEOUT=30                   # Command timeout in seconds
export NOX_API_TOKEN=your-secret-token  # Optional Bearer token auth
export NOX_METRICS_ENABLED=1           # Enable Prometheus metrics

# GUI and AI features
export OPENAI_API_KEY=sk-...            # OpenAI API key for chat
export SMTP_HOST=smtp.gmail.com         # SMTP server for email
export SMTP_PORT=587                    # SMTP port
export SMTP_USERNAME=user@example.com   # SMTP username
export SMTP_PASSWORD=app-password       # SMTP password
export SMTP_USE_TLS=1                   # Enable TLS (1) or disable (0)
export SMTP_FROM=sender@example.com     # From email address
```

Turn Pinox into a self-hosted FastAPI agent service with clean import paths and reliable bootstrap scripts.

### Bootstrap Setup

Use the bootstrap script to automatically set up your environment:

```bash
# Run the bootstrap script
./scripts/bootstrap_agent.sh
```

The bootstrap script will:
- Create a virtual environment if missing
- Install/update all dependencies including `python-multipart>=0.0.9`
- Create a default `.env` file with configuration placeholders
- Provide next steps and verification commands

### Environment Variables

Edit the `.env` file created by the bootstrap script:

```bash
# Pinox API Configuration
OPENAI_API_KEY=""          # OpenAI API key for LLM integration
NOX_API_TOKEN=""           # Bearer token for API authentication
NOX_SANDBOX="/home/nox/nox/sandbox"  # Sandbox directory path
NOX_TIMEOUT="20"           # Execution timeout in seconds
NOX_METRICS_ENABLED="1"    # Enable/disable metrics collection
```

**Security Note**: Keep your `.env` file secure and never commit it to version control.

### Systemd Service Setup

For production deployment, install the systemd service:

```bash
# Copy the service file
sudo cp deploy/systemd/pinox-api.service /etc/systemd/system/

# Reload systemd and enable the service
sudo systemctl daemon-reload
sudo systemctl enable pinox-api

# Start the service
sudo systemctl restart pinox-api

# Check status
sudo systemctl status pinox-api
```

**Network Access**: Ensure port 8000 is reachable on your LAN. The service binds to `0.0.0.0:8000`.

### Development Mode

For local development, use the dev runner script:

```bash
# Start in development mode
./scripts/dev_run.sh
```

### Verification Commands

Test your installation:

```bash
# Health check
curl -sS http://127.0.0.1:8000/health

# API documentation
curl -sS http://127.0.0.1:8000/docs | head -20

# Access interactive docs
open http://localhost:8000/docs
```

The canonical import path for the application is: `nox_api.api.nox_api:app`
```

## 🔧 Running nox-api via uvicorn/systemd

The nox-api service can be run directly with uvicorn or as a systemd service.

### Direct uvicorn execution

```bash
# Install dependencies
pip install fastapi uvicorn python-multipart prometheus_client

# Run the API service
uvicorn nox_api.api.nox_api:app --host 0.0.0.0 --port 8000

# Or with custom configuration
NOX_API_TOKEN="your-token" \
NOX_SANDBOX="/tmp/nox_sandbox" \
NOX_METRICS_ENABLED="1" \
uvicorn nox_api.api.nox_api:app --host 0.0.0.0 --port 8000 --reload
```

### systemd service configuration

Create a systemd unit file at `/etc/systemd/system/pinox-api.service`:

```ini
[Unit]
Description=Pinox API Service
After=network.target

[Service]
Type=exec
User=nox
Group=nox
WorkingDirectory=/path/to/pinox
Environment=NOX_API_TOKEN=your-secure-token
Environment=NOX_SANDBOX=/home/nox/nox/sandbox
Environment=NOX_METRICS_ENABLED=1
ExecStart=/usr/local/bin/uvicorn nox_api.api.nox_api:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable pinox-api
sudo systemctl start pinox-api

# Check service status
sudo systemctl status pinox-api
```

### Health Check and API Documentation

- **Health endpoint**: `GET /health` - Returns service status and sandbox path
- **API documentation**: `GET /docs` - Interactive Swagger UI
- **Metrics endpoint**: `GET /metrics` - Prometheus metrics (if enabled)

Example health check:
```bash
curl http://localhost:8000/health
# {"status":"ok","sandbox":"/tmp/nox_sandbox"}
```

## 🎯 Architecture

- **`/api`** - FastAPI application with REST endpoints
- **`/agent`** - NOX Agent system with autonomous coding capabilities  
- **`/nox`** - Core computation modules (XTB, parsers, runners)
- **`/tests`** - Comprehensive test suite with async testing
- **`/docs`** - Complete documentation library (91+ files)
- **`/docs-interactive`** - Interactive documentation website (Next.js)

## 📊 Current Status

**Development Phase:** Advanced autonomous agent integration with production-ready systems.

For detailed status, see [PROJECT_STATUS_2025-08-19.md](./docs/PROJECT_STATUS_2025-08-19.md).

## 🤝 Contributing

1. Review the [Documentation Index](./docs/README.md) for project context
2. Check [Current Project Status](./docs/PROJECT_STATUS_2025-08-19.md) for active development areas
3. Follow the development protocols in [.copilot-instructions.md](./.copilot-instructions.md)

## 🔒 Security & Safety

NOX API implements comprehensive security measures:
- Sandboxed execution environments with path restrictions
- Bearer token authentication with configurable permissions
- File operation allowlists and size limits
- Comprehensive audit logging and monitoring

## 📄 License

See LICENSE file for details.

---

*For the most current information, always refer to the organized documentation in [`docs/`](./docs/).*
