#!/bin/bash
# CauseHive Railway Deployment Script
# This script helps prepare and deploy your monolithic app to Railway

set -e

echo "🚀 CauseHive Railway Deployment Helper"
echo "======================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists python3; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

if ! command_exists git; then
    echo "❌ Git is required but not installed."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    if [ -f ".env.template" ]; then
        cp .env.template .env
        echo "📝 Please edit .env file with your actual values before continuing."
        echo "   Required: Database credentials, API keys, etc."
        read -p "Press Enter after updating .env file..."
    else
        echo "❌ No .env.template found. Please create .env manually."
        exit 1
    fi
fi

# Run deployment tests
echo ""
echo "🧪 Running deployment readiness tests..."
python3 test_deployment.py

if [ $? -ne 0 ]; then
    echo "❌ Deployment tests failed. Please fix issues before deploying."
    exit 1
fi

echo ""
echo "✅ All tests passed! Ready for Railway deployment."
echo ""
echo "📋 Next Steps for Railway Deployment:"
echo "1. Push your changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Improve Railway deployment configuration'"
echo "   git push origin main"
echo ""
echo "2. In Railway Dashboard:"
echo "   - Create new project from GitHub repo"
echo "   - Select 'backend/monolithic_app' as root directory"
echo "   - Add Redis add-on"
echo "   - Set environment variables (see RAILWAY_TROUBLESHOOTING.md)"
echo ""
echo "3. Monitor deployment:"
echo "   - Check build logs for any errors"
echo "   - Test health endpoint: https://causehive-monolithic-production.up.railway.app/api/health/"
echo "   - Verify all services are working"
echo ""
echo "📚 For troubleshooting, see: RAILWAY_TROUBLESHOOTING.md"
echo ""
echo "🎉 Good luck with your deployment!"
