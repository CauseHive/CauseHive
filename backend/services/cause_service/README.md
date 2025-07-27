# Cause Service

A Django-based microservice for managing causes, events, and categories for the CauseHive platform. This service handles the creation, management, and organization of charitable causes and events that users can donate to.

## 🏗️ Architecture

This service is part of the CauseHive microservices architecture and handles:
- **Cause Management**: Creation, updating, and deletion of charitable causes
- **Category Management**: Organization of causes into categories
- **Event Scheduling**: Start and end date management for causes
- **Image Management**: Cover image handling for causes
- **Status Tracking**: Monitoring cause status (upcoming, ongoing, completed, cancelled)

## 🎯 Features

### Cause Management
- Create new charitable causes with detailed information
- Update cause details and status
- Delete causes when needed
- Track fundraising progress (target vs current amount)
- Manage cause scheduling and location information

### Category System
- Organize causes into categories for better discoverability
- Create and manage cause categories
- Automatic slug generation for SEO-friendly URLs

### Status Management
- Track cause status: upcoming, ongoing, completed, cancelled
- Automatic status updates based on dates
- Progress tracking for fundraising goals

### Image Handling
- Upload and manage cover images for causes
- Automatic image storage and organization
- Support for cause visual representation

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL
- External services:
  - User Service (for organizer validation)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cause_service
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   # or using uv
   uv sync
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   # Django
   SECRET_KEY=your-django-secret-key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1

   # Database
   DB_NAME=cause_service
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432

   # External Services
   USER_SERVICE_URL=http://localhost:8000/user/api/auth
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

## �� API Endpoints

### Cause Endpoints
- `GET /causes/list/` - List all causes
- `POST /causes/create/` - Create a new cause
- `GET /causes/details/<uuid:id>/` - Get specific cause details
- `DELETE /causes/delete/<uuid:id>/` - Delete a cause

### Category Endpoints
- Category management endpoints (CRUD operations)
- Category listing and filtering

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

## 🔄 Workflow

### Cause Creation Flow
1. Organizer creates a new cause via `POST /causes/create/`
2. System validates organizer ID against User Service
3. Cause is created with 'upcoming' status
4. Cover image is uploaded and stored
5. Slug is automatically generated from cause name

### Cause Lifecycle
1. **Upcoming**: Cause is created and scheduled
2. **Ongoing**: Cause becomes active (based on start_date)
3. **Completed**: Cause finishes (based on end_date or target reached)
4. **Cancelled**: Cause is cancelled by organizer

### Integration with Donation Service
- Cause IDs are referenced by the donation processing service
- Current amount is updated when donations are received
- Status may change based on fundraising progress

## ⚙️ Configuration

### External Service Integration
The service integrates with external services for validation:
- **User Service**: Validates organizer IDs and user permissions

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

```

### Database Configuration
```env
DB_NAME=cause_service_prod
DB_USER=production_user
DB_PASSWORD=secure_password
DB_HOST=your-db-host
DB_PORT=5432
```

## 📈 Monitoring

### Key Metrics to Track
- Number of active causes
- Fundraising success rates
- Category popularity
- Image upload success rates
- API response times

### Health Checks
- Database connectivity
- External service availability
- Image storage accessibility
- API endpoint responsiveness

## 🔧 Maintenance

### Regular Tasks
- Clean up expired causes
- Update cause statuses based on dates
- Monitor image storage usage
- Backup cause data
- Update category structure as needed

### Data Management
- Archive completed causes
- Clean up unused images
- Optimize database queries
- Monitor storage growth


## �� Related Services

- **User Service**: User management and authentication
- **Donation Processing Service**: Handles donations for causes
- **Frontend Application**: User interface for cause management