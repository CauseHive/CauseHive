# CauseHive Railway Deployment Troubleshooting Guide

## Quick Deployment Checklist

### 1. Pre-Deployment Setup
- [ ] Create 4 separate Supabase databases:
  - `causehive_users` (default database)
  - `causehive_causes` 
  - `causehive_donations`
  - `causehive_admin`
- [ ] Add Redis add-on in Railway dashboard
- [ ] Set all environment variables in Railway

### 2. Required Railway Environment Variables
```bash
# Core Django Settings
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=*.railway.app
PORT=8000

# Database Connections (4 separate Supabase databases)
USER_SERVICE_DB_NAME=causehive_users
USER_SERVICE_DB_USER=postgres
USER_SERVICE_DB_PASSWORD=your_password
USER_SERVICE_DB_HOST=db.xxx.supabase.co
USER_SERVICE_DB_PORT=5432

CAUSE_SERVICE_DB_NAME=causehive_causes
CAUSE_SERVICE_DB_USER=postgres
CAUSE_SERVICE_DB_PASSWORD=your_password
CAUSE_SERVICE_DB_HOST=db.xxx.supabase.co
CAUSE_SERVICE_DB_PORT=5432

DONATION_SERVICE_DB_NAME=causehive_donations
DONATION_SERVICE_DB_USER=postgres
DONATION_SERVICE_DB_PASSWORD=your_password
DONATION_SERVICE_DB_HOST=db.xxx.supabase.co
DONATION_SERVICE_DB_PORT=5432

ADMIN_SERVICE_DB_NAME=causehive_admin
ADMIN_SERVICE_DB_USER=postgres
ADMIN_SERVICE_DB_PASSWORD=your_password
ADMIN_SERVICE_DB_HOST=db.xxx.supabase.co
ADMIN_SERVICE_DB_PORT=5432

# Redis (from Railway Redis add-on)
CELERY_BROKER_URL=redis://default:password@redis-url:port/0
CELERY_RESULT_BACKEND=redis://default:password@redis-url:port/1

# Payment Processing
PAYSTACK_PUBLIC_KEY=pk_live_or_test_key
PAYSTACK_SECRET_KEY=sk_live_or_test_key

# Internal API Communication
ADMIN_SERVICE_API_KEY=secure-random-api-key
```

## Common Issues and Solutions

### Issue 1: Migration Timeouts
**Symptoms:** Deployment fails during database migration
**Solution:** 
- The improved migration script now has retries and graceful failure handling
- Check Supabase database connectivity
- Verify all 4 databases exist and are accessible

### Issue 2: Database Connection Errors
**Symptoms:** "could not connect to server" errors
**Solution:**
```bash
# Verify Supabase settings:
# 1. Database host should be: db.xxx.supabase.co (not aws-xxx.supabase.co)
# 2. Port should be: 5432
# 3. SSL mode is automatically set to 'require'
# 4. Check Supabase dashboard for correct credentials
```

### Issue 3: Static Files Not Loading
**Symptoms:** CSS/JS files return 404 errors
**Solution:**
- Static files are now collected during Docker build
- WhiteNoise handles static file serving in production
- Check `STATIC_ROOT` and `STATICFILES_DIRS` in settings

### Issue 4: Health Check Failures
**Symptoms:** Railway shows service as unhealthy
**Solution:**
- Health check endpoint: `/api/health/`
- Readiness check endpoint: `/api/ready/`
- Check logs for database connection issues

### Issue 5: Celery/Redis Issues
**Symptoms:** Background tasks not working
**Solution:**
- Add Redis add-on in Railway dashboard
- Update `CELERY_BROKER_URL` with Railway Redis URL
- Format: `redis://default:password@host:port/0`

## Deployment Steps

### Step 1: Railway Project Setup
1. Connect GitHub repository to Railway
2. Select `backend/monolithic_app` as root directory
3. Railway auto-detects Dockerfile and railway.json

### Step 2: Add Redis Add-on
1. In Railway dashboard: Add-ons → Redis
2. Copy Redis URL to `CELERY_BROKER_URL` environment variable

### Step 3: Configure Environment Variables
Use the Railway dashboard to set all required environment variables listed above.

### Step 4: Deploy
1. Push changes to your repository
2. Railway automatically builds and deploys
3. Monitor logs for any issues

## Monitoring and Logs

### Health Check Endpoints
- **Health Check:** `https://causehive-monolithic-production.up.railway.app/api/health/`
- **Readiness Check:** `https://causehive-monolithic-production.up.railway.app/api/ready/`

### Log Monitoring
```bash
# In Railway dashboard, check logs for:
# ✅ "All databases migrated successfully!"
# ✅ "Starting Gunicorn server..."
# ❌ Database connection errors
# ❌ Migration failures
```

## Performance Optimization

### Gunicorn Configuration
Current settings (optimized for Railway):
- Workers: 3
- Timeout: 120 seconds
- Max requests: 1000 (with jitter)
- Keep-alive: 2 seconds

### Database Connection Pooling
Each database connection includes:
- SSL requirement for Supabase
- Connection retry logic
- Graceful failure handling

## Rollback Strategy

If deployment fails:
1. Check Railway logs for specific error
2. Verify environment variables
3. Test database connections locally
4. Use Railway's rollback feature if needed

## Local Testing

Before deploying to Railway:
```bash
# 1. Copy environment template
cp .env.template .env

# 2. Update .env with your Supabase credentials

# 3. Test migrations locally
python migrate_databases.py all

# 4. Test server startup
python manage.py runserver

# 5. Test health endpoints
curl http://localhost:8000/api/health/
curl http://localhost:8000/api/ready/
```

## Support

If issues persist:
1. Check Railway community forums
2. Review Supabase connection documentation
3. Verify all 4 databases are created and accessible
4. Test individual service endpoints after deployment
