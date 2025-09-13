# CauseHive Monolith

A monolithic Django application that combines all CauseHive microservices into a single, deployable application while maintaining separate Supabase databases for each service domain.

## 🏗️ Architecture

This monolith combines four previously separate microservices:

- **User Service** → `users_n_auth` app (default database)
- **Cause Service** → `causes`, `categories` apps (causes_db)
- **Donation Processing Service** → `donations`, `cart`, `payments`, `withdrawal_transfer` apps (donations_db)
- **Admin Reporting Service** → `admin_auth`, `dashboard`, `auditlog`, `notifications`, `management` apps (admin_db)

### Database Strategy

Each service maintains its own Supabase PostgreSQL database:
- `causehive_users` - User authentication and profiles
- `causehive_causes` - Causes and categories
- `causehive_donations` - Donations, payments, cart, withdrawals
- `causehive_admin` - Admin users, reports, audit logs

## 🚀 Deployment on Railway

### Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Supabase Databases**: Create 4 separate PostgreSQL databases on Supabase
3. **Redis Instance**: Either Railway Redis or external Redis service
4. **Paystack Account**: For payment processing

### Environment Variables

Set these environment variables in Railway:

```env
# Core Django Settings
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=*.railway.app,your-custom-domain.com

# User Service Database (Supabase #1)
USER_SERVICE_DB_NAME=causehive_users
USER_SERVICE_DB_USER=postgres
USER_SERVICE_DB_PASSWORD=your-password
USER_SERVICE_DB_HOST=db.your-project.supabase.co
USER_SERVICE_DB_PORT=5432

# Cause Service Database (Supabase #2)
CAUSE_SERVICE_DB_NAME=causehive_causes
CAUSE_SERVICE_DB_USER=postgres
CAUSE_SERVICE_DB_PASSWORD=your-password
CAUSE_SERVICE_DB_HOST=db.your-project-2.supabase.co
CAUSE_SERVICE_DB_PORT=5432

# Donation Service Database (Supabase #3)
DONATION_SERVICE_DB_NAME=causehive_donations
DONATION_SERVICE_DB_USER=postgres
DONATION_SERVICE_DB_PASSWORD=your-password
DONATION_SERVICE_DB_HOST=db.your-project-3.supabase.co
DONATION_SERVICE_DB_PORT=5432

# Admin Service Database (Supabase #4)
ADMIN_SERVICE_DB_NAME=causehive_admin
ADMIN_SERVICE_DB_USER=postgres
ADMIN_SERVICE_DB_PASSWORD=your-password
ADMIN_SERVICE_DB_HOST=db.your-project-4.supabase.co
ADMIN_SERVICE_DB_PORT=5432

# Redis (Railway Redis or external)
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/1

# Payment Processing
PAYSTACK_PUBLIC_KEY=pk_live_your_key
PAYSTACK_SECRET_KEY=sk_live_your_key

# Frontend
FRONTEND_URL=https://your-frontend-domain.com
```

### Railway Deployment Steps

1. **Connect Repository**:
   ```bash
   # Push this monolithic_app to a Git repository
   git init
   git add .
   git commit -m "CauseHive monolith ready for Railway"
   git branch -M main
   git remote add origin https://github.com/yourusername/causehive-monolith.git
   git push -u origin main
   ```

2. **Create Railway Project**:
   - Connect your GitHub repository to Railway
   - Railway will auto-detect the Django application

3. **Add Redis Service**:
   - In Railway dashboard, add Redis service
   - Note the Redis connection URL

4. **Set Environment Variables**:
   - Add all environment variables from the list above
   - Use Railway's environment variable interface

5. **Deploy**:
   - Railway will automatically build and deploy
   - Check deployment logs for any issues

### Database Migration

After deployment, run migrations for each database:

```bash
# Railway CLI (install: npm install -g @railway/cli)
railway login
railway shell

# Inside Railway shell:
python manage.py migrate --database=default
python manage.py migrate causes --database=causes_db
python manage.py migrate categories --database=causes_db
python manage.py migrate donations --database=donations_db
python manage.py migrate cart --database=donations_db
python manage.py migrate payments --database=donations_db
python manage.py migrate withdrawal_transfer --database=donations_db
python manage.py migrate admin_auth --database=admin_db
python manage.py migrate dashboard --database=admin_db
python manage.py migrate auditlog --database=admin_db
python manage.py migrate notifications --database=admin_db
python manage.py migrate management --database=admin_db

# Create superuser
python manage.py createsuperuser
```

## 🛠️ Local Development

### Setup

1. **Clone and Setup**:
   ```bash
   cd backend/monolithic_app
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your local database credentials
   ```

3. **Local Database Setup** (using local PostgreSQL):
   ```bash
   # Create local databases
   createdb causehive_users
   createdb causehive_causes  
   createdb causehive_donations
   createdb causehive_admin
   ```

4. **Run Migrations**:
   ```bash
   ./migrate_all_dbs.sh
   ```

5. **Start Development Server**:
   ```bash
   python manage.py runserver
   ```

6. **Start Celery Worker** (separate terminal):
   ```bash
   celery -A causehive worker -l info
   ```

7. **Start Celery Beat** (separate terminal):
   ```bash
   celery -A causehive beat -l info
   ```

## 📡 API Endpoints

The monolithic application exposes all endpoints under `/api/`:

### User Service
- `POST /api/user/auth/signup/` - User registration
- `POST /api/user/auth/login/` - User login
- `GET /api/user/profile/` - User profile
- `GET /api/user/users/<id>/` - User details

### Cause Service
- `GET /api/causes/` - List causes
- `POST /api/causes/` - Create cause
- `GET /api/causes/<id>/` - Cause details
- `GET /api/causes/categories/` - List categories

### Donation Processing
- `POST /api/donations/` - Create donation
- `GET /api/donations/` - List donations
- `POST /api/payments/initialize/` - Initialize payment
- `GET /api/cart/` - Shopping cart
- `POST /api/withdrawals/` - Request withdrawal

### Admin Service
- `GET /api/admin/dashboard/` - Admin dashboard
- `GET /api/admin/auditlog/` - Audit logs
- `GET /api/admin/management/users/` - Manage users

## 🔧 Configuration Details

### Database Routing

The `DatabaseRouter` class automatically routes:
- User auth operations → default database
- Cause operations → causes_db
- Donation operations → donations_db  
- Admin operations → admin_db

### Background Tasks

Celery handles:
- Report generation (hourly)
- Payment processing notifications
- Email notifications
- Audit log aggregation

### Static Files

- Served by WhiteNoise in production
- Automatically collected during Railway build

## 🚨 Production Considerations

### Security
- All database connections use SSL
- CORS configured for frontend domain
- Rate limiting on API endpoints
- JWT token authentication

### Monitoring
- Django logging configured for Railway
- Celery task monitoring via Redis
- Database connection pooling

### Scaling
- Stateless application design
- Redis for session storage and caching
- Separate databases allow independent scaling

## 🔍 Troubleshooting

### Common Issues

1. **Migration Errors**:
   ```bash
   # Reset migrations if needed
   python manage.py migrate --fake-initial --database=default
   ```

2. **Database Connection Issues**:
   - Verify Supabase connection strings
   - Check firewall/security group settings
   - Ensure SSL is enabled

3. **Static Files Not Loading**:
   ```bash
   python manage.py collectstatic --clear --noinput
   ```

4. **Celery Tasks Not Running**:
   - Check Redis connection
   - Verify Celery worker is running
   - Check task routing configuration

### Railway Logs
```bash
railway logs
```

### Database Queries
```bash
# Test database connections
python manage.py dbshell --database=default
python manage.py dbshell --database=causes_db
```

## 📚 Migration from Microservices

If migrating from the existing microservices:

1. Export data from each microservice database
2. Import to corresponding Supabase databases
3. Update foreign key relationships if needed
4. Test all API endpoints
5. Update frontend API URLs to monolith endpoints

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**CauseHive Monolith** - Combining microservices for simplified deployment while maintaining data isolation 🚀
