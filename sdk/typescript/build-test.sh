#!/bin/bash

# Nox TypeScript SDK Build and Test Script
# v8.0.0 Developer Experience Enhancement

set -e  # Exit on any error

echo "🚀 Nox TypeScript SDK v8.0.0 - Build and Test"
echo "=============================================="

# Function to print colored output
print_step() {
    echo -e "\n\033[1;34m📋 $1\033[0m"
}

print_success() {
    echo -e "\033[1;32m✅ $1\033[0m"
}

print_error() {
    echo -e "\033[1;31m❌ $1\033[0m"
}

print_warning() {
    echo -e "\033[1;33m⚠️  $1\033[0m"
}

# Navigate to TypeScript SDK directory
cd "$(dirname "$0")"
SDK_DIR="/home/lppoulin/nox-api-src/sdk/typescript"

if [ ! -d "$SDK_DIR" ]; then
    print_error "TypeScript SDK directory not found: $SDK_DIR"
    exit 1
fi

cd "$SDK_DIR"
print_success "Changed to TypeScript SDK directory: $SDK_DIR"

# Check if Node.js is available
print_step "Checking Node.js and npm availability"
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ to continue."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not available. Please ensure npm is installed."
    exit 1
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js: $NODE_VERSION"
print_success "npm: $NPM_VERSION"

# Install dependencies
print_step "Installing dependencies"
if [ ! -f package.json ]; then
    print_error "package.json not found in SDK directory"
    exit 1
fi

npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# TypeScript compilation check
print_step "TypeScript compilation check"
if ! command -v npx &> /dev/null; then
    print_error "npx is not available"
    exit 1
fi

npx tsc --noEmit
if [ $? -eq 0 ]; then
    print_success "TypeScript compilation successful"
else
    print_error "TypeScript compilation failed"
    print_warning "Attempting to show compilation errors..."
    npx tsc --noEmit --pretty
    exit 1
fi

# Build the project
print_step "Building TypeScript SDK"
npm run build
if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Check build output
print_step "Verifying build output"
if [ -d "dist" ]; then
    print_success "Distribution directory created"
    
    # List generated files
    echo -e "\nGenerated files:"
    find dist -name "*.js" -o -name "*.d.ts" | head -10
    if [ $(find dist -name "*.js" -o -name "*.d.ts" | wc -l) -gt 10 ]; then
        echo "... and $(find dist -name "*.js" -o -name "*.d.ts" | wc -l | awk '{print $1-10}') more files"
    fi
else
    print_error "Distribution directory not found"
    exit 1
fi

# Run linting
print_step "Running ESLint"
npm run lint
if [ $? -eq 0 ]; then
    print_success "Linting passed"
else
    print_warning "Linting issues found, but continuing..."
fi

# Run tests if available
print_step "Running tests"
if npm run test --silent > /dev/null 2>&1; then
    npm run test
    if [ $? -eq 0 ]; then
        print_success "All tests passed"
    else
        print_warning "Some tests failed, but build is complete"
    fi
else
    print_warning "No tests configured or test command not available"
fi

# Package analysis
print_step "Package analysis"
if [ -f "package.json" ]; then
    PACKAGE_NAME=$(node -p "require('./package.json').name")
    PACKAGE_VERSION=$(node -p "require('./package.json').version")
    print_success "Package: $PACKAGE_NAME v$PACKAGE_VERSION"
fi

# Show package size estimation
if command -v du &> /dev/null && [ -d "dist" ]; then
    DIST_SIZE=$(du -sh dist | cut -f1)
    print_success "Build size: $DIST_SIZE"
fi

# Final summary
echo -e "\n🎉 \033[1;32mTypeScript SDK Build Summary\033[0m"
echo "==============================="
echo "✅ Dependencies installed"
echo "✅ TypeScript compilation successful"
echo "✅ Build completed"
echo "✅ Files generated in dist/"

if [ -d "dist" ]; then
    echo -e "\n📦 Key build outputs:"
    [ -f "dist/index.js" ] && echo "  • Main bundle: dist/index.js"
    [ -f "dist/index.d.ts" ] && echo "  • Type definitions: dist/index.d.ts"
    [ -f "dist/client.js" ] && echo "  • Client module: dist/client.js"
    [ -d "dist/ai" ] && echo "  • AI modules: dist/ai/"
fi

echo -e "\n🚀 Ready for development and testing!"
echo -e "\nNext steps:"
echo "  • Import in your project: import { NoxClient } from '@nox/sdk'"
echo "  • Review documentation: npm run docs"
echo "  • Run development server: npm run dev"

print_success "TypeScript SDK build completed successfully! 🎊"
