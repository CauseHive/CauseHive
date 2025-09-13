#!/bin/bash

# Railway Deployment and Migration Script
# This script helps deploy the updated backend with new API endpoints

echo "🚀 Starting CauseHive Backend Deployment..."

# Change to backend directory
cd backend/monolithic_app

echo "📦 Installing dependencies..."
pip install -r ../../requirements.txt

echo "🔄 Creating migrations for new apps..."
python manage.py makemigrations blog
python manage.py makemigrations newsletter

echo "🔄 Running migrations..."
python manage.py migrate

echo "📊 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Backend deployment preparation complete!"
echo ""
echo "🔍 To debug Railway deployment:"
echo "1. Check Railway logs: railway logs --tail"
echo "2. Verify environment variables are set"
echo "3. Check database connections"
echo "4. Monitor startup process"
echo ""
echo "📡 New API endpoints added:"
echo "  - /api/blog-posts/"
echo "  - /api/testimonials/"  
echo "  - /api/contributors/"
echo "  - /api/statistics/"
echo "  - /api/newsletter/subscribe/"
echo ""
echo "🔧 Railway commands:"
echo "  - railway login (if not authenticated)"
echo "  - railway status (check deployment status)"
echo "  - railway restart (restart service)"
echo "  - railway shell (access service shell)"
