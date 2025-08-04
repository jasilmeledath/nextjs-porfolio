#!/bin/bash

# Simple Railway Deployment Script
# Usage: ./railway-deploy-simple.sh

set -e

echo "🚂 Simple Railway Deployment"
echo "=========================="

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install with:"
    echo "   npm install -g @railway/cli"
    exit 1
fi

echo "✅ Railway CLI found: $(railway --version)"

# Login check
echo ""
echo "🔐 Checking Railway login..."
if ! railway whoami &> /dev/null; then
    echo "Please login to Railway:"
    railway login
else
    echo "✅ Logged in as: $(railway whoami)"
fi

# Initialize project if needed  
echo ""
echo "🚀 Initializing Railway project..."
echo "Note: If project exists, this will link to it"
railway init

# Deploy server
echo ""
echo "📁 Deploying server directory..."
cd server
railway up

echo ""
echo "🎉 DEPLOYMENT COMPLETED!"
echo "========================"
echo "✅ Your API should be live on Railway"
echo "🔧 Next: Configure environment variables in Railway Dashboard"
echo "🌐 Next: Set up custom domain api.jasilmeledath.dev"