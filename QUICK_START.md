# Quick Start Guide for CauseHive Authentication Testing

## 🎯 **Immediate Steps to Test Authentication**

### **1. Start User Service (Priority 1)**
```bash
# Open Terminal 1
cd d:\CauseHive\backend\services\user_service
python manage.py runserver 8000
```

### **2. Start Frontend** 
```bash
# Open Terminal 2  
cd d:\CauseHive\frontend
npm run dev
```

### **3. Basic Authentication Test**
1. Open browser: http://localhost:5173
2. Navigate to sign-up page
3. Try to register a user
4. Check browser network tab for API calls to localhost:8000

---

## 🔧 **If You Want Full System (All Services)**

### **Required Environment Setup**
Each service needs a `.env` file with database credentials. Minimal setup:

**User Service .env** (`backend/services/user_service/.env`):
```
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=user_service
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
FRONTEND_URL=http://localhost:5173
ADMIN_SERVICE_API_KEY=test-api-key
```

### **Start All Services**
```bash
# Terminal 1: User Service (Port 8000)
cd backend/services/user_service
python manage.py runserver 8000

# Terminal 2: Cause Service (Port 8001)  
cd backend/services/cause_service
python manage.py runserver 8001

# Terminal 3: Donation Service (Port 8002)
cd backend/services/donation_processing_service  
python manage.py runserver 8002

# Terminal 4: Admin Service (Port 8003)
cd backend/services/admin_reporting_service
python manage.py runserver 8003

# Terminal 5: Frontend (Port 5173)
cd frontend
npm run dev
```

---

## 🧪 **Test Authentication Flow**

### **Method 1: Via Frontend (Recommended)**
1. http://localhost:5173 → Sign Up
2. Create account with email/password
3. Login with created credentials
4. Check browser dev tools for API calls

### **Method 2: Direct API Testing**
```bash
# Register User
curl -X POST http://localhost:8000/user/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password1": "pass123", "password2": "pass123"}'

# Login User  
curl -X POST http://localhost:8000/user/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "pass123"}'
```

---

## ⚡ **Service URLs**
- **Frontend**: http://localhost:5173
- **User API**: http://localhost:8000/user/
- **Cause API**: http://localhost:8001/causes/  
- **Donation API**: http://localhost:8002/api/
- **Admin API**: http://localhost:8003/admin/

---

## 🐛 **Common Issues**
1. **Port in use**: Kill process or change port
2. **Database error**: Check PostgreSQL is running
3. **Module not found**: Run `pip install` in service directory
4. **CORS issues**: Check FRONTEND_URL in backend .env files
