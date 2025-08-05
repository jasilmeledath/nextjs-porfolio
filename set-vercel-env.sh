#!/bin/bash

# Set Vercel Environment Variables for Production
# Run these commands in your terminal from the project root directory

echo "🔧 Setting up Vercel Environment Variables..."

# Essential Frontend Configuration
vercel env add NEXT_PUBLIC_API_URL production <<< "https://jasilmeledathdev-production.up.railway.app/api/v1"
vercel env add NEXT_PUBLIC_SITE_URL production <<< "https://jasilmeledath-portfolio.vercel.app"
vercel env add NEXT_PUBLIC_SERVER_URL production <<< "https://jasilmeledathdev-production.up.railway.app"

# API Server Configuration (for internal API routes)
vercel env add API_SERVER_URL production <<< "https://jasilmeledathdev-production.up.railway.app/api/v1"

# Node Environment
vercel env add NODE_ENV production <<< "production"

# Analytics (Optional - you can skip this for now)
# vercel env add NEXT_PUBLIC_GOOGLE_ANALYTICS_ID production <<< "GA_MEASUREMENT_ID"

echo "✅ Environment variables set with your Railway backend!"
echo ""
echo "🔗 Backend URL: https://jasilmeledathdev-production.up.railway.app"
echo "🔗 Frontend URL: https://jasilmeledath-portfolio.vercel.app"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Run this script: ./set-vercel-env.sh"
echo "2. Redeploy your frontend: vercel --prod"
echo "3. Test your full-stack application!"
echo ""
echo "🧪 Test your backend API:"
echo "   curl https://jasilmeledathdev-production.up.railway.app/api/v1/health"
