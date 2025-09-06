# Railway Deployment Guide for CauseHive Monolith

## 🎯 Deployment Structure

Railway should build from the `backend/monolithic_app` directory, which contains:

```
backend/monolithic_app/
├── railway.dockerfile         # Docker build configuration
├── railway.json              # Railway deployment configuration  
├── requirements.txt           # Python dependencies
├── manage.py                  # Django management script
├── migrate_databases.py       # Multi-database migration script
├── causehive_monolith/        # Django project settings
└── [all Django apps]         # User, Cause, Donation, Admin services
```

## 🚀 Railway Setup Steps

### 1. Connect Repository
- Connect your GitHub repository to Railway
- **IMPORTANT**: Set the **Root Directory** to `backend/monolithic_app` in Railway project settings

### 2. Railway will automatically detect:
- `railway.dockerfile` for building the container
- `railway.json` for deployment configuration
- `requirements.txt` for Python dependencies

### 3. Set Environment Variables
Configure these in Railway dashboard:

```bash
# Django Settings
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=*.railway.app

# User Service Database (Supabase)
USER_SERVICE_DB_NAME=causehive_users
USER_SERVICE_DB_USER=your_supabase_user
USER_SERVICE_DB_PASSWORD=your_supabase_password
USER_SERVICE_DB_HOST=your_supabase_host
USER_SERVICE_DB_PORT=5432

# Cause Service Database (Supabase)  
CAUSE_SERVICE_DB_NAME=causehive_causes
CAUSE_SERVICE_DB_USER=your_supabase_user
CAUSE_SERVICE_DB_PASSWORD=your_supabase_password
CAUSE_SERVICE_DB_HOST=your_supabase_host
CAUSE_SERVICE_DB_PORT=5432

# Donation Service Database (Supabase)
DONATION_SERVICE_DB_NAME=causehive_donations
DONATION_SERVICE_DB_USER=your_supabase_user
DONATION_SERVICE_DB_PASSWORD=your_supabase_password
DONATION_SERVICE_DB_HOST=your_supabase_host
DONATION_SERVICE_DB_PORT=5432

# Admin Service Database (Supabase)
ADMIN_SERVICE_DB_NAME=causehive_admin
ADMIN_SERVICE_DB_USER=your_supabase_user
ADMIN_SERVICE_DB_PASSWORD=your_supabase_password
ADMIN_SERVICE_DB_HOST=your_supabase_host
ADMIN_SERVICE_DB_PORT=5432

# Redis for background tasks
CELERY_BROKER_URL=redis://your-redis-host:6379/0
CELERY_RESULT_BACKEND=redis://your-redis-host:6379/1

# Paystack for payments
PAYSTACK_PUBLIC_KEY=pk_live_xxx
PAYSTACK_SECRET_KEY=sk_live_xxx

# Other settings
ADMIN_SERVICE_API_KEY=your-admin-api-key
FRONTEND_URL=https://your-frontend-domain.com
```

### 4. Deployment Process
Railway will automatically:
1. Build using `railway.dockerfile`
2. Install dependencies from `requirements.txt`
3. Collect static files
4. Run `migrate_databases.py all` to migrate all 4 databases
5. Start the application with Gunicorn

## ✅ Verification

After deployment, your API will be available at:
- `https://causehive-monolithic-production.up.railway.app/api/user/` (User service endpoints)
- `https://causehive-monolithic-production.up.railway.app/api/causes/` (Cause service endpoints)
- `https://causehive-monolithic-production.up.railway.app/api/donations/` (Donation service endpoints)
- `https://causehive-monolithic-production.up.railway.app/api/admin/` (Admin service endpoints)

## 🔧 Prerequisites

Before deploying, ensure you have:
1. **4 Supabase databases** created and configured
2. **Redis instance** for background tasks (Railway addon)
3. **Paystack account** for payment processing
4. **All environment variables** set in Railway dashboard

## 📝 Notes

- The application will automatically run migrations for all 4 databases on startup
- Static files are collected during the Docker build process
- Health checks are configured to ensure the application is running properly
- Gunicorn is configured with 3 workers for production load handling
