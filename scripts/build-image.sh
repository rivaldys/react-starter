#!/bin/bash

# =============================================================================
# Docker Image Build Script for React Starter
# =============================================================================
# This script builds a Docker image for the React Starter application.
# It supports both SSR and CSR modes.
#
# Usage:
#   ./scripts/build-image.sh [options]
#
# Options:
#   --tag, -t       Image tag (default: react-starter:latest)
#   --mode, -m      Build mode: ssr or csr (default: csr)
#   --no-cache      Build without cache
#   --help, -h      Show this help message
#
# Examples:
#   ./scripts/build-image.sh
#   ./scripts/build-image.sh --tag myapp:v1.0.0
#   ./scripts/build-image.sh --mode csr --tag myapp:csr
# =============================================================================

set -e

# Default values
IMAGE_TAG="react-starter:latest"
BUILD_MODE="csr"
NO_CACHE=""
DOCKER_DIR="deploy"

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
    head -25 "$0" | tail -20
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --tag|-t)
            IMAGE_TAG="$2"
            shift 2
            ;;
        --mode|-m)
            BUILD_MODE="$2"
            shift 2
            ;;
        --no-cache)
            NO_CACHE="--no-cache"
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

# Validate build mode
if [[ "$BUILD_MODE" != "ssr" && "$BUILD_MODE" != "csr" ]]; then
    print_error "Invalid build mode: $BUILD_MODE. Use 'ssr' or 'csr'."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Dockerfile exists
if [[ ! -f "$DOCKER_DIR/Dockerfile" ]]; then
    print_error "Dockerfile not found in $DOCKER_DIR directory."
    exit 1
fi

print_info "Building Docker image..."
print_info "  Tag: $IMAGE_TAG"
print_info "  Mode: $BUILD_MODE"
print_info "  Docker context: $DOCKER_DIR"

# Build the image (context is root, dockerfile in docker folder)
docker build \
    $NO_CACHE \
    --build-arg BUILD_MODE="$BUILD_MODE" \
    -f "$DOCKER_DIR/Dockerfile" \
    -t "$IMAGE_TAG" \
    .

if [[ $? -eq 0 ]]; then
    print_success "Docker image built successfully!"
    print_info "Run with: docker run -p 3000:3000 $IMAGE_TAG"
else
    print_error "Failed to build Docker image."
    exit 1
fi
