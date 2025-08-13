#!/bin/bash
# test-deployment.sh - Test script for Nox containerized deployment

set -e

echo "🚀 Nox Containerized Deployment Test Script"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker not found. Please install Docker."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose not found. Please install Docker Compose or Docker with compose plugin."
        exit 1
    fi
    
    # Check if .env exists
    if [ ! -f .env ]; then
        log_warn ".env file not found. Creating from .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            log_info "Please edit .env file with your configuration before running again."
            exit 0
        else
            log_error ".env.example not found. Please create .env file manually."
            exit 1
        fi
    fi
    
    log_info "Prerequisites check passed ✓"
}

# Validate Docker Compose configuration
validate_compose() {
    log_info "Validating docker-compose.yml..."
    
    if docker compose config > /dev/null 2>&1; then
        log_info "Docker Compose configuration is valid ✓"
    elif command -v docker-compose &> /dev/null && docker-compose config > /dev/null 2>&1; then
        log_info "Docker Compose configuration is valid ✓"
    else
        log_error "Docker Compose configuration has errors"
        exit 1
    fi
}

# Build images
build_images() {
    log_info "Building Docker images..."
    
    if docker compose build --no-cache; then
        log_info "Images built successfully ✓"
    elif command -v docker-compose &> /dev/null && docker-compose build --no-cache; then
        log_info "Images built successfully ✓"
    else
        log_error "Failed to build images"
        exit 1
    fi
}

# Start services
start_services() {
    log_info "Starting services..."
    
    if docker compose up -d; then
        log_info "Services started ✓"
    elif command -v docker-compose &> /dev/null && docker-compose up -d; then
        log_info "Services started ✓"
    else
        log_error "Failed to start services"
        exit 1
    fi
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready (30 seconds)..."
    sleep 30
}

# Check service health
check_health() {
    log_info "Checking service health..."
    
    # Check PostgreSQL
    if docker compose exec postgres pg_isready -U noxuser -d noxdb > /dev/null 2>&1 || \
       (command -v docker-compose &> /dev/null && docker-compose exec postgres pg_isready -U noxuser -d noxdb > /dev/null 2>&1); then
        log_info "PostgreSQL is healthy ✓"
    else
        log_error "PostgreSQL health check failed"
        return 1
    fi
    
    # Check API health
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        log_info "Nox API is healthy ✓"
    else
        log_warn "Nox API health check failed - checking logs..."
        if docker compose logs nox-api | tail -10; then
            true
        elif command -v docker-compose &> /dev/null; then
            docker-compose logs nox-api | tail -10
        fi
        return 1
    fi
    
    # Check Dashboard
    if curl -f http://localhost:8501/_stcore/health > /dev/null 2>&1; then
        log_info "Dashboard is healthy ✓"
    else
        log_warn "Dashboard health check failed - this is expected on first run"
    fi
    
    # Check Prometheus
    if curl -f http://localhost:9090/-/healthy > /dev/null 2>&1; then
        log_info "Prometheus is healthy ✓"
    else
        log_warn "Prometheus health check failed"
    fi
    
    # Check Grafana
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log_info "Grafana is healthy ✓"
    else
        log_warn "Grafana health check failed"
    fi
}

# Test API endpoints
test_api() {
    log_info "Testing API endpoints..."
    
    # Test health endpoint
    response=$(curl -s http://localhost:8000/health)
    if echo "$response" | grep -q "healthy"; then
        log_info "API health endpoint works ✓"
    else
        log_error "API health endpoint failed: $response"
        return 1
    fi
    
    # Test metrics endpoint
    if curl -f http://localhost:8000/metrics > /dev/null 2>&1; then
        log_info "API metrics endpoint works ✓"
    else
        log_warn "API metrics endpoint not available"
    fi
    
    # Test docs endpoint
    if curl -f http://localhost:8000/docs > /dev/null 2>&1; then
        log_info "API docs endpoint works ✓"
    else
        log_warn "API docs endpoint not available"
    fi
}

# Initialize database
init_database() {
    log_info "Initializing database..."
    
    if [ -f scripts/init-db.sql ]; then
        if docker compose exec postgres psql -U noxuser -d noxdb -f /docker-entrypoint-initdb.d/init-db.sql > /dev/null 2>&1 || \
           (command -v docker-compose &> /dev/null && docker-compose exec postgres psql -U noxuser -d noxdb -f /docker-entrypoint-initdb.d/init-db.sql > /dev/null 2>&1); then
            log_info "Database initialized ✓"
        else
            log_warn "Database initialization might have failed - checking if tables exist..."
            # Check if users table exists
            if docker compose exec postgres psql -U noxuser -d noxdb -c "SELECT 1 FROM users LIMIT 1;" > /dev/null 2>&1 || \
               (command -v docker-compose &> /dev/null && docker-compose exec postgres psql -U noxuser -d noxdb -c "SELECT 1 FROM users LIMIT 1;" > /dev/null 2>&1); then
                log_info "Database tables already exist ✓"
            else
                log_error "Database initialization failed"
                return 1
            fi
        fi
    else
        log_warn "init-db.sql not found - skipping database initialization"
    fi
}

# Show service status
show_status() {
    log_info "Service status:"
    
    if docker compose ps; then
        true
    elif command -v docker-compose &> /dev/null; then
        docker-compose ps
    fi
    
    echo ""
    log_info "Service URLs:"
    echo "  📡 Nox API:     http://localhost:8000"
    echo "  🖥️  Dashboard:   http://localhost:8501"
    echo "  📊 Prometheus:  http://localhost:9090"
    echo "  📈 Grafana:     http://localhost:3000 (admin/secure_grafana_password)"
    echo ""
    log_info "API Documentation: http://localhost:8000/docs"
    log_info "API Metrics: http://localhost:8000/metrics"
}

# Cleanup function
cleanup() {
    if [ "$1" = "full" ]; then
        log_info "Performing full cleanup..."
        if docker compose down -v --rmi all; then
            true
        elif command -v docker-compose &> /dev/null; then
            docker-compose down -v --rmi all
        fi
    else
        log_info "Stopping services..."
        if docker compose down; then
            true
        elif command -v docker-compose &> /dev/null; then
            docker-compose down
        fi
    fi
}

# Main execution
main() {
    case "${1:-deploy}" in
        "deploy")
            check_prerequisites
            validate_compose
            build_images
            start_services
            init_database
            sleep 5
            if check_health && test_api; then
                log_info "🎉 Deployment test completed successfully!"
                show_status
            else
                log_error "❌ Deployment test failed!"
                log_info "Check logs with: docker-compose logs <service>"
                exit 1
            fi
            ;;
        "stop")
            cleanup
            ;;
        "clean")
            cleanup full
            ;;
        "health")
            check_health && test_api
            ;;
        "status")
            show_status
            ;;
        *)
            echo "Usage: $0 [deploy|stop|clean|health|status]"
            echo "  deploy  - Full deployment test (default)"
            echo "  stop    - Stop all services"
            echo "  clean   - Stop services and remove volumes/images"
            echo "  health  - Check service health"
            echo "  status  - Show service status"
            exit 1
            ;;
    esac
}

# Handle interrupts
trap cleanup EXIT

# Run main function
main "$@"
