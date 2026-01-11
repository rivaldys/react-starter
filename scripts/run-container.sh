#!/bin/bash

# =============================================================================
# Docker Container Run Script for React Starter
# =============================================================================
# This script runs a Docker container for the React Starter application.
#
# Usage:
#   ./scripts/run-container.sh [options]
#
# Options:
#   --name, -n      Container name (default: react-starter-app)
#   --tag, -t       Image tag (default: react-starter:latest)
#   --port, -p      Host port (default: 3000)
#   --env, -e       Environment file (default: .env)
#   --detach, -d    Run in detached mode
#   --rm            Remove container when stopped
#   --help, -h      Show this help message
#
# Examples:
#   ./scripts/run-container.sh
#   ./scripts/run-container.sh --port 8080 --detach
#   ./scripts/run-container.sh --name myapp --tag myapp:v1.0.0
# =============================================================================

set -e

# Default values
CONTAINER_NAME="react-starter-app"
IMAGE_TAG="react-starter:latest"
HOST_PORT="3000"
CONTAINER_PORT="3000"
ENV_FILE=".env"
DETACH=""
REMOVE=""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored message
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Show help message
show_help() {
    head -27 "$0" | tail -22
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --name|-n)
            CONTAINER_NAME="$2"
            shift 2
            ;;
        --tag|-t)
            IMAGE_TAG="$2"
            shift 2
            ;;
        --port|-p)
            HOST_PORT="$2"
            shift 2
            ;;
        --env|-e)
            ENV_FILE="$2"
            shift 2
            ;;
        --detach|-d)
            DETACH="-d"
            shift
            ;;
        --rm)
            REMOVE="--rm"
            shift
            ;;
        --help|-h)
            show_help
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            ;;
    esac
done

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if image exists
if ! docker image inspect "$IMAGE_TAG" &> /dev/null; then
    print_error "Image '$IMAGE_TAG' not found. Build it first with: pnpm build:image"
    exit 1
fi

# Check if container with same name is already running
if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
    print_warning "Container '$CONTAINER_NAME' is already running."
    read -p "Do you want to stop and remove it? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Stopping and removing existing container..."
        docker stop "$CONTAINER_NAME" > /dev/null
        docker rm "$CONTAINER_NAME" > /dev/null
    else
        print_info "Aborted."
        exit 0
    fi
fi

# Check if container exists but stopped
if docker ps -aq -f name="$CONTAINER_NAME" | grep -q .; then
    print_info "Removing stopped container '$CONTAINER_NAME'..."
    docker rm "$CONTAINER_NAME" > /dev/null
fi

# Build docker run command
DOCKER_CMD="docker run"

# Add optional flags
[[ -n "$DETACH" ]] && DOCKER_CMD="$DOCKER_CMD $DETACH"
[[ -n "$REMOVE" ]] && DOCKER_CMD="$DOCKER_CMD $REMOVE"

# Add port mapping
DOCKER_CMD="$DOCKER_CMD -p $HOST_PORT:$CONTAINER_PORT"

# Add environment file if exists
if [[ -f "$ENV_FILE" ]]; then
    DOCKER_CMD="$DOCKER_CMD --env-file $ENV_FILE"
    print_info "Using environment file: $ENV_FILE"
else
    print_warning "Environment file '$ENV_FILE' not found. Running without it."
fi

# Add container name and image
DOCKER_CMD="$DOCKER_CMD --name $CONTAINER_NAME $IMAGE_TAG"

print_info "Starting container..."
print_info "  Name: $CONTAINER_NAME"
print_info "  Image: $IMAGE_TAG"
print_info "  Port: $HOST_PORT:$CONTAINER_PORT"

# Run the container
eval $DOCKER_CMD

if [[ $? -eq 0 ]]; then
    if [[ -n "$DETACH" ]]; then
        print_success "Container started in background!"
        print_info "View logs: docker logs -f $CONTAINER_NAME"
        print_info "Stop container: docker stop $CONTAINER_NAME"
    else
        print_success "Container stopped."
    fi
    print_info "Access app at: http://localhost:$HOST_PORT"
else
    print_error "Failed to start container."
    exit 1
fi
