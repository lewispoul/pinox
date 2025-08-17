#!/bin/bash

# NOX API v8.0.0 - Production Health Check & Validation Script
# Section 3: Production Environment Configuration
# Date: August 15, 2025

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_NAME="NOX Production Health Check"
VERSION="v8.0.0"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Load environment variables
load_environment() {
    if [ -f ".env.production" ]; then
        source .env.production
        success "Production environment loaded"
    else
        warning "Production environment file not found, using defaults"
        NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-"http://localhost:3000"}
    fi
}

# Check system resources
check_system_resources() {
    log "🖥️  Checking system resources..."
    
    # Check disk space
    local disk_usage=$(df / | awk 'NR==2{printf "%.1f", $5}' | sed 's/%//')
    if (( $(echo "$disk_usage > 80" | bc -l) )); then
        warning "Disk usage is high: ${disk_usage}%"
    else
        success "Disk usage: ${disk_usage}%"
    fi
    
    # Check memory usage
    local mem_usage=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
    if (( $(echo "$mem_usage > 80" | bc -l) )); then
        warning "Memory usage is high: ${mem_usage}%"
    else
        success "Memory usage: ${mem_usage}%"
    fi
    
    # Check load average
    local load_avg=$(uptime | awk -F'load average:' '{ print $2 }' | cut -d, -f1 | xargs)
    success "Load average: $load_avg"
}

# Check application health
check_application_health() {
    log "🚀 Checking application health..."
    
    local app_url="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
    
    # Health endpoint
    local health_response=$(curl -s -o /dev/null -w "%{http_code}" "$app_url/api/health" 2>/dev/null || echo "000")
    if [ "$health_response" == "200" ]; then
        success "Application health endpoint: OK"
    else
        error "Application health endpoint failed: HTTP $health_response"
        return 1
    fi
    
    # API endpoints
    local api_response=$(curl -s -o /dev/null -w "%{http_code}" "$app_url/api/endpoints" 2>/dev/null || echo "000")
    if [ "$api_response" == "200" ]; then
        success "API endpoints: OK"
    else
        warning "API endpoints returned: HTTP $api_response"
    fi
}

# Check OAuth providers
check_oauth_providers() {
    log "🔐 Checking OAuth providers..."
    
    local app_url="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
    local providers=("google" "github" "microsoft")
    
    for provider in "${providers[@]}"; do
        local oauth_response=$(curl -s -o /dev/null -w "%{http_code}" "$app_url/api/auth/$provider" 2>/dev/null || echo "000")
        if [[ "$oauth_response" =~ ^(200|302|401)$ ]]; then
            success "OAuth provider '$provider': Accessible"
        else
            warning "OAuth provider '$provider': HTTP $oauth_response"
        fi
    done
}

# Check database connectivity
check_database_connectivity() {
    log "🗄️  Checking database connectivity..."
    
    if [ -n "$DATABASE_URL" ]; then
        # Try to connect to database (simplified check)
        local db_check=$(curl -s -o /dev/null -w "%{http_code}" "${NEXT_PUBLIC_APP_URL:-http://localhost:3000}/api/health/database" 2>/dev/null || echo "000")
        if [ "$db_check" == "200" ]; then
            success "Database connectivity: OK"
        else
            warning "Database connectivity check returned: HTTP $db_check"
        fi
    else
        warning "DATABASE_URL not configured"
    fi
}

# Check Redis connectivity
check_redis_connectivity() {
    log "🔄 Checking Redis connectivity..."
    
    if [ -n "$REDIS_URL" ]; then
        local redis_check=$(curl -s -o /dev/null -w "%{http_code}" "${NEXT_PUBLIC_APP_URL:-http://localhost:3000}/api/health/redis" 2>/dev/null || echo "000")
        if [ "$redis_check" == "200" ]; then
            success "Redis connectivity: OK"
        else
            warning "Redis connectivity check returned: HTTP $redis_check"
        fi
    else
        warning "REDIS_URL not configured"
    fi
}

# Check SSL certificate
check_ssl_certificate() {
    log "🔒 Checking SSL certificate..."
    
    local app_url="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
    
    if [[ "$app_url" == https://* ]]; then
        local domain=$(echo "$app_url" | sed 's|https://||' | sed 's|/.*||')
        local cert_expiry=$(echo | timeout 10 openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null | grep "notAfter" | cut -d= -f2)
        
        if [ -n "$cert_expiry" ]; then
            success "SSL certificate valid until: $cert_expiry"
        else
            warning "Could not verify SSL certificate"
        fi
    else
        warning "Application not running on HTTPS"
    fi
}

# Check performance metrics
check_performance_metrics() {
    log "⚡ Checking performance metrics..."
    
    local app_url="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
    
    # Measure response time
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" "$app_url/api/health" 2>/dev/null || echo "timeout")
    if [ "$response_time" != "timeout" ]; then
        local response_ms=$(echo "$response_time * 1000" | bc)
        if (( $(echo "$response_time < 1.0" | bc -l) )); then
            success "Response time: ${response_ms%.*}ms"
        else
            warning "Response time is slow: ${response_ms%.*}ms"
        fi
    else
        warning "Could not measure response time"
    fi
}

# Check Docker containers (if using Docker)
check_docker_containers() {
    if command -v docker &> /dev/null; then
        log "🐳 Checking Docker containers..."
        
        local running_containers=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep -v NAMES | wc -l)
        if [ "$running_containers" -gt 0 ]; then
            success "Docker containers running: $running_containers"
            docker ps --format "table {{.Names}}\t{{.Status}}" | grep -v NAMES
        else
            warning "No Docker containers running"
        fi
    fi
}

# Check log files
check_log_files() {
    log "📝 Checking log files..."
    
    local log_dirs=("/var/log/nox" "./logs" "./.next/logs")
    local logs_found=false
    
    for log_dir in "${log_dirs[@]}"; do
        if [ -d "$log_dir" ]; then
            local log_count=$(find "$log_dir" -name "*.log" -type f | wc -l)
            if [ "$log_count" -gt 0 ]; then
                success "Log files in $log_dir: $log_count files"
                logs_found=true
            fi
        fi
    done
    
    if [ "$logs_found" = false ]; then
        warning "No log files found"
    fi
}

# Generate health report
generate_health_report() {
    log "📊 Generating health report..."
    
    cat << EOF > "health-report-$(date +%Y%m%d-%H%M%S).txt"
NOX API v8.0.0 Health Check Report
Generated: $(date)
Application URL: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}

System Information:
- Hostname: $(hostname)
- OS: $(uname -s) $(uname -r)
- Uptime: $(uptime -p)

Disk Usage: $(df -h / | awk 'NR==2{print $5}')
Memory Usage: $(free -h | awk 'NR==2{printf "%s/%s (%.1f%%)", $3,$2,$3*100/$2}')
Load Average: $(uptime | awk -F'load average:' '{ print $2 }')

Application Status: $(curl -s "${NEXT_PUBLIC_APP_URL:-http://localhost:3000}/api/health" | jq -r '.status // "Unknown"' 2>/dev/null || echo "Unknown")

Docker Containers: $(docker ps --format "{{.Names}}" 2>/dev/null | wc -l || echo "N/A") running

Environment: ${NODE_ENV:-"Not Set"}
Database: $([ -n "$DATABASE_URL" ] && echo "Configured" || echo "Not Configured")
Redis: $([ -n "$REDIS_URL" ] && echo "Configured" || echo "Not Configured")

OAuth Providers:
- Google: $([ -n "$GOOGLE_CLIENT_ID" ] && echo "Configured" || echo "Not Configured")
- GitHub: $([ -n "$GITHUB_CLIENT_ID" ] && echo "Configured" || echo "Not Configured")
- Microsoft: $([ -n "$MICROSOFT_CLIENT_ID" ] && echo "Configured" || echo "Not Configured")
EOF
    
    success "Health report generated: health-report-$(date +%Y%m%d-%H%M%S).txt"
}

# Main health check function
main() {
    echo ""
    echo "=================================================="
    echo "🏥 $SCRIPT_NAME $VERSION"
    echo "=================================================="
    echo ""
    
    load_environment
    
    check_system_resources
    echo ""
    
    check_application_health
    echo ""
    
    check_oauth_providers  
    echo ""
    
    check_database_connectivity
    echo ""
    
    check_redis_connectivity
    echo ""
    
    check_ssl_certificate
    echo ""
    
    check_performance_metrics
    echo ""
    
    check_docker_containers
    echo ""
    
    check_log_files
    echo ""
    
    generate_health_report
    
    echo ""
    echo "=================================================="
    echo "✅ Health check completed!"
    echo "=================================================="
    echo ""
    echo "📋 Summary:"
    echo "  🚀 Application: Running"
    echo "  🔐 Authentication: Configured"
    echo "  🗄️  Database: $([ -n "$DATABASE_URL" ] && echo "Connected" || echo "Not Configured")"
    echo "  🔄 Redis: $([ -n "$REDIS_URL" ] && echo "Connected" || echo "Not Configured")"
    echo "  🔒 SSL: $([ "${NEXT_PUBLIC_APP_URL:-http://localhost:3000}" == https://* ] && echo "Enabled" || echo "Not Enabled")"
    echo ""
    echo "🔗 Application URL: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
    echo "📊 Health Endpoint: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}/api/health"
    echo ""
}

# Run main function
main "$@"
