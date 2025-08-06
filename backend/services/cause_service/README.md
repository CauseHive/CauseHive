# Cause Service

A Django-based microservice for managing causes, events, and categories for the CauseHive platform. This service handles the creation, management, and organization of charitable causes and events that users can donate to.

## 🏗️ Architecture

This service is part of the CauseHive microservices architecture and handles:
- **Cause Management**: Creation, updating, and deletion of charitable causes
- **Category Management**: Organization of causes into categories
- **Event Scheduling**: Start and end date management for causes
- **Image Management**: Cover image handling for causes
- **Status Tracking**: Monitoring cause status (upcoming, ongoing, completed, cancelled)
- **Admin Operations**: Cause approval and status management for administrators

## 🎯 Features

### Cause Management
- Create new charitable causes with detailed information
- Update cause details and status
- Delete causes when needed
- Track fundraising progress (target vs current amount)
- Manage cause scheduling and location information
- Cause approval workflow for administrators

### Category System
- Organize causes into categories for better discoverability
- Create and manage cause categories
- Automatic slug generation for SEO-friendly URLs

### Status Management
- Track cause status: upcoming, ongoing, completed, cancelled, under_review
- Automatic status updates based on dates
- Progress tracking for fundraising goals
- Admin approval workflow for new causes

### Image Handling
- Upload and manage cover images for causes
- Automatic image storage and organization
- Support for cause visual representation

### Admin Features
- Review and approve pending causes
- Monitor cause status and progress
- Manage cause categories and organization

## �� API Endpoints

### Public Cause Endpoints
- `GET /causes/list/` - List all causes
- `GET /causes/details/<uuid:id>/` - Get specific cause details
- `GET /causes/categories/` - List all categories

### Organizer Endpoints
- `POST /causes/create/` - Create a new cause
- `PUT /causes/update/<uuid:id>/` - Update cause details
- `DELETE /causes/delete/<uuid:id>/` - Delete a cause

### Admin Endpoints
- `GET /causes/admin/causes/` - List all causes with admin data
- `PATCH /causes/admin/causes/<uuid:id>/status/` - Update cause status
- `GET /causes/admin/causes?status=under_review` - Get pending causes for review

## 📊 Data Models

### Cause Model
```python
class Causes(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    category = models.ForeignKey('categories.Category')
    description = models.TextField()
    organizer_id = models.UUIDField()
    target_amount = models.DecimalField()
    current_amount = models.DecimalField(default=0.00)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=255)
    status = models.CharField(choices=STATUS_CHOICES)
    cover_image = models.ImageField()
    created_at = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True)
```

**Status Options:**
- `under_review` - Cause is pending admin approval
- `upcoming` - Cause is scheduled but not yet started
- `ongoing` - Cause is currently active and accepting donations
- `completed` - Cause has finished successfully
- `cancelled` - Cause was cancelled

### Category Model
```python
class Category(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    slug = models.SlugField(unique=True)
```

## ⚒️ Workflow

### Cause Creation Flow
1. Organizer creates a new cause via `POST /causes/create/`
2. System validates organizer ID against User Service
3. Cause is created with 'under_review' status
4. Cover image is uploaded and stored
5. Slug is automatically generated from cause name
6. Admin reviews and approves the cause

### Cause Lifecycle
1. **Under Review**: Cause is created and awaiting admin approval
2. **Upcoming**: Cause is approved and scheduled
3. **Ongoing**: Cause becomes active (based on start_date)
4. **Completed**: Cause finishes (based on end_date or target reached)
5. **Cancelled**: Cause is cancelled by organizer or admin

### Admin Approval Workflow
1. Admin receives notification of new pending cause
2. Admin reviews cause details and documentation
3. Admin approves or rejects the cause
4. Status is updated accordingly
5. Organizer is notified of the decision

### Integration with Other Services
- Cause IDs are referenced by the donation processing service
- Current amount is updated when donations are received
- Status may change based on fundraising progress
- Admin reporting service monitors cause statistics

## ⚙️ Configuration

### External Service Integration
The service integrates with external services for validation:
- **User Service**: Validates organizer IDs and user permissions
- **Admin Reporting Service**: Provides cause data for analytics and reporting

### Image Storage
- Cover images are stored in `causes_images/` directory
- Automatic file organization and naming
- Support for various image formats

## 🔒 Security

- All sensitive data stored in environment variables
- UUID-based primary keys for enhanced security
- Proper permission validation for cause management
- Input validation and sanitization
- Slug generation prevents URL manipulation
- Admin-only access to approval endpoints

## 📈 Monitoring

### Key Metrics to Track
- Number of active causes
- Fundraising success rates
- Category popularity
- Image upload success rates
- API response times
- Cause approval rates and processing times

### Health Checks
- Database connectivity
- External service availability
- Image storage accessibility
- API endpoint responsiveness
- Admin notification system

## 🔧 Maintenance

### Regular Tasks
- Clean up expired causes
- Update cause statuses based on dates
- Monitor image storage usage
- Backup cause data
- Update category structure as needed
- Process admin notifications

### Data Management
- Archive completed causes
- Clean up unused images
- Optimize database queries
- Monitor storage growth
- Maintain cause approval queue

## �� Related Services

- **User Service**: User management and organizer validation
- **Donation Processing Service**: Handles donations for causes
- **Admin Reporting Service**: Analytics and reporting for causes
- **Frontend Application**: User interface for cause management