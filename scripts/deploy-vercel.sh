#!/bin/bash

# Vercel Deployment Script for Client
# Usage: ./scripts/deploy-vercel.sh [staging|production]

set -e  # Exit on error

ENVIRONMENT=${1:-production}

echo "🚀 Deploying client to Vercel ($ENVIRONMENT)..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Navigate to client directory
cd client

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🏗️  Building project..."
npm run build

# Deploy based on environment
if [ "$ENVIRONMENT" = "staging" ]; then
    echo "🚀 Deploying to staging..."
    vercel --prod=false
elif [ "$ENVIRONMENT" = "production" ]; then
    echo "🚀 Deploying to production..."
    vercel --prod
else
    echo "❌ Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

echo "✅ Deployment completed!"
echo "🌐 Your site should be available at: https://jasilmeledath.dev"