#!/bin/bash

# AyurSutra Backend Deployment Script
# This script deploys the backend using AWS CDK

set -e

echo "🚀 AyurSutra Backend Deployment"
echo "================================"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if CDK is installed
if ! command -v cdk &> /dev/null; then
    echo "❌ AWS CDK not installed. Installing..."
    npm install -g aws-cdk
fi

# Check environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Missing required environment variables:"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY" 
    echo "   - OPENAI_API_KEY"
    echo "   - FCM_SERVER_KEY (optional)"
    echo ""
    echo "Please set these variables or copy from env.example:"
    echo "   cp env.example .env"
    echo "   # Edit .env with your values"
    echo "   source .env"
    exit 1
fi

echo "✅ Environment variables configured"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the CDK stack
echo "🔨 Building CDK stack..."
npm run build

# Bootstrap CDK (if needed)
echo "🚀 Bootstrapping CDK..."
cdk bootstrap

# Deploy the stack
echo "🚀 Deploying to AWS..."
cdk deploy --require-approval never

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the API Gateway URL from the output above"
echo "2. Add these to your frontend .env file:"
echo "   VITE_ASSISTANT_URL=<API_GATEWAY_URL>/assistant"
echo "   VITE_DAILY_REPORT_URL=<API_GATEWAY_URL>/daily-report"
echo "3. Test the endpoints using the provided curl commands in README.md"
echo ""
echo "🎉 Your AyurSutra backend is ready!"

