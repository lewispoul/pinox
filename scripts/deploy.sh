#!/bin/bash
# Nox API v7.0.0 - Deployment Script
# Automated deployment with health checks and rollback

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DOCKER_IMAGE="nox-api:v7.0.0"
COMPOSE_FILE="docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Parse command line arguments
ENVIRONMENT="development"
SKIP_TESTS=false
SKIP_BUILD=false
FORCE_REBUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --force-rebuild)
            FORCE_REBUILD=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -e, --environment    Deployment environment (development/production)"
            echo "  --skip-tests        Skip running tests"
            echo "  --skip-build        Skip building Docker images"
            echo "  --force-rebuild     Force rebuild of Docker images"
            echo "  -h, --help          Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

log_info "Starting Nox API v7.0.0 deployment..."
log_info "Environment: $ENVIRONMENT"
log_info "Project directory: $PROJECT_DIR"

cd "$PROJECT_DIR"

# Check if .env file exists
if [[ "$ENVIRONMENT" == "production" && ! -f ".env" ]]; then
    log_error ".env file not found for production deployment"
    log_info "Please copy .env.production to .env and configure your secrets"
    exit 1
fi

# Set compose file based on environment
if [[ "$ENVIRONMENT" == "development" ]]; then
    COMPOSE_FILE="docker-compose.dev.yml"
    DOCKER_IMAGE="nox-api:v7.0.0-dev"
fi

# Function to check if Docker is running
check_docker() {
    log_info "Checking Docker availability..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
        exit 1
    fi
    
    log_success "Docker is available"
}

# Function to run tests
run_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        log_warning "Skipping tests (--skip-tests flag)"
        return 0
    fi
    
    log_info "Running tests..."
    
    # Check if pytest is available
    if command -v python3 &> /dev/null && python3 -c "import pytest" &> /dev/null; then
        python3 -m pytest tests/ -v || {
            log_error "Tests failed"
            exit 1
        }
        log_success "All tests passed"
    else
        log_warning "pytest not available, skipping tests"
    fi
}

# Function to build Docker images
build_images() {
    if [[ "$SKIP_BUILD" == "true" ]]; then
        log_warning "Skipping image build (--skip-build flag)"
        return 0
    fi
    
    log_info "Building Docker images..."
    
    # Check if image exists and force rebuild if requested
    if [[ "$FORCE_REBUILD" == "true" ]] || ! docker image inspect "$DOCKER_IMAGE" &> /dev/null; then
        
        if [[ "$ENVIRONMENT" == "development" ]]; then
            log_info "Building development image..."
            docker build -f Dockerfile.dev -t "$DOCKER_IMAGE" . || {
                log_error "Failed to build development image"
                exit 1
            }
        else
            log_info "Building production image..."
            docker build -t "$DOCKER_IMAGE" . || {
                log_error "Failed to build production image"
                exit 1
            }
        fi
        
        log_success "Docker image built successfully: $DOCKER_IMAGE"
    else
        log_info "Using existing Docker image: $DOCKER_IMAGE"
    fi
}

# Function to start services
start_services() {
    log_info "Starting services with Docker Compose..."
    
    # Stop any existing services
    docker-compose -f "$COMPOSE_FILE" down --remove-orphans || true
    
    # Start services
    docker-compose -f "$COMPOSE_FILE" up -d || {
        log_error "Failed to start services"
        exit 1
    }
    
    log_success "Services started successfully"
}

# Function to check service health
check_health() {
    log_info "Checking service health..."
    
    local max_attempts=30
    local attempt=1
    local api_url="http://localhost:8082"
    
    if [[ "$ENVIRONMENT" == "development" ]]; then
        api_url="http://localhost:8082"
    fi
    
    while [[ $attempt -le $max_attempts ]]; do
        log_info "Health check attempt $attempt/$max_attempts..."
        
        if curl -f -s "$api_url/api/v7/auth/health" > /dev/null 2>&1; then
            log_success "API health check passed"
            break
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_error "API health check failed after $max_attempts attempts"
            log_info "Service logs:"
            docker-compose -f "$COMPOSE_FILE" logs nox-api-dev 2>/dev/null || \
            docker-compose -f "$COMPOSE_FILE" logs nox-api 2>/dev/null || true
            exit 1
        fi
        
        sleep 5
        ((attempt++))
    done
    
    # Check additional endpoints
    log_info "Checking additional endpoints..."
    
    endpoints=(
        "/api/v7/status"
        "/api/v7/metrics/prometheus"
    )
    
    for endpoint in "${endpoints[@]}"; do
        if curl -f -s "$api_url$endpoint" > /dev/null 2>&1; then
            log_success "Endpoint $endpoint is healthy"
        else
            log_warning "Endpoint $endpoint is not responding"
        fi
    done
}

# Function to show deployment information
show_deployment_info() {
    log_success "🎉 Nox API v7.0.0 deployment completed successfully!"
    echo
    log_info "Deployment Information:"
    echo "  Environment: $ENVIRONMENT"
    echo "  Docker Image: $DOCKER_IMAGE"
    echo "  Compose File: $COMPOSE_FILE"
    echo
    log_info "Available Services:"
    echo "  🌐 Nox API: http://localhost:8082"
    echo "  📚 API Documentation: http://localhost:8082/docs"
    echo "  📊 Prometheus: http://localhost:9090 (if enabled)"
    echo "  📈 Grafana: http://localhost:3000 (if enabled)"
    
    if [[ "$ENVIRONMENT" == "development" ]]; then
        echo "  🔧 Adminer: http://localhost:8080"
        echo "  📧 MailHog: http://localhost:8025"
    fi
    
    echo
    log_info "Useful Commands:"
    echo "  View logs: docker-compose -f $COMPOSE_FILE logs -f"
    echo "  Stop services: docker-compose -f $COMPOSE_FILE down"
    echo "  View containers: docker-compose -f $COMPOSE_FILE ps"
    echo
}

# Function to cleanup on failure
cleanup_on_failure() {
    log_error "Deployment failed. Cleaning up..."
    docker-compose -f "$COMPOSE_FILE" down --remove-orphans || true
    exit 1
}

# Main deployment process
main() {
    trap cleanup_on_failure ERR
    
    check_docker
    run_tests
    build_images
    start_services
    check_health
    show_deployment_info
}

# Run main function
main "$@"
