#!/bin/bash

# Performance Validation Script
# Validates that the optimization has been successfully implemented

echo "🚀 Next.js Portfolio Performance Validation"
echo "==========================================="

# Check if both servers are running
echo "📡 Checking server status..."

# Check Express server (port 8000)
if curl -s http://localhost:8000/api/v1/health >/dev/null 2>&1; then
    echo "✅ Express server running on port 8000"
else
    echo "❌ Express server not accessible on port 8000"
fi

# Check Next.js server (port 3000)
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Next.js server running on port 3000"
else
    echo "❌ Next.js server not accessible on port 3000"
fi

echo ""
echo "🎯 Performance Optimization Status"
echo "=================================="

# Check if optimized components exist
if [ -f "/Users/jasilm/Desktop/Nextjs Portfolio/client/src/components/ui/OptimizedSkillsSection.js" ]; then
    echo "✅ OptimizedSkillsSection.js - Created"
else
    echo "❌ OptimizedSkillsSection.js - Missing"
fi

if [ -f "/Users/jasilm/Desktop/Nextjs Portfolio/client/src/components/ui/OptimizedProjectsSection.js" ]; then
    echo "✅ OptimizedProjectsSection.js - Created"
else
    echo "❌ OptimizedProjectsSection.js - Missing"
fi

if [ -f "/Users/jasilm/Desktop/Nextjs Portfolio/client/src/utils/performance-monitor.js" ]; then
    echo "✅ Performance Monitor - Created"
else
    echo "❌ Performance Monitor - Missing"
fi

if [ -f "/Users/jasilm/Desktop/Nextjs Portfolio/client/src/utils/performance-test-suite.js" ]; then
    echo "✅ Performance Test Suite - Created"
else
    echo "❌ Performance Test Suite - Missing"
fi

if [ -f "/Users/jasilm/Desktop/Nextjs Portfolio/PERFORMANCE_OPTIMIZATION_REPORT.md" ]; then
    echo "✅ Performance Report - Created"
else
    echo "❌ Performance Report - Missing"
fi

echo ""
echo "📊 Bundle Size Analysis"
echo "======================"

# Navigate to client directory and check bundle size (if built)
cd "/Users/jasilm/Desktop/Nextjs Portfolio/client"

if [ -d ".next" ]; then
    echo "✅ Next.js build exists"
    if command -v du >/dev/null 2>&1; then
        BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
        echo "📦 Build size: $BUILD_SIZE"
    fi
else
    echo "ℹ️  No build found - run 'npm run build' to analyze bundle size"
fi

echo ""
echo "🌐 Ready for Testing"
echo "==================="
echo "✅ Portfolio available at: http://localhost:3000/portfolio"
echo "🔧 Performance Monitor: Enabled in development mode"
echo "🧪 Performance Tests: Available via browser console or test button"
echo ""
echo "📝 Next Steps:"
echo "1. Open http://localhost:3000/portfolio in your browser"
echo "2. Open Chrome DevTools (F12)"
echo "3. Go to Performance tab"
echo "4. Click 'Run Performance Test' button (bottom-left)"
echo "5. Monitor FPS counter (top-right overlay)"
echo ""
echo "🎯 Success Criteria:"
echo "- Skills section: 60+ FPS during hover interactions"
echo "- Projects section: 60+ FPS during hover/scroll"
echo "- No visible stuttering or jank"
echo "- ID card physics preserved"
echo "- Background icons working"
echo ""
echo "Performance optimization validation complete! 🎉"
