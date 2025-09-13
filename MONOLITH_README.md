# CauseHive Monolithic Application

This is the monolithic version of CauseHive that combines all microservices into a single Django application while maintaining separate databases for each service on Supabase.

## 🏗️ Architecture

### Services Combined
- **User Service**: User authentication, profiles, and management
- **Cause Service**: Cause creation, categories, and management
- **Donation Processing Service**: Donations, payments, cart, and withdrawals
- **Admin Reporting Service**: Admin panel, reporting, audit logs, and notifications

### Database Architecture
Each service maintains its own dedicated Supabase PostgreSQL database:
- `causehive_users` - User service data
- `causehive_causes` - Cause service data
- `causehive_donations` - Donation service data
- `causehive_admin` - Admin service data

## 🚀 Deployment on Railway

### 1. Setup Supabase Databases
Create four separate databases on Supabase:
1. **User Service Database**: `causehive_users`
2. **Cause Service Database**: `causehive_causes`
3. **Donation Service Database**: `causehive_donations`
4. **Admin Service Database**: `causehive_admin`

### 2. Deploy to Railway
1. Connect your GitHub repository to Railway
2. Create a new project and select this `backend/monolithic_app` directory
3. Railway will automatically detect the `railway.dockerfile` and `railway.json`
4. Set the following environment variables:

```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=*.railway.app

# User Service Database
USER_SERVICE_DB_NAME=causehive_users
USER_SERVICE_DB_USER=your_supabase_user
USER_SERVICE_DB_PASSWORD=your_supabase_password
USER_SERVICE_DB_HOST=your_supabase_host
USER_SERVICE_DB_PORT=5432

# Cause Service Database
CAUSE_SERVICE_DB_NAME=causehive_causes
CAUSE_SERVICE_DB_USER=your_supabase_user
CAUSE_SERVICE_DB_PASSWORD=your_supabase_password
CAUSE_SERVICE_DB_HOST=your_supabase_host
CAUSE_SERVICE_DB_PORT=5432

# Donation Service Database
DONATION_SERVICE_DB_NAME=causehive_donations
DONATION_SERVICE_DB_USER=your_supabase_user
DONATION_SERVICE_DB_PASSWORD=your_supabase_password
DONATION_SERVICE_DB_HOST=your_supabase_host
DONATION_SERVICE_DB_PORT=5432

# Admin Service Database
ADMIN_SERVICE_DB_NAME=causehive_admin
ADMIN_SERVICE_DB_USER=your_supabase_user
ADMIN_SERVICE_DB_PASSWORD=your_supabase_password
ADMIN_SERVICE_DB_HOST=your_supabase_host
ADMIN_SERVICE_DB_PORT=5432

# Redis for Celery (Railway addon)
CELERY_BROKER_URL=redis://your-redis-url:6379/0
CELERY_RESULT_BACKEND=redis://your-redis-url:6379/1

# Paystack
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# Admin API Key
ADMIN_SERVICE_API_KEY=your-admin-api-key
```

### 3. Add Redis Add-on
1. In Railway dashboard, add a Redis add-on to your project
2. Update the `CELERY_BROKER_URL` and `CELERY_RESULT_BACKEND` with the Redis URL

## 🛠️ Local Development

### 1. Setup Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Configuration
```bash
cp .env.template .env
# Edit .env with your local/development settings
```

### 3. Database Setup
```bash
# Run migrations for all databases
python migrate_databases.py all

# Or migrate specific apps
python migrate_databases.py app users_n_auth default
python migrate_databases.py app causes causes_db
```

### 4. Create Superuser
```bash
python manage.py createsuperuser --database=default
```

### 5. Run Development Server
```bash
python manage.py runserver
```

### 6. Run Celery (for background tasks)
```bash
# In a separate terminal
celery -A causehive worker --loglevel=info

# For scheduled tasks
celery -A causehive beat --loglevel=info
```

## 📚 API Endpoints

### User Service
- `POST /api/user/auth/signup/` - User registration
- `POST /api/user/auth/login/` - User login
- `GET /api/user/profile/` - User profile
- `PUT /api/user/profile/` - Update profile

### Cause Service
- `GET /api/causes/` - List causes
- `POST /api/causes/` - Create cause
- `GET /api/causes/{id}/` - Get cause details
- `PUT /api/causes/{id}/` - Update cause

### Donation Service
- `GET /api/donations/` - List donations
- `POST /api/donations/` - Create donation
- `GET /api/cart/` - Get cart items
- `POST /api/payments/initialize/` - Initialize payment

### Admin Service
- `GET /api/admin/dashboard/` - Admin dashboard
- `GET /api/admin/auditlog/` - Audit logs
- `GET /api/admin/management/` - User management

## 🔧 Database Management

### Migration Commands
```bash
# Generate migrations for all apps
python manage.py makemigrations

# Run all migrations
python migrate_databases.py all

# Migrate specific app to its database
python migrate_databases.py app users_n_auth default
python migrate_databases.py app causes causes_db
python migrate_databases.py app donations donations_db
python migrate_databases.py app admin_auth admin_db
```

### Database Shell Access
```bash
# Access specific database
python manage.py dbshell --database=default
python manage.py dbshell --database=causes_db
python manage.py dbshell --database=donations_db
python manage.py dbshell --database=admin_db
```

## 🔒 Security Features

- JWT-based authentication
- CORS protection
- Rate limiting
- SSL/TLS enforcement in production
- Secure headers middleware
- Environment-based configuration

## 📊 Monitoring and Logging

The application includes:
- Comprehensive logging for production
- Audit logging for admin actions
- Background task monitoring with Celery
- Error tracking and reporting

## 🚨 Troubleshooting

### Common Issues

1. **Migration Errors**: Ensure each app's migrations run on the correct database
2. **CORS Errors**: Update `CORS_ALLOWED_ORIGINS` in settings
3. **Celery Issues**: Ensure Redis is running and configured correctly
4. **Static Files**: Run `python manage.py collectstatic` for production

### Database Connection Issues
- Verify Supabase credentials
- Check network connectivity
- Ensure SSL mode is set to 'require'

## 🤝 Contributing

1. Create feature branches from `main`
2. Run tests before submitting PRs
3. Update documentation for new features
4. Follow Django best practices

## 📄 License

[Your License Here]
