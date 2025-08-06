#!/bin/bash
# CauseHive Development Environment Setup
# Run this script to start all services in the correct order

echo "🚀 Starting CauseHive Development Environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="D:/CauseHive"

echo -e "\n${CYAN}📦 Starting Backend Services...${NC}"

# Start User Service (Port 8000)
echo -e "${YELLOW}Starting User Service on port 8000...${NC}"
cd "$BASE_DIR/backend/services/user_service"
python manage.py runserver 8000 &
USER_SERVICE_PID=$!

sleep 3

# Start Cause Service (Port 8001)
echo -e "${YELLOW}Starting Cause Service on port 8001...${NC}"
cd "$BASE_DIR/backend/services/cause_service"  
python manage.py runserver 8001 &
CAUSE_SERVICE_PID=$!

sleep 3

# Start Donation Processing Service (Port 8002)
echo -e "${YELLOW}Starting Donation Service on port 8002...${NC}"
cd "$BASE_DIR/backend/services/donation_processing_service"
python manage.py runserver 8002 &
DONATION_SERVICE_PID=$!

sleep 3

# Start Admin Reporting Service (Port 8003)
echo -e "${YELLOW}Starting Admin Service on port 8003...${NC}"
cd "$BASE_DIR/backend/services/admin_reporting_service"
python manage.py runserver 8003 &
ADMIN_SERVICE_PID=$!

sleep 5

# Start Frontend
echo -e "\n${CYAN}🎨 Starting Frontend...${NC}"
cd "$BASE_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo -e "\n${GREEN}✅ All services started!${NC}"
echo -e "\n${WHITE}📍 Service URLs:${NC}"
echo -e "   • Frontend:           http://localhost:5173"
echo -e "   • User Service:       http://localhost:8000"  
echo -e "   • Cause Service:      http://localhost:8001"
echo -e "   • Donation Service:   http://localhost:8002"
echo -e "   • Admin Service:      http://localhost:8003"

echo -e "\n${CYAN}🔧 For API testing:${NC}"
echo -e "   • User Registration:  POST http://localhost:8000/user/auth/signup/"
echo -e "   • User Login:         POST http://localhost:8000/user/auth/login/"
echo -e "   • User Profile:       GET  http://localhost:8000/user/profile/"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping all services...${NC}"
    kill $USER_SERVICE_PID 2>/dev/null
    kill $CAUSE_SERVICE_PID 2>/dev/null  
    kill $DONATION_SERVICE_PID 2>/dev/null
    kill $ADMIN_SERVICE_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ All services stopped.${NC}"
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Wait for user input to stop
echo -e "\n${YELLOW}Press Ctrl+C to stop all services...${NC}"
wait
