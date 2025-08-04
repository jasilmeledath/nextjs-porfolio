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

# Check if project is linked
if ! railway status &> /dev/null; then
    echo "🔗 No Railway project found. Initializing new project..."
    railway init
    echo "✅ Railway project initialized"
fi

# Navigate to server directory
echo "📁 Navigating to server directory..."
cd server

# Check if server directory is properly set up
if [ ! -f "package.json" ]; then
    echo "❌ No package.json found in server directory!"
    echo "   Make sure you're running this from the project root."
    exit 1
fi

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Server deployment completed!"
echo "🌐 Your API should be available at your Railway domain"
echo ""
echo "📝 NEXT STEPS:"
echo "1. 🔧 Set environment variables in Railway Dashboard:"
echo "   - NODE_ENV=production"  
echo "   - MONGODB_URI=your-mongodb-connection-string"
echo "   - JWT_SECRET=your-jwt-secret"
echo "   - EMAIL_PASSWORD=mydn cttd wlcm yuaa"
echo "   - FRONTEND_URL=https://jasilmeledath.dev"
echo ""
echo "2. 🌐 Configure custom domain:"
echo "   - Go to Railway Dashboard → Settings → Domains"
echo "   - Add custom domain: api.jasilmeledath.dev"
echo ""
echo "3. 🧪 Test API endpoint:"
echo "   - https://your-app.up.railway.app/api/v1/health"