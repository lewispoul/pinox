#!/bin/bash
# Nox API v7.0.0 - Production Health Check Script
# Comprehensive health monitoring and alerting

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
API_URL="${API_URL:-http://localhost:8082}"
TIMEOUT="${TIMEOUT:-10}"
MAX_RETRIES="${MAX_RETRIES:-3}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Health check results
HEALTH_STATUS="HEALTHY"
FAILED_CHECKS=()
WARNING_CHECKS=()

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
    WARNING_CHECKS+=("$1")
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
    FAILED_CHECKS+=("$1")
    HEALTH_STATUS="UNHEALTHY"
}

# Function to make HTTP requests with retry logic
make_request() {
    local url="$1"
    local expected_status="${2:-200}"
    local retry_count=0
    
    while [[ $retry_count -lt $MAX_RETRIES ]]; do
        local response=$(curl -s -w "%{http_code}" -o /tmp/health_response.json --max-time "$TIMEOUT" "$url" 2>/dev/null || echo "000")
        
        if [[ "$response" == "$expected_status" ]]; then
            return 0
        fi
        
        ((retry_count++))
        if [[ $retry_count -lt $MAX_RETRIES ]]; then
            sleep 2
        fi
    done
    
    return 1
}

# Function to check API health endpoint
check_api_health() {
    log_info "Checking API health endpoint..."
    
    if make_request "$API_URL/api/v7/auth/health"; then
        local health_data=$(cat /tmp/health_response.json)
        local status=$(echo "$health_data" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('status', 'unknown'))" 2>/dev/null || echo "unknown")
        
        if [[ "$status" == "healthy" ]]; then
            log_success "API health endpoint is healthy"
        else
            log_error "API health endpoint returned status: $status"
        fi
    else
        log_error "API health endpoint is not responding"
    fi
}

# Function to check API status endpoint
check_api_status() {
    log_info "Checking API status endpoint..."
    
    if make_request "$API_URL/api/v7/status"; then
        local status_data=$(cat /tmp/health_response.json)
        local version=$(echo "$status_data" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('version', 'unknown'))" 2>/dev/null || echo "unknown")
        
        if [[ "$version" == "7.0.0" ]]; then
            log_success "API status endpoint reports correct version: $version"
        else
            log_warning "API status endpoint reports unexpected version: $version"
        fi
    else
        log_error "API status endpoint is not responding"
    fi
}

# Function to check OAuth2 endpoints
check_oauth_endpoints() {
    log_info "Checking OAuth2 endpoints..."
    
    local oauth_endpoints=(
        "/api/v7/auth/google/login"
        "/api/v7/auth/github/login" 
        "/api/v7/auth/microsoft/login"
    )
    
    for endpoint in "${oauth_endpoints[@]}"; do
        # OAuth login endpoints should return 302 (redirect)
        if make_request "$API_URL$endpoint" "302"; then
            log_success "OAuth2 endpoint $endpoint is responding correctly"
        else
            log_error "OAuth2 endpoint $endpoint is not responding correctly"
        fi
    done
}

# Function to check metrics endpoint
check_metrics_endpoint() {
    log_info "Checking metrics endpoint..."
    
    if make_request "$API_URL/api/v7/metrics/prometheus"; then
        local metrics_data=$(cat /tmp/health_response.json)
        
        # Check if we have some expected metrics
        if grep -q "nox_api_requests_total" /tmp/health_response.json 2>/dev/null; then
            log_success "Metrics endpoint is providing expected metrics"
        else
            log_warning "Metrics endpoint is responding but may not have expected metrics"
        fi
    else
        log_error "Metrics endpoint is not responding"
    fi
}

# Function to check database connectivity
check_database() {
    log_info "Checking database connectivity..."
    
    # Check through API database test endpoint if available
    if make_request "$API_URL/api/v7/auth/db-health" "200"; then
        log_success "Database connectivity is healthy"
    else
        # Check if PostgreSQL container is running
        if docker-compose ps postgres | grep -q "Up"; then
            log_warning "Database container is running but API cannot connect"
        else
            log_error "Database container is not running"
        fi
    fi
}

# Function to check Redis connectivity
check_redis() {
    log_info "Checking Redis connectivity..."
    
    # Check if Redis container is running
    if docker-compose ps redis | grep -q "Up" 2>/dev/null; then
        log_success "Redis container is running"
        
        # Test Redis connection if redis-cli is available
        if command -v redis-cli &> /dev/null; then
            if redis-cli -h localhost -p 6379 ping | grep -q "PONG" 2>/dev/null; then
                log_success "Redis is responding to ping"
            else
                log_warning "Redis container is running but not responding to ping"
            fi
        fi
    else
        log_error "Redis container is not running"
    fi
}

# Function to check system resources
check_system_resources() {
    log_info "Checking system resources..."
    
    # Check memory usage
    local memory_usage=$(free | awk '/^Mem:/{printf "%.1f", $3/$2 * 100.0}')
    if (( $(echo "$memory_usage > 90" | bc -l) )); then
        log_error "High memory usage: ${memory_usage}%"
    elif (( $(echo "$memory_usage > 80" | bc -l) )); then
        log_warning "Memory usage is high: ${memory_usage}%"
    else
        log_success "Memory usage is normal: ${memory_usage}%"
    fi
    
    # Check disk usage
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [[ $disk_usage -gt 90 ]]; then
        log_error "High disk usage: ${disk_usage}%"
    elif [[ $disk_usage -gt 80 ]]; then
        log_warning "Disk usage is high: ${disk_usage}%"
    else
        log_success "Disk usage is normal: ${disk_usage}%"
    fi
    
    # Check load average
    local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    local cpu_count=$(nproc)
    local load_threshold=$(echo "$cpu_count * 2" | bc)
    
    if (( $(echo "$load_avg > $load_threshold" | bc -l) )); then
        log_warning "High system load: $load_avg (CPUs: $cpu_count)"
    else
        log_success "System load is normal: $load_avg (CPUs: $cpu_count)"
    fi
}

# Function to check Docker containers
check_containers() {
    log_info "Checking Docker containers..."
    
    local containers=(
        "nox-api"
        "postgres"
        "redis"
    )
    
    for container in "${containers[@]}"; do
        if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "$container.*Up"; then
            log_success "Container $container is running"
        else
            log_error "Container $container is not running or unhealthy"
        fi
    done
}

# Function to check SSL/TLS if applicable
check_ssl() {
    log_info "Checking SSL/TLS configuration..."
    
    if [[ "$API_URL" == https://* ]]; then
        local domain=$(echo "$API_URL" | sed 's|https://||' | sed 's|/.*||')
        
        if command -v openssl &> /dev/null; then
            local ssl_info=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
            
            if [[ -n "$ssl_info" ]]; then
                local expiry_date=$(echo "$ssl_info" | grep "notAfter=" | cut -d= -f2)
                local days_until_expiry=$(( ($(date -d "$expiry_date" +%s) - $(date +%s)) / 86400 ))
                
                if [[ $days_until_expiry -lt 7 ]]; then
                    log_error "SSL certificate expires in $days_until_expiry days"
                elif [[ $days_until_expiry -lt 30 ]]; then
                    log_warning "SSL certificate expires in $days_until_expiry days"
                else
                    log_success "SSL certificate is valid for $days_until_expiry more days"
                fi
            else
                log_error "Could not retrieve SSL certificate information"
            fi
        else
            log_warning "openssl not available, skipping SSL check"
        fi
    else
        log_info "Non-HTTPS endpoint, skipping SSL check"
    fi
}

# Function to generate health report
generate_report() {
    echo
    log_info "=== Nox API v7.0.0 Health Check Report ==="
    echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "API URL: $API_URL"
    echo "Overall Status: $HEALTH_STATUS"
    echo
    
    if [[ ${#FAILED_CHECKS[@]} -gt 0 ]]; then
        echo -e "${RED}Failed Checks (${#FAILED_CHECKS[@]}):${NC}"
        for check in "${FAILED_CHECKS[@]}"; do
            echo "  ❌ $check"
        done
        echo
    fi
    
    if [[ ${#WARNING_CHECKS[@]} -gt 0 ]]; then
        echo -e "${YELLOW}Warning Checks (${#WARNING_CHECKS[@]}):${NC}"
        for check in "${WARNING_CHECKS[@]}"; do
            echo "  ⚠️  $check"
        done
        echo
    fi
    
    if [[ ${#FAILED_CHECKS[@]} -eq 0 && ${#WARNING_CHECKS[@]} -eq 0 ]]; then
        echo -e "${GREEN}✅ All health checks passed successfully!${NC}"
        echo
    fi
}

# Function to send alerts (placeholder for integration)
send_alerts() {
    if [[ "$HEALTH_STATUS" == "UNHEALTHY" ]]; then
        log_info "Health check failed - alerts would be sent here"
        # Integration points:
        # - Slack webhook
        # - Email notification
        # - PagerDuty incident
        # - Discord webhook
    fi
}

# Parse command line arguments
VERBOSE=false
SKIP_SYSTEM_CHECKS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --skip-system)
            SKIP_SYSTEM_CHECKS=true
            shift
            ;;
        --api-url)
            API_URL="$2"
            shift 2
            ;;
        --timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -v, --verbose       Verbose output"
            echo "  --skip-system       Skip system resource checks"
            echo "  --api-url URL       API base URL (default: http://localhost:8082)"
            echo "  --timeout SECONDS   Request timeout (default: 10)"
            echo "  -h, --help          Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Main health check process
main() {
    log_info "Starting Nox API v7.0.0 health check..."
    
    # Core API checks
    check_api_health
    check_api_status
    check_oauth_endpoints
    check_metrics_endpoint
    
    # Infrastructure checks
    check_database
    check_redis
    check_containers
    
    # System checks (if not skipped)
    if [[ "$SKIP_SYSTEM_CHECKS" == "false" ]]; then
        check_system_resources
    fi
    
    # Security checks
    check_ssl
    
    # Generate report
    generate_report
    
    # Send alerts if needed
    send_alerts
    
    # Cleanup
    rm -f /tmp/health_response.json
    
    # Exit with appropriate code
    if [[ "$HEALTH_STATUS" == "UNHEALTHY" ]]; then
        exit 1
    else
        exit 0
    fi
}

# Run main function
main "$@"
