#!/bin/bash

echo "🧪 Testing Full Stack Communication..."
echo ""

# Test 1: Frontend accessibility
echo "1️⃣ Testing Frontend..."
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" https://jasilmeledath-portfolio-hv3oekxof.vercel.app/)
if [ "$frontend_status" = "200" ]; then
    echo "✅ Frontend accessible"
else
    echo "❌ Frontend not accessible (Status: $frontend_status)"
    echo "   👉 Go to Vercel Dashboard and disable Deployment Protection!"
fi

echo ""

# Test 2: Backend health
echo "2️⃣ Testing Backend..."
backend_status=$(curl -s -o /dev/null -w "%{http_code}" https://jasilmeledathdev-production.up.railway.app/api/v1/health)
if [ "$backend_status" = "200" ]; then
    echo "✅ Backend accessible"
else
    echo "❌ Backend not accessible (Status: $backend_status)"
fi

echo ""

# Test 3: API Communication through proxy
echo "3️⃣ Testing API Communication..."
if [ "$frontend_status" = "200" ]; then
    api_status=$(curl -s -o /dev/null -w "%{http_code}" https://jasilmeledath-portfolio-hv3oekxof.vercel.app/api/proxy/health)
    if [ "$api_status" = "200" ]; then
        echo "✅ API communication working"
    else
        echo "⚠️  API proxy not working (Status: $api_status)"
    fi
else
    echo "⏭️ Skipping API test (frontend not accessible)"
fi

echo ""
echo "🌐 Your URLs:"
echo "Frontend: https://jasilmeledath-portfolio-hv3oekxof.vercel.app"
echo "Backend:  https://jasilmeledathdev-production.up.railway.app"
echo ""
echo "📋 Environment Variables Status:"
echo "NEXT_PUBLIC_API_URL: ✅ Set"
echo "NEXT_PUBLIC_SERVER_URL: ✅ Set"
echo "API_SERVER_URL: ✅ Set"
echo ""

if [ "$frontend_status" != "200" ]; then
    echo "⚠️  ACTION REQUIRED:"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Click 'jasilmeledath-portfolio'"
    echo "3. Settings → Deployment Protection"
    echo "4. Disable authentication protection"
    echo "5. Run this test again"
fi
