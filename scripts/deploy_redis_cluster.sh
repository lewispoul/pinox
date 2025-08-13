#!/bin/bash

# Nox API v8.0.0 - Redis Cluster Deployment Script
# Deploy and initialize Redis Cluster with Sentinel high availability

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Configuration
REDIS_CLUSTER_FILE="${PROJECT_ROOT}/redis-cluster.yml"
REDIS_CONFIG_DIR="${PROJECT_ROOT}/config/redis"

echo -e "${BLUE}🚀 Nox API v8.0.0 - Redis Cluster Deployment${NC}"
echo "=================================================="

# Function to check if Docker and Docker Compose are available
check_dependencies() {
    echo -e "${YELLOW}📋 Checking dependencies...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed or not in PATH${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}❌ Docker Compose is not installed or not in PATH${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Dependencies check passed${NC}"
}

# Function to verify Redis Cluster configuration files exist
check_config_files() {
    echo -e "${YELLOW}📂 Checking configuration files...${NC}"
    
    if [[ ! -f "$REDIS_CLUSTER_FILE" ]]; then
        echo -e "${RED}❌ Redis Cluster configuration file not found: $REDIS_CLUSTER_FILE${NC}"
        exit 1
    fi
    
    if [[ ! -d "$REDIS_CONFIG_DIR" ]]; then
        echo -e "${RED}❌ Redis configuration directory not found: $REDIS_CONFIG_DIR${NC}"
        exit 1
    fi
    
    # Check Sentinel configuration files
    for i in 1 2 3; do
        if [[ ! -f "$REDIS_CONFIG_DIR/sentinel${i}.conf" ]]; then
            echo -e "${RED}❌ Sentinel configuration file not found: sentinel${i}.conf${NC}"
            exit 1
        fi
    done
    
    echo -e "${GREEN}✅ Configuration files check passed${NC}"
}

# Function to create Docker network if it doesn't exist
create_network() {
    echo -e "${YELLOW}🔗 Setting up Docker network...${NC}"
    
    NETWORK_NAME="nox-cluster-network"
    
    if ! docker network ls | grep -q "$NETWORK_NAME"; then
        docker network create "$NETWORK_NAME" --driver bridge
        echo -e "${GREEN}✅ Docker network '$NETWORK_NAME' created${NC}"
    else
        echo -e "${GREEN}✅ Docker network '$NETWORK_NAME' already exists${NC}"
    fi
}

# Function to deploy Redis Cluster
deploy_cluster() {
    echo -e "${YELLOW}🐳 Deploying Redis Cluster...${NC}"
    
    cd "$PROJECT_ROOT"
    
    # Use docker-compose or docker compose based on availability
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    else
        COMPOSE_CMD="docker compose"
    fi
    
    # Pull latest images
    echo "📥 Pulling Redis images..."
    $COMPOSE_CMD -f redis-cluster.yml pull
    
    # Deploy the cluster
    echo "🚀 Starting Redis Cluster services..."
    $COMPOSE_CMD -f redis-cluster.yml up -d
    
    echo -e "${GREEN}✅ Redis Cluster services started${NC}"
}

# Function to wait for Redis nodes to be ready
wait_for_nodes() {
    echo -e "${YELLOW}⏳ Waiting for Redis nodes to be ready...${NC}"
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        echo "Attempt $attempt/$max_attempts - Checking Redis nodes..."
        
        local nodes_ready=0
        
        # Check each Redis node container directly
        if docker exec nox-redis-node1 redis-cli -p 6379 ping 2>/dev/null | grep -q "PONG"; then
            ((nodes_ready++))
        fi
        
        if docker exec nox-redis-node2 redis-cli -p 6379 ping 2>/dev/null | grep -q "PONG"; then
            ((nodes_ready++))
        fi
        
        if docker exec nox-redis-node3 redis-cli -p 6379 ping 2>/dev/null | grep -q "PONG"; then
            ((nodes_ready++))
        fi
        
        if [[ $nodes_ready -ge 3 ]]; then
            echo -e "${GREEN}✅ Redis nodes are ready${NC}"
            return 0
        fi
        
        echo "Waiting... ($nodes_ready/3 nodes ready)"
        sleep 3
        ((attempt++))
    done
    
    echo -e "${RED}❌ Timeout waiting for Redis nodes to be ready${NC}"
    return 1
}

# Function to initialize Redis Cluster
initialize_cluster() {
    echo -e "${YELLOW}🔧 Initializing Redis Cluster...${NC}"
    
    # Check if cluster is already initialized
    if docker exec nox-redis-node1 redis-cli -p 6379 cluster nodes 2>/dev/null | grep -q "master"; then
        echo -e "${GREEN}✅ Redis Cluster is already initialized${NC}"
        return 0
    fi
    
    # Initialize the cluster
    echo "🔗 Creating Redis Cluster..."
    
    # Create cluster with replicas
    docker exec nox-redis-node1 redis-cli --cluster create \
        nox-redis-node1:6379 \
        nox-redis-node2:6379 \
        nox-redis-node3:6379 \
        --cluster-replicas 0 \
        --cluster-yes || {
        echo -e "${RED}❌ Failed to create Redis Cluster${NC}"
        return 1
    }
    
    echo -e "${GREEN}✅ Redis Cluster initialized successfully${NC}"
}

# Function to verify cluster status
verify_cluster() {
    echo -e "${YELLOW}🔍 Verifying cluster status...${NC}"
    
    # Check cluster info
    echo "📊 Cluster Info:"
    docker exec nox-redis-node1 redis-cli -p 6379 cluster info
    
    echo ""
    echo "📋 Cluster Nodes:"
    docker exec nox-redis-node1 redis-cli -p 6379 cluster nodes
    
    echo ""
    echo "🔍 Testing cluster operations..."
    
    # Test set/get operations
    docker exec nox-redis-node1 redis-cli -p 6379 set test-key "cluster-test-value" >/dev/null
    local retrieved_value=$(docker exec nox-redis-node1 redis-cli -p 6379 get test-key)
    
    if [[ "$retrieved_value" == "cluster-test-value" ]]; then
        echo -e "${GREEN}✅ Cluster operations test passed${NC}"
    else
        echo -e "${RED}❌ Cluster operations test failed${NC}"
        return 1
    fi
    
    # Clean up test key
    docker exec nox-redis-node1 redis-cli -p 6379 del test-key >/dev/null
}

# Function to check Sentinel status
check_sentinel() {
    echo -e "${YELLOW}🛡️ Checking Redis Sentinel status...${NC}"
    
    for i in 1 2 3; do
        echo "📊 Sentinel $i status:"
        if docker exec redis-sentinel$i redis-cli -p $((26378 + i)) sentinel masters 2>/dev/null; then
            echo -e "${GREEN}✅ Sentinel $i is running${NC}"
        else
            echo -e "${RED}❌ Sentinel $i is not responding${NC}"
        fi
    done
}

# Function to display connection information
display_connection_info() {
    echo -e "${BLUE}🔌 Redis Cluster Connection Information${NC}"
    echo "========================================="
    
    echo "📍 Redis Cluster Nodes:"
    echo "  - Node 1: localhost:7001"
    echo "  - Node 2: localhost:7002"
    echo "  - Node 3: localhost:7003"
    echo "  - Replica 1: localhost:7004"
    echo "  - Replica 2: localhost:7005"
    echo "  - Replica 3: localhost:7006"
    
    echo ""
    echo "🛡️ Redis Sentinel:"
    echo "  - Sentinel 1: localhost:26379"
    echo "  - Sentinel 2: localhost:26380"
    echo "  - Sentinel 3: localhost:26381"
    
    echo ""
    echo "🎯 Redis Commander (Web UI):"
    echo "  - URL: http://localhost:8081"
    
    echo ""
    echo "🔧 Connection Examples:"
    echo "  Python: RedisCluster(startup_nodes=[{'host': 'localhost', 'port': 7001}, ...])"
    echo "  Node.js: new Redis.Cluster([{port: 7001, host: 'localhost'}, ...])"
    echo "  CLI: redis-cli -c -p 7001"
}

# Function to show cluster logs
show_logs() {
    echo -e "${YELLOW}📝 Showing Redis Cluster logs...${NC}"
    cd "$PROJECT_ROOT"
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f redis-cluster.yml logs --tail=50
    else
        docker compose -f redis-cluster.yml logs --tail=50
    fi
}

# Function to stop and clean up cluster
cleanup_cluster() {
    echo -e "${YELLOW}🧹 Cleaning up Redis Cluster...${NC}"
    cd "$PROJECT_ROOT"
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f redis-cluster.yml down -v
    else
        docker compose -f redis-cluster.yml down -v
    fi
    
    echo -e "${GREEN}✅ Redis Cluster cleaned up${NC}"
}

# Main deployment function
main() {
    # Handle special arguments
    if [[ "$1" == "--logs" ]]; then
        show_logs "$1"
        return 0
    fi
    
    if [[ "$1" == "--cleanup" ]]; then
        cleanup_cluster "$1"
        return 0
    fi
    
    echo "Starting Redis Cluster deployment process..."
    echo ""
    
    # Run deployment steps
    check_dependencies
    check_config_files
    create_network
    deploy_cluster
    
    echo ""
    echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
    sleep 5
    
    wait_for_nodes
    initialize_cluster
    
    echo ""
    verify_cluster
    check_sentinel
    
    echo ""
    display_connection_info
    
    echo ""
    echo -e "${GREEN}🎉 Redis Cluster deployment completed successfully!${NC}"
    echo ""
    echo "📚 Available commands:"
    echo "  $0 --logs     Show cluster logs"
    echo "  $0 --cleanup  Stop and clean up cluster"
    echo ""
    echo -e "${BLUE}💡 Next steps:${NC}"
    echo "  1. Update your application configuration to use the cluster endpoints"
    echo "  2. Test distributed session management with the new cluster"
    echo "  3. Monitor cluster health through Redis Commander at http://localhost:8081"
}

# Run main function with all arguments
main "$@"
