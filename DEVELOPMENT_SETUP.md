# CauseHive Development Environment Setup Guide

## 🛠️ Prerequisites Setup

### 1. Database Setup (PostgreSQL)
Each microservice needs its own database. Create these databases:

```sql
-- Connect to PostgreSQL and create databases
CREATE DATABASE user_service;
CREATE DATABASE cause_service;  
CREATE DATABASE donation_processing_service;
CREATE DATABASE admin_reporting_service;

-- Create a user (optional, or use your existing user)
CREATE USER causehive_dev WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE user_service TO causehive_dev;
GRANT ALL PRIVILEGES ON DATABASE cause_service TO causehive_dev;
GRANT ALL PRIVILEGES ON DATABASE donation_processing_service TO causehive_dev;
GRANT ALL PRIVILEGES ON DATABASE admin_reporting_service TO causehive_dev;
```

### 2. Environment Variables
Create `.env` files in each service directory:

#### User Service `.env`:
```env
SECRET_KEY=your-super-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=user_service
DB_USER=causehive_dev
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# External Services
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000

# Admin Service API Key (for inter-service communication)
ADMIN_SERVICE_API_KEY=your-admin-service-api-key
```

#### Cause Service `.env`:
```env
SECRET_KEY=your-super-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=cause_service
DB_USER=causehive_dev
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# User service URL for validation
USER_SERVICE_URL=http://localhost:8000/user
```

#### Donation Processing Service `.env`:
```env
SECRET_KEY=your-super-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database  
DB_NAME=donation_processing_service
DB_USER=causehive_dev
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# External Services
USER_SERVICE_URL=http://localhost:8000/user
CAUSES_URL=http://localhost:8001/causes
USER_SERVICE_SECRET_KEY=your-super-secret-key-here

# Paystack (for payments - get from paystack.com)
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
PAYSTACK_SECRET_KEY=sk_test_your_secret_key

# Redis/Celery
CELERY_BROKER_URL=redis://localhost:6379/0
```

#### Admin Reporting Service `.env`:
```env
SECRET_KEY=your-super-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=admin_reporting_service
DB_USER=causehive_dev
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# External Services
USER_SERVICE_URL=http://localhost:8000/user
CAUSE_SERVICE_URL=http://localhost:8001/causes
DONATION_SERVICE_URL=http://localhost:8002/donations

# Admin Service API Key (should match other services)
ADMIN_SERVICE_API_KEY=your-admin-service-api-key

# Celery
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2
```

### 3. Redis Setup (for Celery)
Install and start Redis:
```bash
# Windows (using Chocolatey)
choco install redis-64

# Or download from: https://github.com/microsoftarchive/redis/releases
# Start Redis server
redis-server
```

## 🚀 Step-by-Step Startup Process

### Method 1: Manual Startup (Recommended for Development)

1. **Start Database and Redis**:
   ```bash
   # Start PostgreSQL (if not running as service)
   # Start Redis
   redis-server
   ```

2. **Setup Backend Services**:
   ```bash
   # Terminal 1: User Service
   cd backend/services/user_service
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt  # or use uv sync
   python manage.py makemigrations
   python manage.py migrate
   python manage.py runserver 8000

   # Terminal 2: Cause Service  
   cd backend/services/cause_service
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py makemigrations
   python manage.py migrate
   python manage.py runserver 8001

   # Terminal 3: Donation Service
   cd backend/services/donation_processing_service
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py makemigrations
   python manage.py migrate
   python manage.py runserver 8002

   # Terminal 4: Admin Service
   cd backend/services/admin_reporting_service
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py makemigrations
   python manage.py migrate
   python manage.py runserver 8003
   ```

3. **Start Frontend**:
   ```bash
   # Terminal 5: Frontend
   cd frontend
   npm install
   npm run dev
   ```

### Method 2: Using Startup Scripts

Use the provided scripts:
```bash
# PowerShell (Windows)
./scripts/start_dev_environment.ps1

# Bash (Windows with WSL/Git Bash)
./scripts/start_dev_environment.sh
```

## 🧪 Testing Authentication Flow

### 1. Register a New User
```bash
curl -X POST http://localhost:8000/user/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password1": "testpassword123",
    "password2": "testpassword123"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:8000/user/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com", 
    "password": "testpassword123"
  }'
```

### 3. Access Protected Endpoints
```bash
# Use the JWT token from login response
curl -X GET http://localhost:8000/user/profile/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 4. Test Frontend Integration
1. Open http://localhost:5173
2. Navigate to sign-up page
3. Register a new user
4. Login with the created user
5. Check browser network tab for API calls

## 🔍 Architecture Flow

```
Frontend (5173) 
    ↓ API Calls
User Service (8000) ← JWT Authentication
    ↓ Validates with
Cause Service (8001) ← Browse Causes  
    ↓ Add to Cart
Donation Service (8002) ← Cart & Payments
    ↓ Reports to
Admin Service (8003) ← Dashboard & Analytics
```

## 🐛 Common Issues & Solutions

1. **Port Already in Use**: Change ports in settings.py or kill existing processes
2. **Database Connection**: Ensure PostgreSQL is running and credentials are correct
3. **Missing Dependencies**: Run `pip install` or `uv sync` in each service
4. **CORS Issues**: Frontend URL is configured in backend settings
5. **JWT Token Issues**: Ensure SECRET_KEY is same between services that share JWT

## 📊 Service Health Check URLs

- User Service: http://localhost:8000/user/
- Cause Service: http://localhost:8001/causes/
- Donation Service: http://localhost:8002/api/
- Admin Service: http://localhost:8003/admin/
- Frontend: http://localhost:5173/
