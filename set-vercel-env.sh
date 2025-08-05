#!/bin/bash

# Set Vercel Environment Variables for Production
# Run these commands in your terminal from the project root directory

echo "🔧 Setting up Vercel Environment Variables..."

# Essential Frontend Configuration
vercel env add NEXT_PUBLIC_API_URL production <<< "https://your-backend-url.com/api/v1"
vercel env add NEXT_PUBLIC_SITE_URL production <<< "https://jasilmeledath-portfolio.vercel.app"
vercel env add NEXT_PUBLIC_SERVER_URL production <<< "https://your-backend-url.com"

# API Server Configuration (for internal API routes)
vercel env add API_SERVER_URL production <<< "https://your-backend-url.com/api/v1"

# Node Environment
vercel env add NODE_ENV production <<< "production"

# Analytics (Optional - you can skip this for now)
# vercel env add NEXT_PUBLIC_GOOGLE_ANALYTICS_ID production <<< "GA_MEASUREMENT_ID"

echo "✅ Basic environment variables set!"
echo ""
echo "📝 IMPORTANT NEXT STEPS:"
echo "1. Deploy your backend to get the actual backend URL"
echo "2. Update the backend URLs using:"
echo "   vercel env rm NEXT_PUBLIC_API_URL production"
echo "   vercel env add NEXT_PUBLIC_API_URL production"
echo "3. Then redeploy your frontend: vercel --prod"
echo ""
echo "🚀 Suggested backend deployment platforms:"
echo "   - Railway: https://railway.app"
echo "   - Render: https://render.com" 
echo "   - Heroku: https://heroku.com"
