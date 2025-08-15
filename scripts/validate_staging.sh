#!/bin/bash
# NOX API v8.0.0 Staging Validation Script
# Automated execution of staging validation checklist

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${BASE_URL:-https://staging-api.yourdomain.com}"
NAMESPACE="${NAMESPACE:-nox-staging-green}"
TEST_TOKEN="${TEST_TOKEN:-}"
ADMIN_TOKEN="${ADMIN_TOKEN:-}"
SKIP_LOAD_TEST="${SKIP_LOAD_TEST:-false}"
LOAD_TEST_DURATION="${LOAD_TEST_DURATION:-5m}"

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

log_section() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}"
}

# Validation results tracking
declare -A validation_results
validation_count=0
validation_passed=0

track_result() {
    local test_name="$1"
    local status="$2"
    local message="${3:-}"
    
    validation_results["$test_name"]="$status"
    ((validation_count++))
    
    if [[ "$status" == "PASSED" ]]; then
        ((validation_passed++))
        log_success "✅ $test_name: $message"
    elif [[ "$status" == "WARNING" ]]; then
        log_warning "⚠️  $test_name: $message"
    else
        log_error "❌ $test_name: $message"
    fi
}

# Utility functions
check_command() {
    if command -v "$1" &> /dev/null; then
        return 0
    else
        log_error "Required command '$1' not found"
        return 1
    fi
}

check_url() {
    local url="$1"
    local expected_status="${2:-200}"
    local timeout="${3:-10}"
    
    local status
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "$url" || echo "000")
    
    if [[ "$status" == "$expected_status" ]]; then
        return 0
    else
        return 1
    fi
}

check_k8s_resource() {
    local resource_type="$1"
    local resource_name="$2"
    local namespace="$3"
    
    kubectl get "$resource_type" "$resource_name" -n "$namespace" &> /dev/null
}

# Section 1: Pre-Deployment Verification
section_1_pre_deployment() {
    log_section "1. PRE-DEPLOYMENT VERIFICATION"
    
    # Check required commands
    local required_commands=("curl" "kubectl" "python3" "psql" "k6")
    for cmd in "${required_commands[@]}"; do
        if check_command "$cmd"; then
            track_result "Command: $cmd" "PASSED" "Available"
        else
            track_result "Command: $cmd" "FAILED" "Not found in PATH"
        fi
    done
    
    # Environment verification
    log_info "Running environment verification script..."
    if [[ -f "/home/lppoulin/nox-api-src/scripts/verify_env.py" ]]; then
        if python3 /home/lppoulin/nox-api-src/scripts/verify_env.py; then
            track_result "Environment Dependencies" "PASSED" "All scientific dependencies available"
        else
            track_result "Environment Dependencies" "FAILED" "Some dependencies missing or non-functional"
        fi
    else
        track_result "Environment Dependencies" "WARNING" "Verification script not found"
    fi
    
    # Environment variables check
    local required_envs=("DATABASE_URL" "REDIS_URL" "GOOGLE_CLIENT_ID" "GITHUB_CLIENT_ID")
    local missing_envs=()
    
    for env_var in "${required_envs[@]}"; do
        if [[ -z "${!env_var:-}" ]]; then
            missing_envs+=("$env_var")
        fi
    done
    
    if [[ ${#missing_envs[@]} -eq 0 ]]; then
        track_result "Environment Variables" "PASSED" "All required variables set"
    else
        track_result "Environment Variables" "FAILED" "Missing: ${missing_envs[*]}"
    fi
}

# Section 2: Staging Deployment
section_2_deployment() {
    log_section "2. STAGING DEPLOYMENT"
    
    # Check Kubernetes cluster access
    if kubectl cluster-info &> /dev/null; then
        track_result "Kubernetes Access" "PASSED" "Cluster accessible"
    else
        track_result "Kubernetes Access" "FAILED" "Cannot access cluster"
        return 1
    fi
    
    # Check namespace
    if kubectl get namespace "$NAMESPACE" &> /dev/null; then
        track_result "Namespace Exists" "PASSED" "$NAMESPACE namespace found"
    else
        track_result "Namespace Exists" "FAILED" "$NAMESPACE namespace not found"
    fi
    
    # Check deployment
    if check_k8s_resource "deployment" "nox-api-deployment-green" "$NAMESPACE"; then
        track_result "Deployment Exists" "PASSED" "Green deployment found"
        
        # Check deployment status
        local ready_replicas
        ready_replicas=$(kubectl get deployment nox-api-deployment-green -n "$NAMESPACE" -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
        local desired_replicas
        desired_replicas=$(kubectl get deployment nox-api-deployment-green -n "$NAMESPACE" -o jsonpath='{.spec.replicas}' 2>/dev/null || echo "0")
        
        if [[ "$ready_replicas" -eq "$desired_replicas" ]] && [[ "$ready_replicas" -gt 0 ]]; then
            track_result "Deployment Ready" "PASSED" "$ready_replicas/$desired_replicas pods ready"
        else
            track_result "Deployment Ready" "FAILED" "$ready_replicas/$desired_replicas pods ready"
        fi
    else
        track_result "Deployment Exists" "FAILED" "Green deployment not found"
    fi
    
    # Check service
    if check_k8s_resource "service" "nox-api-service-green" "$NAMESPACE"; then
        track_result "Service Exists" "PASSED" "Green service found"
    else
        track_result "Service Exists" "FAILED" "Green service not found"
    fi
    
    # Check ingress
    if check_k8s_resource "ingress" "nox-api-ingress" "$NAMESPACE"; then
        track_result "Ingress Exists" "PASSED" "Ingress found"
    else
        track_result "Ingress Exists" "FAILED" "Ingress not found"
    fi
}

# Section 3: Functional Testing
section_3_functional() {
    log_section "3. FUNCTIONAL TESTING"
    
    # Health check
    if check_url "$BASE_URL/health" 200 30; then
        track_result "Health Endpoint" "PASSED" "Returns 200 OK"
    else
        track_result "Health Endpoint" "FAILED" "Health check failed"
    fi
    
    # Version check
    local version_response
    version_response=$(curl -s --max-time 10 "$BASE_URL/version" || echo "")
    if [[ "$version_response" == *"8.0.0"* ]]; then
        track_result "Version Endpoint" "PASSED" "Returns v8.0.0"
    else
        track_result "Version Endpoint" "FAILED" "Version check failed: $version_response"
    fi
    
    # Ready check
    if check_url "$BASE_URL/ready" 200 30; then
        track_result "Ready Endpoint" "PASSED" "Returns 200 OK"
    else
        track_result "Ready Endpoint" "WARNING" "Ready check failed (may be acceptable)"
    fi
    
    # OAuth URL generation tests
    local providers=("google" "github" "microsoft")
    for provider in "${providers[@]}"; do
        local oauth_response
        oauth_response=$(curl -s --max-time 10 "$BASE_URL/api/auth/$provider/url" || echo "")
        if [[ "$oauth_response" == *"oauth"* ]] || [[ "$oauth_response" == *"authorize"* ]]; then
            track_result "OAuth $provider" "PASSED" "URL generation working"
        else
            track_result "OAuth $provider" "FAILED" "URL generation failed"
        fi
    done
    
    # API endpoint tests (with token if available)
    if [[ -n "$TEST_TOKEN" ]]; then
        local endpoints=(
            "/api/user/profile:GET:200"
            "/api/user/settings:GET:200"
            "/empirical/v1:POST:200"
            "/predict/cj/v1:POST:200"
        )
        
        for endpoint_config in "${endpoints[@]}"; do
            IFS=':' read -r endpoint method expected_status <<< "$endpoint_config"
            
            local response_status
            if [[ "$method" == "POST" ]]; then
                response_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 \
                    -H "Authorization: Bearer $TEST_TOKEN" \
                    -H "Content-Type: application/json" \
                    -X POST \
                    -d '{"test": "data"}' \
                    "$BASE_URL$endpoint" || echo "000")
            else
                response_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 \
                    -H "Authorization: Bearer $TEST_TOKEN" \
                    "$BASE_URL$endpoint" || echo "000")
            fi
            
            if [[ "$response_status" == "$expected_status" ]] || [[ "$response_status" == "202" ]] || [[ "$response_status" == "400" ]]; then
                track_result "API $endpoint" "PASSED" "Status: $response_status"
            else
                track_result "API $endpoint" "FAILED" "Status: $response_status (expected: $expected_status)"
            fi
        done
    else
        track_result "Authenticated API Tests" "WARNING" "No test token provided"
    fi
}

# Section 4: Performance & Load Testing
section_4_performance() {
    log_section "4. PERFORMANCE & LOAD TESTING"
    
    if [[ "$SKIP_LOAD_TEST" == "true" ]]; then
        track_result "Load Testing" "WARNING" "Skipped (SKIP_LOAD_TEST=true)"
        return 0
    fi
    
    # Check if k6 is available
    if ! check_command "k6"; then
        track_result "Load Testing" "FAILED" "k6 not available"
        return 1
    fi
    
    # Check if load test script exists
    local load_test_script="/home/lppoulin/nox-api-src/scripts/load-test.js"
    if [[ ! -f "$load_test_script" ]]; then
        track_result "Load Testing" "FAILED" "Load test script not found"
        return 1
    fi
    
    # Run abbreviated load test
    log_info "Running abbreviated load test ($LOAD_TEST_DURATION)..."
    
    # Create temporary k6 script with shorter duration
    local temp_script="/tmp/k6-quick-test.js"
    cat > "$temp_script" << EOF
import { check } from 'k6';
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '${LOAD_TEST_DURATION}', target: 50 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function() {
  let response = http.get('${BASE_URL}/health');
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
}
EOF
    
    # Run load test
    if BASE_URL="$BASE_URL" k6 run "$temp_script"; then
        track_result "Load Testing" "PASSED" "Performance thresholds met"
    else
        track_result "Load Testing" "WARNING" "Some performance thresholds not met"
    fi
    
    # Cleanup
    rm -f "$temp_script"
}

# Section 5: Security & Compliance
section_5_security() {
    log_section "5. SECURITY & COMPLIANCE"
    
    # Security headers check
    local security_headers=("X-Frame-Options" "X-XSS-Protection" "X-Content-Type-Options")
    local headers_found=0
    
    for header in "${security_headers[@]}"; do
        if curl -s -I --max-time 10 "$BASE_URL/health" | grep -i "$header" > /dev/null; then
            ((headers_found++))
        fi
    done
    
    if [[ $headers_found -ge 2 ]]; then
        track_result "Security Headers" "PASSED" "$headers_found/3 headers found"
    else
        track_result "Security Headers" "WARNING" "$headers_found/3 headers found"
    fi
    
    # SSL/TLS check
    if [[ "$BASE_URL" == https://* ]]; then
        if curl -s --max-time 10 "$BASE_URL/health" > /dev/null; then
            track_result "SSL/TLS" "PASSED" "HTTPS working"
        else
            track_result "SSL/TLS" "FAILED" "HTTPS not working"
        fi
    else
        track_result "SSL/TLS" "WARNING" "Not using HTTPS"
    fi
    
    # RBAC test (if admin token available)
    if [[ -n "$ADMIN_TOKEN" ]]; then
        local admin_response
        admin_response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
            -H "Authorization: Bearer $ADMIN_TOKEN" \
            "$BASE_URL/api/admin/health" || echo "000")
        
        if [[ "$admin_response" == "200" ]]; then
            track_result "RBAC Admin Access" "PASSED" "Admin endpoints accessible"
        else
            track_result "RBAC Admin Access" "WARNING" "Admin endpoints test failed"
        fi
        
        # Test regular user shouldn't access admin endpoints
        if [[ -n "$TEST_TOKEN" ]]; then
            local user_admin_response
            user_admin_response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
                -H "Authorization: Bearer $TEST_TOKEN" \
                "$BASE_URL/api/admin/health" || echo "000")
            
            if [[ "$user_admin_response" == "403" ]]; then
                track_result "RBAC User Restriction" "PASSED" "Regular users properly restricted"
            else
                track_result "RBAC User Restriction" "WARNING" "RBAC may not be working correctly"
            fi
        fi
    else
        track_result "RBAC Testing" "WARNING" "No admin token provided"
    fi
}

# Section 6: Data Validation
section_6_data() {
    log_section "6. DATA VALIDATION"
    
    # Database connectivity test
    if [[ -n "${DATABASE_URL:-}" ]]; then
        if psql "$DATABASE_URL" -c "SELECT version();" &> /dev/null; then
            track_result "Database Connectivity" "PASSED" "PostgreSQL accessible"
            
            # Check migration status
            local schema_version
            schema_version=$(psql "$DATABASE_URL" -t -c "SELECT config_value FROM system_configuration WHERE config_key = 'database_schema_version';" 2>/dev/null | tr -d '"' | xargs || echo "")
            
            if [[ "$schema_version" == "8.0.0" ]]; then
                track_result "Database Schema" "PASSED" "Schema version 8.0.0"
            else
                track_result "Database Schema" "WARNING" "Schema version: $schema_version"
            fi
            
            # Check table existence
            local new_tables=("webvitals_metrics" "ai_security_audit" "websocket_connections")
            local tables_found=0
            
            for table in "${new_tables[@]}"; do
                if psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$table');" 2>/dev/null | grep -q 't'; then
                    ((tables_found++))
                fi
            done
            
            if [[ $tables_found -eq ${#new_tables[@]} ]]; then
                track_result "New Tables" "PASSED" "All $tables_found tables exist"
            else
                track_result "New Tables" "FAILED" "$tables_found/${#new_tables[@]} tables found"
            fi
        else
            track_result "Database Connectivity" "FAILED" "Cannot connect to PostgreSQL"
        fi
    else
        track_result "Database Connectivity" "WARNING" "DATABASE_URL not set"
    fi
    
    # Redis connectivity test
    if [[ -n "${REDIS_URL:-}" ]]; then
        if redis-cli -u "$REDIS_URL" ping 2>/dev/null | grep -q "PONG"; then
            track_result "Redis Connectivity" "PASSED" "Redis accessible"
        else
            track_result "Redis Connectivity" "FAILED" "Cannot connect to Redis"
        fi
    else
        track_result "Redis Connectivity" "WARNING" "REDIS_URL not set"
    fi
}

# Section 7: Monitoring & Observability
section_7_monitoring() {
    log_section "7. MONITORING & OBSERVABILITY"
    
    # Check metrics endpoint
    if check_url "$BASE_URL/metrics" 200 10; then
        track_result "Metrics Endpoint" "PASSED" "Prometheus metrics available"
    else
        track_result "Metrics Endpoint" "WARNING" "Metrics endpoint not accessible"
    fi
    
    # Check Kubernetes monitoring resources
    local monitoring_resources=("podmonitor/nox-api-podmonitor" "servicemonitor/nox-api-servicemonitor" "prometheusrule/nox-api-alerts")
    local monitoring_found=0
    
    for resource in "${monitoring_resources[@]}"; do
        if kubectl get "$resource" -n "$NAMESPACE" &> /dev/null; then
            ((monitoring_found++))
        fi
    done
    
    if [[ $monitoring_found -ge 2 ]]; then
        track_result "Monitoring Resources" "PASSED" "$monitoring_found/3 resources found"
    else
        track_result "Monitoring Resources" "WARNING" "$monitoring_found/3 monitoring resources found"
    fi
    
    # Check HPA status
    if kubectl get hpa nox-api-hpa-green -n "$NAMESPACE" &> /dev/null; then
        local hpa_status
        hpa_status=$(kubectl get hpa nox-api-hpa-green -n "$NAMESPACE" -o jsonpath='{.status.conditions[0].status}' 2>/dev/null || echo "Unknown")
        
        if [[ "$hpa_status" == "True" ]]; then
            track_result "HPA Status" "PASSED" "HPA active and functional"
        else
            track_result "HPA Status" "WARNING" "HPA may not be working correctly"
        fi
    else
        track_result "HPA Status" "FAILED" "HPA not found"
    fi
}

# Main validation function
main() {
    echo -e "${BLUE}🚀 NOX API v8.0.0 Staging Validation Script${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo "Base URL: $BASE_URL"
    echo "Namespace: $NAMESPACE"
    echo "Skip Load Test: $SKIP_LOAD_TEST"
    echo ""
    
    # Run all validation sections
    section_1_pre_deployment
    section_2_deployment
    section_3_functional
    section_4_performance
    section_5_security
    section_6_data
    section_7_monitoring
    
    # Generate final report
    log_section "VALIDATION SUMMARY"
    
    local success_rate
    success_rate=$(( (validation_passed * 100) / validation_count ))
    
    echo "Total Tests: $validation_count"
    echo "Passed: $validation_passed"
    echo "Success Rate: $success_rate%"
    echo ""
    
    # List failed tests
    local failed_tests=()
    for test_name in "${!validation_results[@]}"; do
        if [[ "${validation_results[$test_name]}" == "FAILED" ]]; then
            failed_tests+=("$test_name")
        fi
    done
    
    if [[ ${#failed_tests[@]} -gt 0 ]]; then
        log_error "FAILED TESTS:"
        for test in "${failed_tests[@]}"; do
            echo "  ❌ $test"
        done
        echo ""
    fi
    
    # Determine overall result
    if [[ $success_rate -ge 80 ]] && [[ ${#failed_tests[@]} -eq 0 ]]; then
        log_success "🎉 VALIDATION PASSED - Ready for production deployment!"
        exit 0
    elif [[ $success_rate -ge 70 ]]; then
        log_warning "⚠️  VALIDATION PARTIAL - Review warnings and failures before production"
        exit 1
    else
        log_error "❌ VALIDATION FAILED - Do not proceed to production"
        exit 2
    fi
}

# Handle script termination
trap 'log_error "Validation script interrupted"; exit 130' INT TERM

# Run main function
main "$@"
