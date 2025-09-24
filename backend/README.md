# CauseHive Backend

A robust Django REST API backend for CauseHive, a crowdfunding platform that enables users to create, discover, and support charitable causes with seamless payment processing and comprehensive admin management.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Custom Google OAuth 2.0 integration with direct profile redirect
  - Email verification system with beautiful HTML templates
  - Password reset functionality with email notifications
  - User profile management
  - Automatic user creation on OAuth login

- **Cause Management**
  - Create and manage charitable causes
  - Cause approval workflow
  - Progress tracking and analytics
  - Category-based organization

- **Donation System**
  - Secure payment processing via Paystack
  - Real-time donation tracking
  - Donation analytics and reporting
  - Automated email notifications for successful donations
  - Donation confirmation emails with receipt-style design

- **Admin Dashboard**
  - Comprehensive admin interface
  - Real-time analytics and charts
  - Cause approval workflow with email notifications
  - User and donation management
  - Custom notifications system
  - Automatic email notifications for cause approval/rejection

### Technical Features
- **Performance Optimized**
  - Redis caching
  - Database connection pooling
  - Query optimization
  - Background task processing

- **Security**
  - HTTPS enforcement
  - CORS configuration
  - Rate limiting
  - Input validation

- **Email Notification System**
  - 6 different email types with beautiful HTML templates
  - Consistent CauseHive branding and green color scheme
  - Responsive design for all email clients
  - Automatic email sending for key user actions
  - SMTP integration with error handling

- **Monitoring & Analytics**
  - Real-time dashboard metrics
  - Donation trend analysis
  - User activity tracking
  - Admin notification system

## 🏗️ Architecture

### Tech Stack
- **Framework**: Django 5.2.4
- **Database**: PostgreSQL (Supabase) with connection pooling
- **Cache**: Redis with optimized caching strategies
- **Task Queue**: Celery with Redis broker
- **Authentication**: JWT + Custom Google OAuth 2.0
- **Payment**: Paystack with Ghanaian Cedi support
- **Deployment**: Railway with production optimizations

### Project Structure
```
backend/
├── causehive/                 # Main Django project
│   ├── settings.py           # Configuration
│   ├── urls.py              # URL routing
│   └── wsgi.py              # WSGI application
├── users_n_auth/            # User management
├── causes/                  # Cause management
├── donations/               # Donation processing
├── payments/                # Payment integration
├── cart/                    # Shopping cart
├── withdrawal_transfer/     # Withdrawal processing
├── notifications/           # Admin notifications
├── categories/              # Cause categories
├── templates/               # Admin templates
└── static/                  # Static files
```

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
SECRET_KEY=your-secret-key

# Paystack
PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...

# Google OAuth
GOOGLE_OAUTH2_CLIENT_ID=your-client-id
GOOGLE_OAUTH2_SECRET=your-client-secret

# Email Configuration
EMAIL_HOST=smtp.zoho.com
EMAIL_HOST_USER=your-email@domain.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=True
EMAIL_PORT=587
DEFAULT_FROM_EMAIL=CauseHive <no-reply@causehive.tech>
SUPPORT_EMAIL=support@causehive.tech
```

### Database Configuration
- **Primary Database**: PostgreSQL (Supabase)
- **Connection Pooling**: Enabled for production
- **Migrations**: Automated via Django ORM
- **Indexing**: Optimized for performance

### Cache Configuration
- **Redis**: Session storage and caching
- **Cache Timeout**: 5 minutes default
- **Session Engine**: Redis-backed sessions

## 📊 Admin Dashboard

### Features
- **Real-time Analytics**
  - User registration trends
  - Donation volume and trends
  - Cause progress tracking
  - Revenue analytics

- **Cause Management**
  - Approval workflow
  - Status tracking (Pending → Live → Completed)
  - Bulk actions
  - Progress monitoring

- **User Management**
  - User profiles and activity
  - Account status management
  - Registration analytics

- **Notification System**
  - Real-time admin notifications
  - Email alerts for important events
  - Notification history

### Custom Admin Features
- **Dark/Light Mode**: Toggleable theme with CSS variables
- **Custom Branding**: CauseHive logo, favicon, and Ghanaian Cedi currency
- **Interactive Charts**: Chart.js integration with real-time data
- **Responsive Design**: Mobile-friendly interface
- **Cause Approval Workflow**: Admin-controlled cause publishing
- **Notification System**: Real-time admin notifications with email alerts

## 🔐 Security

### Authentication
- **JWT Tokens**: Secure API authentication with refresh token support
- **Google OAuth 2.0**: Custom social login integration with direct profile redirect
- **Password Security**: Django's built-in password hashing
- **Session Management**: Redis-backed sessions
- **OAuth Flow**: Complete OAuth flow with automatic user creation and JWT generation

### API Security
- **CORS**: Configured for frontend domains
- **Rate Limiting**: Per-user and per-endpoint limits
- **Input Validation**: Comprehensive data validation
- **HTTPS**: Enforced in production

### Data Protection
- **Encryption**: Sensitive data encryption
- **Access Control**: Role-based permissions
- **Audit Logging**: User action tracking

## 🔐 Google OAuth Integration

### Custom OAuth Implementation
- **OAuth 2.0 Flow**: Complete Google OAuth 2.0 implementation
- **Direct Profile Redirect**: Automatic redirect to profile with JWT token
- **User Creation**: Automatic user account creation on first OAuth login
- **JWT Generation**: Secure access and refresh token generation
- **Frontend Ready**: Complete frontend integration examples provided

### OAuth Features
- **Secure Token Exchange**: Google authorization code to JWT conversion
- **Profile Data Retrieval**: Automatic user profile creation from Google data
- **Error Handling**: Comprehensive error handling for OAuth failures
- **Production Ready**: HTTPS support and proper security measures

## 📧 Email Notification System

### Overview
The CauseHive platform includes a comprehensive email notification system that sends beautifully designed HTML emails for various user actions and system events. All emails use a consistent design with the CauseHive branding and green color scheme.

### Email Types
1. **Account Verification Email** - Sent during user registration
2. **Password Reset Email** - Sent when users request password reset
3. **Donation Success Email** - Sent after successful donation processing
4. **Withdrawal Processed Email** - Sent when withdrawal is completed
5. **Cause Approval Email** - Sent to organizers when cause is approved
6. **Cause Rejection Email** - Sent to organizers when cause is rejected

### Features
- **Professional HTML Design**: Responsive templates that work across all email clients
- **Consistent Branding**: CauseHive logo and green color scheme throughout
- **Automatic Sending**: Emails are triggered automatically by system events
- **Error Handling**: Graceful handling of email delivery failures
- **SMTP Integration**: Configurable SMTP settings for reliable delivery

### Email Templates
All email templates are located in `templates/email/` and include:
- `verification_email.html` - Account verification
- `password_reset_email.html` - Password reset
- `donation_successful.html` - Donation confirmation
- `withdrawal_processed.html` - Withdrawal confirmation
- `cause_approved.html` - Cause approval notification
- `cause_rejected.html` - Cause rejection notification

## 💳 Payment Integration

### Paystack Integration
- **Payment Processing**: Secure payment handling with webhook support
- **Webhook Support**: Real-time payment updates and verification
- **Multi-currency**: Ghanaian Cedi (₵) primary currency with custom icons
- **Transaction Tracking**: Complete payment history and analytics
- **Bank Integration**: Ghanaian bank and mobile money support

### Features
- **One-time Donations**: Direct cause support
- **Payment Verification**: Automated verification
- **Refund Processing**: Admin-managed refunds
- **Analytics**: Payment trend analysis

## 🔄 Background Tasks

### Celery Integration
- **Task Queue**: Redis-backed task processing
- **Scheduled Tasks**: Automated maintenance
- **Email Notifications**: Async email sending
- **Payment Processing**: Background payment verification

### Task Types
- **Email Sending**: User notifications
- **Payment Verification**: Transaction validation
- **Data Cleanup**: Automated maintenance
- **Report Generation**: Analytics processing

## 📈 Performance

### Optimization Features
- **Database Indexing**: Optimized queries with Supabase-specific tuning
- **Connection Pooling**: Efficient database connections with health checks
- **Caching Strategy**: Multi-level Redis caching with optimized timeouts
- **Query Optimization**: Efficient data retrieval with select_related and prefetch_related
- **Background Processing**: Celery task queue for async operations

### Monitoring
- **Performance Metrics**: Response time tracking
- **Error Logging**: Comprehensive error tracking
- **Resource Usage**: Memory and CPU monitoring
- **Database Performance**: Query optimization

## 🚀 Deployment

### Production Environment
- **Platform**: Railway
- **Database**: Supabase PostgreSQL
- **Cache**: Redis Cloud
- **Static Files**: WhiteNoise
- **SSL**: Automatic HTTPS

### Environment Configuration
- **Debug Mode**: Disabled in production
- **Security Headers**: Comprehensive security
- **CORS**: Production domain configuration
- **Logging**: Structured logging

## 📱 API Endpoints

### Authentication
- `POST /api/user/auth/signup/` - User registration (sends verification email)
- `POST /api/user/auth/login/` - User login
- `POST /api/user/auth/logout/` - User logout
- `GET /api/user/auth/verify/{uid}/{token}/` - Verify email address
- `POST /api/user/auth/resend-verification/` - Resend verification email
- `POST /api/user/auth/password-reset/` - Request password reset (sends email)
- `POST /api/user/auth/password-reset-confirm/` - Confirm password reset
- `GET /api/user/google/url/` - Get Google OAuth URL
- `GET /api/user/google/callback/` - Google OAuth callback (handles redirect)
- `GET /api/user/profile/?access_token=TOKEN` - Get user profile with OAuth token

### Causes
- `GET /api/causes/` - List causes
- `POST /api/causes/` - Create cause
- `GET /api/causes/{id}/` - Get cause details
- `PUT /api/causes/{id}/` - Update cause

### Donations
- `GET /api/donations/` - List donations
- `POST /api/donations/` - Create donation
- `GET /api/donations/statistics/` - Donation analytics

### Admin
- `GET /admin/` - Admin dashboard
- `GET /admin/dashboard/` - Enhanced dashboard
- `GET /admin/api/donations-chart/` - Chart data

## 🔧 Management Commands

### Available Commands
- `python manage.py setup_google_oauth` - Configure Google OAuth (legacy - now auto-configured)
- `python manage.py collectstatic` - Collect static files
- `python manage.py migrate` - Run database migrations
- `python manage.py createsuperuser` - Create admin user
- `python manage.py runserver` - Start development server

## 📊 Monitoring & Analytics

### Dashboard Metrics
- **User Statistics**: Registration trends, active users
- **Cause Analytics**: Creation trends, success rates
- **Donation Metrics**: Volume, frequency, amounts
- **Revenue Tracking**: Total raised, platform fees

### Real-time Features
- **Live Updates**: Real-time dashboard updates
- **Notification System**: Instant admin alerts
- **Progress Tracking**: Cause completion monitoring
- **Activity Feed**: Recent system activity

## 🛠️ Maintenance

### Regular Tasks
- **Database Cleanup**: Automated data maintenance
- **Cache Management**: Redis cache optimization
- **Log Rotation**: Log file management
- **Backup Verification**: Data integrity checks

### Health Checks
- **API Health**: `/api/health/` endpoint
- **Database Status**: Connection monitoring
- **Cache Status**: Redis connectivity
- **External Services**: Paystack, email service status

## 📚 Documentation

### Available Documentation
- **API Documentation**: Comprehensive endpoint documentation
- **Google OAuth Setup**: Complete OAuth integration guide with frontend examples
- **Admin Dashboard Guide**: Custom admin panel features and usage
- **Deployment Guide**: Production deployment instructions
- **Frontend Integration**: React, Vue.js, and Vanilla JavaScript examples

### Quick Start
1. **Clone Repository**: `git clone <repository-url>`
2. **Install Dependencies**: `uv install`
3. **Configure Environment**: Set up `.env` file with required variables
4. **Run Migrations**: `uv run python manage.py migrate`
5. **Start Server**: `uv run python manage.py runserver`
6. **Access Admin**: Visit `/admin/` for the custom dashboard

## 📞 Support

For technical support or questions about the backend:
- **Documentation**: Comprehensive API documentation
- **Error Logging**: Detailed error tracking
- **Performance Monitoring**: Real-time metrics
- **Security Audits**: Regular security assessments
- **Google OAuth Guide**: Complete OAuth setup and frontend integration

---

**CauseHive Backend** - Powering charitable giving with technology 🌟
