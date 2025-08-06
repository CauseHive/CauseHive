# CauseHive Development Environment Startup Script
# This script starts all microservices and the frontend for complete system testing

Write-Host "🚀 Starting CauseHive Development Environment..." -ForegroundColor Green

# Function to start a service in a new terminal
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$Path,
        [string]$Command,
        [int]$Port
    )
    
    Write-Host "Starting $ServiceName on port $Port..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-Command", "cd '$Path'; Write-Host 'Starting $ServiceName on port $Port' -ForegroundColor Green; $Command; Read-Host 'Press Enter to close'"
    Start-Sleep 2
}

# Set base directory
$BaseDir = "D:\CauseHive"

# Start Backend Services
Write-Host "`n📦 Starting Backend Services..." -ForegroundColor Cyan

# 1. User Service (Port 8000)
Start-Service -ServiceName "User Service" -Path "$BaseDir\backend\services\user_service" -Command "python manage.py runserver 8000" -Port 8000

# 2. Cause Service (Port 8001) 
Start-Service -ServiceName "Cause Service" -Path "$BaseDir\backend\services\cause_service" -Command "python manage.py runserver 8001" -Port 8001

# 3. Donation Processing Service (Port 8002)
Start-Service -ServiceName "Donation Service" -Path "$BaseDir\backend\services\donation_processing_service" -Command "python manage.py runserver 8002" -Port 8002

# 4. Admin Reporting Service (Port 8003)
Start-Service -ServiceName "Admin Service" -Path "$BaseDir\backend\services\admin_reporting_service" -Command "python manage.py runserver 8003" -Port 8003

# Wait for backend services to start
Write-Host "`n⏳ Waiting for backend services to initialize..." -ForegroundColor Yellow
Start-Sleep 10

# Start Frontend
Write-Host "`n🎨 Starting Frontend..." -ForegroundColor Cyan
Start-Service -ServiceName "Frontend (React)" -Path "$BaseDir\frontend" -Command "npm run dev" -Port 5173

Write-Host "`n✅ All services started!" -ForegroundColor Green
Write-Host "`n📍 Service URLs:" -ForegroundColor White
Write-Host "   • Frontend:           http://localhost:5173" -ForegroundColor White
Write-Host "   • User Service:       http://localhost:8000" -ForegroundColor White  
Write-Host "   • Cause Service:      http://localhost:8001" -ForegroundColor White
Write-Host "   • Donation Service:   http://localhost:8002" -ForegroundColor White
Write-Host "   • Admin Service:      http://localhost:8003" -ForegroundColor White

Write-Host "`n🔧 For API testing:" -ForegroundColor Cyan
Write-Host "   • User Registration:  POST http://localhost:8000/user/auth/signup/" -ForegroundColor White
Write-Host "   • User Login:         POST http://localhost:8000/user/auth/login/" -ForegroundColor White
Write-Host "   • User Profile:       GET  http://localhost:8000/user/profile/" -ForegroundColor White

Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "   2. Test user registration and login" -ForegroundColor White
Write-Host "   3. Use browser dev tools to monitor API calls" -ForegroundColor White

Read-Host "`nPress Enter to exit"
