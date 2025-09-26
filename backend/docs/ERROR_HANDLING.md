# CauseHive Error Handling System

## Overview

The CauseHive backend includes a comprehensive error handling system that provides:
- Custom error pages for web requests
- JSON error responses for API requests
- Detailed logging and monitoring
- Security headers and middleware
- Production-ready error handling

## Components

### 1. Custom Error Views (`causehive/error_views.py`)

Provides custom error handlers for different HTTP status codes:

- **404 Not Found**: `handler404`
- **500 Internal Server Error**: `handler500` 
- **403 Forbidden**: `handler403`
- **400 Bad Request**: `handler400`

**Features:**
- Automatic detection of API vs web requests
- JSON responses for API routes (`/api/*`)
- HTML error pages for web routes
- Debug information in development mode
- Clean error messages in production

### 2. Error Templates (`templates/errors/`)

Beautiful, responsive error pages:

- `404.html` - Page Not Found (blue theme)
- `500.html` - Server Error (red theme) 
- `403.html` - Access Forbidden (yellow theme)
- `400.html` - Bad Request (gray theme)

**Features:**
- Mobile-responsive design
- CauseHive branding
- Debug information panel (development only)
- Return home and retry buttons
- Consistent styling with gradients and animations

### 3. Custom Middleware (`causehive/middleware.py`)

Three middleware classes for comprehensive error handling:

#### ErrorHandlingMiddleware
- Catches unhandled exceptions
- Provides detailed logging with context
- Returns appropriate JSON/HTML responses
- Includes debug information in development

#### SecurityHeadersMiddleware
- Adds security headers in production
- Configures CORS headers for API requests
- Prevents XSS, clickjacking, and other attacks

#### RequestLoggingMiddleware
- Logs incoming requests and responses
- Tracks user activity and performance
- Includes IP address and user agent logging
- Debug-level logging in development

### 4. Logging Configuration

Enhanced logging system:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        # File logging in production
    },
    'loggers': {
        'causehive': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
    },
}
```

### 5. Production Settings (`causehive/settings_production.py`)

Production-optimized configuration:

- `DEBUG = False`
- Enhanced security headers
- File-based error logging with rotation
- Email notifications for critical errors
- Optimized static file handling

## Usage

### Development Mode

With `DEBUG = True`:
- Detailed error pages with stack traces
- Debug information panels
- Console logging only
- Permissive security settings

### Production Mode  

With `DEBUG = False`:
- Clean, user-friendly error pages
- File-based error logging
- Email notifications for errors
- Enhanced security headers
- Optimized performance

### Testing Error Handling

Use the custom management command:

```bash
# Test all error types
python manage.py test_error_handling

# Test specific error type
python manage.py test_error_handling --test-type=404
python manage.py test_error_handling --test-type=api
```

## API Error Responses

### JSON Error Format

All API errors return consistent JSON structure:

```json
{
  "error": "Error Type",
  "message": "Human-readable error description",
  "status_code": 404,
  "path": "/api/nonexistent-endpoint/"
}
```

### Debug Mode Extensions

In development, API errors include additional debug information:

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "status_code": 500,
  "path": "/api/causes/",
  "exception_type": "ValueError", 
  "exception_message": "Invalid input data",
  "traceback": ["...", "..."]
}
```

## Health Check Endpoints

### Status Check (`/api/status/`)
Simple health check for monitoring:

```json
{
  "status": "healthy",
  "service": "causehive-backend", 
  "debug_mode": true
}
```

### Health Check (`/api/health/`)
Comprehensive health check including database connections.

### Readiness Check (`/api/ready/`)
Kubernetes-style readiness probe.

## Error Page Features

### Visual Design
- Modern, clean interface
- Responsive design for all devices
- CauseHive branding with logo
- Color-coded themes by error type
- Smooth animations and hover effects

### Functionality
- Return Home button
- Try Again button (for 500 errors)
- Debug information panel (development)
- Error code and description
- Request path display

### Security
- No sensitive information exposed
- Consistent error messages
- Debug info only in development
- Protection against information disclosure

## Deployment

### Environment Variables

```bash
# Production deployment
DEBUG=False
ALLOWED_HOSTS=causehive.tech,www.causehive.tech
EMAIL_HOST=smtp.example.com
EMAIL_HOST_USER=alerts@causehive.tech
ADMIN_EMAIL=admin@causehive.tech
```

### Settings Configuration

Use different settings for production:

```python
# Production
DJANGO_SETTINGS_MODULE=causehive.settings_production

# Development  
DJANGO_SETTINGS_MODULE=causehive.settings
```

## Monitoring and Alerts

### Log Files
- Error logs: `/tmp/causehive_error.log` (production)
- Log rotation: 5MB files, 5 backups
- Console output for development

### Error Notifications
- Email alerts for critical errors (production)
- Admin notifications for 500 errors
- Context information included

### Metrics
- Request/response logging
- Error rate tracking
- Performance monitoring
- User activity logs

## Security Features

### Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### CORS
- Configured for frontend domain
- Credentials allowed for authenticated requests
- Proper preflight handling

### Error Information
- No stack traces in production
- Generic error messages for users
- Detailed logging for developers
- Context preservation for debugging

## Testing

The error handling system includes comprehensive tests:

1. **Unit Tests**: Individual component testing
2. **Integration Tests**: End-to-end error handling
3. **Management Command**: `test_error_handling`
4. **Manual Testing**: Browser verification

## Best Practices

1. **Always use custom error handlers** for consistent UX
2. **Log errors with sufficient context** for debugging
3. **Return appropriate status codes** for different scenarios
4. **Provide helpful error messages** without exposing internals
5. **Test error handling** in both development and production
6. **Monitor error rates** and patterns for system health
7. **Use security headers** to protect against attacks
8. **Implement graceful degradation** for service failures

## Troubleshooting

### Common Issues

1. **Templates not found**: Ensure `templates/errors/` directory exists
2. **JSON not returned for API**: Check error handler path detection
3. **Logging errors**: Verify log directory permissions
4. **Security headers missing**: Confirm middleware order
5. **Debug info in production**: Check DEBUG setting

### Debugging Steps

1. Check Django logs for error details
2. Verify middleware configuration
3. Test error handlers with management command
4. Review allowed hosts configuration
5. Validate template paths and context

## Future Enhancements

1. **Error aggregation** and analysis dashboard
2. **Custom error pages** for specific error types
3. **Rate limiting** for error responses
4. **Integration** with external monitoring services
5. **Automated testing** for error scenarios
6. **Performance optimization** for error handling
7. **Multi-language** error messages