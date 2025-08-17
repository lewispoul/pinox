#!/bin/bash

# NOX API v8.0.0 - Production Deployment Script
# Section 3: Production Environment Configuration
# Version: v8.0.0
# Date: August 15, 2025

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="nox-api"
APP_VERSION="v8.0.0"
DEPLOY_USER="nox"
APP_DIR="/opt/nox"
BACKUP_DIR="/opt/nox/backups"
LOG_FILE="/var/log/nox/deploy.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

check_prerequisites() {
    log "🔍 Checking deployment prerequisites..."
    
    # Check if running as root or with sudo
    if [[ $EUID -eq 0 ]]; then
        error "Do not run this script as root. Use a user with sudo privileges."
    fi
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        error ".env.production file not found. Please create it from .env.production.example"
    fi
    
    # Check required commands
    local required_commands=("node" "npm" "docker" "docker-compose" "curl" "git")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            error "Required command '$cmd' not found"
        fi
    done
    
    success "Prerequisites check passed"
}

backup_current_version() {
    log "📦 Creating backup of current version..."
    
    if [ -d "$APP_DIR" ]; then
        local backup_name="nox-backup-$(date +%Y%m%d-%H%M%S)"
        sudo mkdir -p "$BACKUP_DIR"
        sudo cp -r "$APP_DIR" "$BACKUP_DIR/$backup_name"
        success "Backup created: $BACKUP_DIR/$backup_name"
    else
        warning "No existing installation found, skipping backup"
    fi
}

validate_environment() {
    log "🔧 Validating production environment..."
    
    # Source environment variables
    source .env.production
    
    # Check critical environment variables
    local required_vars=(
        "NODE_ENV"
        "DATABASE_URL" 
        "REDIS_URL"
        "JWT_SECRET"
        "GOOGLE_CLIENT_ID"
        "GITHUB_CLIENT_ID"
        "MICROSOFT_CLIENT_ID"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            error "Required environment variable $var is not set"
        fi
    done
    
    # Validate NODE_ENV is production
    if [ "$NODE_ENV" != "production" ]; then
        error "NODE_ENV must be set to 'production'"
    fi
    
    success "Environment validation passed"
}

build_application() {
    log "🏗️  Building production application..."
    
    # Clean previous builds
    rm -rf .next/
    rm -rf node_modules/
    
    # Install dependencies
    npm ci --only=production
    
    # Build application
    npm run build
    
    if [ $? -eq 0 ]; then
        success "Application build completed successfully"
    else
        error "Application build failed"
    fi
}

test_production_build() {
    log "🧪 Testing production build..."
    
    # Start application in background
    npm start &
    local app_pid=$!
    
    # Wait for application to start
    sleep 10
    
    # Test health endpoint
    local health_check=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo "000")
    
    # Stop test application
    kill $app_pid 2>/dev/null || true
    
    if [ "$health_check" == "200" ]; then
        success "Production build test passed"
    else
        error "Production build test failed (HTTP $health_check)"
    fi
}

deploy_with_docker() {
    log "🐳 Deploying with Docker..."
    
    # Build Docker image
    docker build -t "$APP_NAME:$APP_VERSION" -t "$APP_NAME:latest" .
    
    if [ $? -eq 0 ]; then
        success "Docker image built successfully"
    else
        error "Docker image build failed"
    fi
    
    # Deploy with docker-compose
    docker-compose down
    docker-compose up -d
    
    # Wait for containers to start
    sleep 15
    
    # Check container status
    local container_status=$(docker-compose ps | grep "Up" | wc -l)
    if [ "$container_status" -gt 0 ]; then
        success "Docker deployment completed successfully"
    else
        error "Docker deployment failed"
    fi
}

validate_deployment() {
    log "✅ Validating deployment..."
    
    # Source environment for URL
    source .env.production
    local app_url="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
    
    # Test health endpoint
    local max_retries=5
    local retry_count=0
    
    while [ $retry_count -lt $max_retries ]; do
        local response=$(curl -s -o /dev/null -w "%{http_code}" "$app_url/api/health" || echo "000")
        
        if [ "$response" == "200" ]; then
            success "Health check passed"
            break
        else
            warning "Health check failed (attempt $((retry_count + 1))/$max_retries)"
            sleep 5
            retry_count=$((retry_count + 1))
        fi
    done
    
    if [ $retry_count -eq $max_retries ]; then
        error "Health check failed after $max_retries attempts"
    fi
    
    # Test OAuth providers
    local oauth_providers=("google" "github" "microsoft")
    for provider in "${oauth_providers[@]}"; do
        local oauth_response=$(curl -s -o /dev/null -w "%{http_code}" "$app_url/api/auth/$provider" || echo "000")
        if [[ "$oauth_response" =~ ^(200|302)$ ]]; then
            success "OAuth provider '$provider' is accessible"
        else
            warning "OAuth provider '$provider' returned HTTP $oauth_response"
        fi
    done
    
    # Test API endpoints
    local api_response=$(curl -s -o /dev/null -w "%{http_code}" "$app_url/api/endpoints" || echo "000")
    if [ "$api_response" == "200" ]; then
        success "API endpoints are accessible"
    else
        warning "API endpoints returned HTTP $api_response"
    fi
}

setup_monitoring() {
    log "📊 Setting up monitoring and logging..."
    
    # Create log directories
    sudo mkdir -p /var/log/nox
    sudo chown "$DEPLOY_USER:$DEPLOY_USER" /var/log/nox
    
    # Setup log rotation
    cat << EOF | sudo tee /etc/logrotate.d/nox
/var/log/nox/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $DEPLOY_USER $DEPLOY_USER
    postrotate
        systemctl reload nox || true
    endscript
}
EOF
    
    success "Monitoring and logging configured"
}

print_deployment_summary() {
    echo ""
    echo "=================================================="
    echo "🚀 NOX API v8.0.0 Deployment Complete!"
    echo "=================================================="
    echo ""
    echo "📊 Deployment Summary:"
    echo "  ✅ Version: $APP_VERSION"
    echo "  ✅ Environment: Production"
    echo "  ✅ Build: Successful"
    echo "  ✅ Health Check: Passed"
    echo "  ✅ Monitoring: Configured"
    echo ""
    echo "🔗 Application URLs:"
    source .env.production
    echo "  📱 Frontend: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
    echo "  🔌 API: ${NEXT_PUBLIC_API_BASE_URL:-http://localhost:3000/api}"
    echo "  ❤️  Health: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}/api/health"
    echo ""
    echo "📋 Next Steps:"
    echo "  1. Configure DNS to point to this server"
    echo "  2. Set up SSL certificates if not using Let's Encrypt"
    echo "  3. Configure external monitoring (Sentry, New Relic, etc.)"
    echo "  4. Set up automated backups"
    echo "  5. Configure load balancer if using multiple instances"
    echo ""
    echo "📞 Support:"
    echo "  📖 Documentation: ./docs/deployment-guides/PRODUCTION_DEPLOYMENT_GUIDE.md"
    echo "  📝 Logs: /var/log/nox/"
    echo "  🐳 Containers: docker-compose logs"
    echo ""
    echo "✅ Deployment completed successfully!"
}

# Main deployment flow
main() {
    echo "🚀 Starting NOX API v8.0.0 Production Deployment"
    echo "=================================================="
    
    check_prerequisites
    validate_environment
    backup_current_version
    build_application
    test_production_build
    
    # Choose deployment method
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        deploy_with_docker
    else
        warning "Docker not available, deploying directly"
        # Direct deployment logic would go here
    fi
    
    validate_deployment
    setup_monitoring
    print_deployment_summary
    
    success "🎉 NOX API v8.0.0 deployed successfully!"
}

# Run main function
main "$@"
