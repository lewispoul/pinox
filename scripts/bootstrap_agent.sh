#!/usr/bin/env bash
set -euo pipefail

# Pinox Agent Bootstrap Script
# Sets up the environment for running Pinox as a self-hosted FastAPI service

PROJECT_DIR="$HOME/pinox"
VENV_DIR="$PROJECT_DIR/.venv"

echo "🚀 Pinox Agent Bootstrap"
echo "========================="

# Create project directory if it doesn't exist
if [[ ! -d "$PROJECT_DIR" ]]; then
    echo "❌ Project directory $PROJECT_DIR does not exist."
    echo "   Please clone the repository to $PROJECT_DIR first:"
    echo "   git clone https://github.com/lewispoul/pinox $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# Create virtual environment if missing
if [[ ! -d "$VENV_DIR" ]]; then
    echo "📦 Creating virtual environment at $VENV_DIR"
    python3 -m venv "$VENV_DIR"
fi

# Activate virtual environment
source "$VENV_DIR/bin/activate"

# Install/update dependencies from requirements.txt
echo "📥 Installing/updating dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Ensure python-multipart>=0.0.9 is installed
echo "🔍 Ensuring python-multipart>=0.0.9 is available..."
pip install 'python-multipart>=0.0.9'

# Create .env file if missing
ENV_FILE="$PROJECT_DIR/.env"
if [[ ! -f "$ENV_FILE" ]]; then
    echo "⚙️  Creating default .env file at $ENV_FILE"
    cat > "$ENV_FILE" << 'EOF'
# Pinox API Configuration
OPENAI_API_KEY=""
NOX_API_TOKEN=""
NOX_SANDBOX="/home/nox/nox/sandbox"
NOX_TIMEOUT="20"
NOX_METRICS_ENABLED="1"
EOF
    echo "📝 Please edit $ENV_FILE and set appropriate values for your environment"
else
    echo "✅ .env file already exists at $ENV_FILE"
fi

echo ""
echo "✅ Bootstrap complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit $ENV_FILE and configure your settings"
echo "2. Start the service:"
echo "   cd $PROJECT_DIR"
echo "   source .venv/bin/activate"
echo "   uvicorn nox_api.api.nox_api:app --host 0.0.0.0 --port 8000"
echo ""
echo "🔍 Basic health checks:"
echo "   curl -sS http://127.0.0.1:8000/health"
echo "   curl -sS http://127.0.0.1:8000/docs | head -20"
echo ""
echo "🌐 Access documentation at: http://localhost:8000/docs"