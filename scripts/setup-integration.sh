#!/bin/bash

# AyurSutra Integration Setup Script
echo "🚀 Setting up AyurSutra Patient Companion Integration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
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

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_success ".env file created. Please update with your actual values."
fi

# Check if Supabase .env exists
if [ ! -f "supabase/.env" ]; then
    print_warning "Supabase .env file not found. Creating from .env.example..."
    cp supabase/.env.example supabase/.env
    print_success "Supabase .env file created. Please update with your actual values."
fi

print_status "Checking dependencies..."

# Install frontend dependencies
if [ -f "package.json" ]; then
    print_status "Installing frontend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_status "Installing Supabase CLI..."
    npm install -g supabase
fi

print_status "Setting up Expo development..."

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    print_status "Installing Expo CLI..."
    npm install -g @expo/cli
fi

print_status "Integration setup complete! 🎉"
echo ""
print_warning "Next steps:"
echo "1. Update .env file with your Supabase credentials"
echo "2. Update .env file with your Firebase credentials"
echo "3. Update supabase/.env with your Gemini API key"
echo "4. Deploy Supabase Edge Functions: supabase functions deploy"
echo "5. Deploy database schema: supabase db push"
echo "6. Start the app: npm start"
echo ""
print_success "Ready to run! Use 'npm start' to launch the development server."