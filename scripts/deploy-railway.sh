#!/bin/bash

# Railway Deployment Script for Server
# Usage: ./scripts/deploy-railway.sh

set -e  # Exit on error

echo "🚂 Deploying server to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed. Installing..."
    npm install -g @railway/cli
fi

# Login check
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway first:"
    railway login
fi

# Navigate to server directory
cd server

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Server deployment completed!"
echo "🌐 Your API should be available at your Railway domain"
echo "📝 Don't forget to set up your environment variables in Railway dashboard"