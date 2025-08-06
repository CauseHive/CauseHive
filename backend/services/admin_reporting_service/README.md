# Admin Reporting Service

A Django-based microservice for comprehensive analytics, reporting, and administrative oversight of the CauseHive platform. This service aggregates data from all microservices to provide insights, monitoring, and administrative controls.

## 🏗️ Architecture

This service is part of the CauseHive microservices architecture and handles:
- **Data Aggregation**: Collects and consolidates data from all microservices
- **Analytics Dashboard**: Provides comprehensive insights and metrics
- **Administrative Controls**: Cause approval, withdrawal management, and system oversight
- **Audit Logging**: Tracks administrative actions and system changes
- **Notification Management**: Handles admin notifications and alerts
- **Background Processing**: Scheduled data collection and report generation

## 🎯 Features

### Analytics & Reporting
- **Dashboard Metrics**: Real-time platform statistics and KPIs
- **User Analytics**: User registration, activity, and engagement metrics
- **Donation Analytics**: Donation trends, success rates, and financial insights
- **Cause Analytics**: Cause performance, category analysis, and fundraising metrics
- **Withdrawal Analytics**: Withdrawal processing statistics and trends
- **Financial Reporting**: Revenue tracking and financial performance

### Administrative Controls
- **Cause Management**: Review, approve, and manage charitable causes
- **Withdrawal Oversight**: Monitor and manage withdrawal requests
- **User Management**: User account oversight and management
- **System Monitoring**: Platform health and performance monitoring

### Audit & Compliance
- **Action Logging**: Track all administrative actions and changes
- **Audit Trails**: Complete history of system modifications
- **Compliance Reporting**: Generate reports for regulatory compliance
- **Security Monitoring**: Monitor for suspicious activities

### Notification System
- **Admin Notifications**: Alert administrators of important events
- **Pending Cause Alerts**: Notify when new causes need review
- **System Alerts**: Platform health and performance notifications
- **Withdrawal Notifications**: Alert on withdrawal status changes

## �� API Endpoints

### Dashboard Endpoints
- `GET /admin/dashboard/metrics/` - Get comprehensive platform metrics
- `GET /admin/dashboard/users/` - Get user analytics and statistics
- `GET /admin/dashboard/donations/` - Get donation analytics
- `GET /admin/dashboard/causes/` - Get cause analytics
- `GET /admin/dashboard/withdrawals/` - Get withdrawal analytics
- `GET /admin/dashboard/payments/` - Get payment analytics

### Administrative Endpoints
- `GET /admin/management/causes/` - List all causes for management
- `PATCH /admin/management/causes/<id>/status/` - Update cause status
- `GET /admin/management/withdrawals/` - List withdrawal requests
- `POST /admin/management/withdrawals/retry/<id>/` - Retry failed withdrawal

### Audit Endpoints
- `GET /admin/audit/logs/` - Get audit logs
- `GET /admin/audit/actions/` - Get administrative actions

### Notification Endpoints
- `GET /admin/notifications/` - Get admin notifications
- `PATCH /admin/notifications/<id>/read/` - Mark notification as read

## �� Data Models

### CachedReportData Model
```python
class CachedReportData(models.Model):
    id = models.UUIDField(primary_key=True)
    report_type = models.CharField(max_length=100)
    data = models.JSONField()
    generated_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
```

### AdminNotification Model
```python
class AdminNotification(models.Model):
    id = models.UUIDField(primary_key=True)
    notif_type = models.CharField(max_length=50)
    entity_id = models.CharField(max_length=100)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

### AuditLog Model
```python
class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    entity_type = models.CharField(max_length=50)
    entity_id = models.CharField(max_length=100)
    action = models.CharField(max_length=50)
    reason = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    extra_data = models.JSONField(null=True, blank=True)
```

## ⚒️ Workflow

### Data Collection Workflow
1. Scheduled Celery task runs every hour
2. Service fetches data from all microservices
3. Data is processed and aggregated
4. Results are cached for quick access
5. Dashboard metrics are updated

### Cause Approval Workflow
1. Admin receives notification of pending cause
2. Admin reviews cause details and documentation
3. Admin approves or rejects the cause
4. Action is logged in audit trail
5. Organizer is notified of the decision

### Withdrawal Management Workflow
1. Admin monitors withdrawal requests
2. Failed withdrawals are flagged for review
3. Admin can retry failed withdrawals
4. All actions are logged for audit purposes
5. System notifications are sent as needed

### Notification Processing
1. System events trigger notification creation
2. Notifications are stored in database
3. Admins receive real-time alerts
4. Notifications can be marked as read
5. Historical notification data is maintained

## ⚙️ Configuration

### Environment Variables
```env
# Django
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=admin_reporting_service
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# External Services
USER_SERVICE_URL=http://localhost:8000/user
CAUSE_SERVICE_URL=http://localhost:8001/causes
DONATION_SERVICE_URL=http://localhost:8002

# Celery Configuration
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2
```

### Celery Configuration
- **Background Tasks**: Scheduled data collection and processing
- **Beat Scheduler**: Hourly report generation and data aggregation
- **Task Queues**: Separate queues for different types of processing

### External Service Integration
The service integrates with all microservices:
- **User Service**: User data and authentication
- **Cause Service**: Cause management and approval
- **Donation Processing Service**: Donations, payments, and withdrawals

## 📈 Monitoring

### Key Metrics to Track
- Platform user growth and engagement
- Donation success rates and trends
- Cause performance and fundraising success
- Withdrawal processing efficiency
- System response times and availability
- Administrative action frequency

### Health Checks
- Database connectivity and performance
- External service availability
- Celery task execution status
- Cache hit rates and performance
- API endpoint responsiveness

## 🔒 Security

- **JWT Authentication**: Secure access to admin endpoints
- **Role-Based Access**: Admin-only access to sensitive operations
- **Audit Logging**: Complete tracking of all administrative actions
- **Data Encryption**: Sensitive data encryption at rest and in transit
- **Rate Limiting**: Protection against abuse and attacks

## 🔄 Background Processing

### Scheduled Tasks
- **Hourly Data Aggregation**: Collect and process data from all services
- **Daily Report Generation**: Generate comprehensive daily reports
- **Weekly Analytics**: Process weekly trends and insights
- **Monthly Summaries**: Generate monthly performance summaries

### Real-Time Processing
- **Notification Handling**: Process and deliver admin notifications
- **Audit Logging**: Log administrative actions in real-time
- **Status Updates**: Update dashboard metrics as events occur

## �� Related Services

- **User Service**: User management and authentication
- **Cause Service**: Cause management and approval workflow
- **Donation Processing Service**: Financial data and withdrawal management
- **Frontend Application**: Admin dashboard interface