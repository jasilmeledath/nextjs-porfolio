#!/bin/bash

# Render Deployment Script
# Usage: ./scripts/deploy-render.sh

set -e  # Exit on error

echo "🎨 Preparing for Render deployment..."

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found. Creating from template..."
    cp render.yaml.template render.yaml
    echo "📝 Please update render.yaml with your specific configuration"
    exit 1
fi

# Build and test
echo "🏗️  Building project..."
npm run build:production

# Create deployment commit
echo "📝 Creating deployment commit..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"

# Push to trigger deployment
echo "🚀 Pushing to trigger Render deployment..."
git push origin main

echo "✅ Deployment triggered!"
echo "🌐 Check your Render dashboard for deployment status"
echo "📝 Remember to set environment variables in Render dashboard"