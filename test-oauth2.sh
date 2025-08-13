#!/bin/bash
# test-oauth2.sh - Test OAuth2 integration for Nox API

set -e

echo "🔐 Nox OAuth2 Integration Test Script"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
API_URL="http://localhost:8000"
DASHBOARD_URL="http://localhost:8501"

# Test functions
test_oauth2_endpoints() {
    log_info "Testing OAuth2 API endpoints..."
    
    # Test providers endpoint
    log_info "Testing /auth/oauth2/providers..."
    response=$(curl -s "$API_URL/auth/oauth2/providers" || echo "FAILED")
    
    if [[ "$response" == "FAILED" ]]; then
        log_error "Failed to connect to API"
        return 1
    fi
    
    # Check if response contains providers
    if echo "$response" | grep -q "providers"; then
        log_info "✓ Providers endpoint working"
        echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
    else
        log_warn "⚠ Providers endpoint returned unexpected response: $response"
    fi
    
    # Test OAuth2 status
    log_info "Testing /auth/oauth2/status..."
    status_response=$(curl -s "$API_URL/auth/oauth2/status" || echo "FAILED")
    
    if [[ "$status_response" == "FAILED" ]]; then
        log_error "Failed to get OAuth2 status"
        return 1
    fi
    
    if echo "$status_response" | grep -q "enabled"; then
        log_info "✓ OAuth2 status endpoint working"
        echo "$status_response" | python3 -m json.tool 2>/dev/null || echo "$status_response"
    else
        log_warn "⚠ OAuth2 status returned unexpected response: $status_response"
    fi
    
    # Test general auth status
    log_info "Testing /auth/status..."
    auth_status=$(curl -s "$API_URL/auth/status" || echo "FAILED")
    
    if [[ "$auth_status" != "FAILED" ]]; then
        log_info "✓ Auth status endpoint working"
        echo "$auth_status" | python3 -m json.tool 2>/dev/null || echo "$auth_status"
    else
        log_warn "⚠ Auth status endpoint not available"
    fi
}

test_oauth2_configuration() {
    log_info "Testing OAuth2 configuration..."
    
    # Check environment variables
    if [[ -z "$OAUTH_GOOGLE_CLIENT_ID" && -z "$OAUTH_GITHUB_CLIENT_ID" ]]; then
        log_warn "⚠ No OAuth2 providers configured in environment"
        log_info "To enable OAuth2, set these environment variables:"
        echo "  - OAUTH_GOOGLE_CLIENT_ID and OAUTH_GOOGLE_CLIENT_SECRET"
        echo "  - OAUTH_GITHUB_CLIENT_ID and OAUTH_GITHUB_CLIENT_SECRET"
        return 0
    fi
    
    # Test Google configuration
    if [[ -n "$OAUTH_GOOGLE_CLIENT_ID" ]]; then
        log_info "✓ Google OAuth2 client ID configured"
        if [[ -n "$OAUTH_GOOGLE_CLIENT_SECRET" ]]; then
            log_info "✓ Google OAuth2 client secret configured"
        else
            log_warn "⚠ Google OAuth2 client secret missing"
        fi
    fi
    
    # Test GitHub configuration
    if [[ -n "$OAUTH_GITHUB_CLIENT_ID" ]]; then
        log_info "✓ GitHub OAuth2 client ID configured"
        if [[ -n "$OAUTH_GITHUB_CLIENT_SECRET" ]]; then
            log_info "✓ GitHub OAuth2 client secret configured"
        else
            log_warn "⚠ GitHub OAuth2 client secret missing"
        fi
    fi
    
    # Test redirect URLs
    redirect_base=${OAUTH_REDIRECT_BASE_URL:-http://localhost:8000}
    success_url=${OAUTH_FRONTEND_SUCCESS_URL:-http://localhost:8501?auth=success}
    error_url=${OAUTH_FRONTEND_ERROR_URL:-http://localhost:8501?auth=error}
    
    log_info "OAuth2 URL configuration:"
    echo "  - Redirect base: $redirect_base"
    echo "  - Success URL: $success_url"
    echo "  - Error URL: $error_url"
}

test_oauth2_login_flow() {
    log_info "Testing OAuth2 login flow..."
    
    # Test login redirects (should return 307 redirects)
    for provider in google github; do
        log_info "Testing $provider login redirect..."
        
        response=$(curl -s -w "HTTP_CODE:%{http_code}" "$API_URL/auth/oauth2/$provider/login" || echo "FAILED")
        
        if [[ "$response" == "FAILED" ]]; then
            log_error "Failed to test $provider login"
            continue
        fi
        
        http_code=$(echo "$response" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
        
        case "$http_code" in
            307|302)
                log_info "✓ $provider login redirect working (HTTP $http_code)"
                ;;
            400)
                log_warn "⚠ $provider provider not enabled (HTTP $http_code)"
                ;;
            501)
                log_warn "⚠ OAuth2 not configured (HTTP $http_code)"
                ;;
            *)
                log_warn "⚠ $provider login returned unexpected status: $http_code"
                ;;
        esac
    done
}

test_dashboard_oauth2() {
    log_info "Testing dashboard OAuth2 integration..."
    
    # Check if dashboard files exist
    if [[ -f "dashboard/app_v24.py" ]]; then
        log_info "✓ Dashboard v2.4 with OAuth2 exists"
    else
        log_warn "⚠ Dashboard v2.4 not found"
        return 1
    fi
    
    if [[ -f "dashboard/oauth2_client.py" ]]; then
        log_info "✓ OAuth2 client module exists"
    else
        log_warn "⚠ OAuth2 client module not found"
        return 1
    fi
    
    # Test dashboard URL accessibility (if running)
    if curl -s "$DASHBOARD_URL" > /dev/null 2>&1; then
        log_info "✓ Dashboard is accessible at $DASHBOARD_URL"
    else
        log_warn "⚠ Dashboard not running or not accessible"
        log_info "Start dashboard with: streamlit run dashboard/app_v24.py --server.port 8501"
    fi
}

show_oauth2_urls() {
    log_info "OAuth2 URLs for provider configuration:"
    echo ""
    echo "Google OAuth2 Redirect URI:"
    echo "  ${OAUTH_REDIRECT_BASE_URL:-http://localhost:8000}/auth/oauth2/google/callback"
    echo ""
    echo "GitHub OAuth2 Callback URL:"
    echo "  ${OAUTH_REDIRECT_BASE_URL:-http://localhost:8000}/auth/oauth2/github/callback"
    echo ""
    echo "Dashboard URLs:"
    echo "  Success: ${OAUTH_FRONTEND_SUCCESS_URL:-http://localhost:8501?auth=success}"
    echo "  Error: ${OAUTH_FRONTEND_ERROR_URL:-http://localhost:8501?auth=error}"
}

show_setup_instructions() {
    log_info "OAuth2 Setup Instructions:"
    echo ""
    echo "1. Set up Google OAuth2 (optional):"
    echo "   - Go to: https://console.cloud.google.com/"
    echo "   - Create OAuth2 credentials"
    echo "   - Set redirect URI: http://localhost:8000/auth/oauth2/google/callback"
    echo "   - Export OAUTH_GOOGLE_CLIENT_ID and OAUTH_GOOGLE_CLIENT_SECRET"
    echo ""
    echo "2. Set up GitHub OAuth2 (optional):"
    echo "   - Go to: https://github.com/settings/developers"
    echo "   - Create new OAuth App"
    echo "   - Set callback URL: http://localhost:8000/auth/oauth2/github/callback"
    echo "   - Export OAUTH_GITHUB_CLIENT_ID and OAUTH_GITHUB_CLIENT_SECRET"
    echo ""
    echo "3. Test OAuth2 integration:"
    echo "   - Run: ./test-oauth2.sh"
    echo "   - Open dashboard: http://localhost:8501"
    echo "   - Try OAuth2 login tab"
}

# Main execution
main() {
    case "${1:-test}" in
        "test")
            test_oauth2_configuration
            echo ""
            test_oauth2_endpoints
            echo ""
            test_oauth2_login_flow
            echo ""
            test_dashboard_oauth2
            echo ""
            log_info "🎉 OAuth2 integration test completed!"
            ;;
        "urls")
            show_oauth2_urls
            ;;
        "setup")
            show_setup_instructions
            ;;
        "endpoints")
            test_oauth2_endpoints
            ;;
        "config")
            test_oauth2_configuration
            ;;
        *)
            echo "Usage: $0 [test|urls|setup|endpoints|config]"
            echo "  test      - Run all OAuth2 tests (default)"
            echo "  urls      - Show OAuth2 URLs for provider setup"
            echo "  setup     - Show OAuth2 setup instructions"
            echo "  endpoints - Test API endpoints only"
            echo "  config    - Test configuration only"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
