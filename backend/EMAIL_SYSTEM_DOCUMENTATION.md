# CauseHive Email System Documentation

## Overview
The CauseHive email system handles all email communications including user registration, donation confirmations, cause approvals, and administrative notifications.

## Email Configuration

### Environment Variables Required
```bash
EMAIL_HOST_USER=your-email@zoho.com
EMAIL_HOST_PASSWORD=your-app-password
SUPPORT_EMAIL=support@causehive.tech
```

### SMTP Settings
- **Provider**: Zoho Mail
- **Host**: smtp.zoho.com
- **Port**: 587
- **Security**: TLS
- **Authentication**: SMTP with app password

### Django Email Backend Configuration
```python
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.zoho.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = f"CauseHive <{EMAIL_HOST_USER}>"
SUPPORT_EMAIL = env("SUPPORT_EMAIL")
```

## Email Templates

### Template Locations
All email templates are located in: `backend/templates/email/`

### Available Templates
1. **`verification_email.html`** - Email verification for new users
2. **`password_reset_email.html`** - Password reset instructions
3. **`donation_successful.html`** - Donation confirmation email
4. **`cause_approved.html`** - Cause approval notification
5. **`cause_rejected.html`** - Cause rejection notification
6. **`withdrawal_processed.html`** - Withdrawal completion notification

## Email Functions

### User Registration & Authentication
- **Email Verification**: Sent when users register
- **Password Reset**: Sent when users request password reset
- **Login Notifications**: Optional login confirmations

### Donation System
- **Donation Confirmation**: Sent to donors after successful donation
- **Donation Receipt**: Detailed receipt with transaction information
- **Cause Updates**: Notifications about cause progress

### Cause Management
- **Cause Approval**: Sent to cause creators when cause is approved
- **Cause Rejection**: Sent with rejection reason when cause is rejected
- **Cause Updates**: Regular updates about cause progress

### Financial Operations
- **Withdrawal Notifications**: Sent when withdrawals are processed
- **Payment Confirmations**: Sent for all financial transactions

## Email Sending Implementation

### Celery Background Tasks
All emails are sent asynchronously using Celery to prevent blocking web requests:

```python
from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string

@shared_task
def send_donation_confirmation_email(donation_id):
    # Send donation confirmation email
    pass

@shared_task
def send_cause_approval_email(cause_id):
    # Send cause approval email
    pass
```

### Email Utility Functions
Located in: `backend/users_n_auth/email_utils.py`, `backend/causes/email_utils.py`, etc.

## Production Setup

### Railway Deployment
The email system is configured for production deployment on Railway:

1. **Environment Variables**: Set in Railway dashboard
2. **Celery Worker**: Runs in background to process email tasks
3. **Database Fallback**: Uses database broker when Redis unavailable
4. **Error Handling**: Comprehensive error handling and logging

### Email Queue Management
- **Celery Worker**: Processes email tasks asynchronously
- **Retry Logic**: Failed emails are retried automatically
- **Dead Letter Queue**: Failed emails are logged for manual review

## Email Content Guidelines

### Branding
- **From Name**: "CauseHive"
- **From Email**: Uses configured EMAIL_HOST_USER
- **Reply-To**: SUPPORT_EMAIL for user inquiries

### Content Standards
- **Professional Tone**: Clear, helpful, and professional
- **Call-to-Action**: Clear next steps for users
- **Unsubscribe**: Include unsubscribe links where appropriate
- **Mobile Responsive**: Templates work on all devices

## Monitoring & Logging

### Email Delivery Tracking
- **Success Logs**: Successful email deliveries
- **Failure Logs**: Failed deliveries with error details
- **Retry Attempts**: Track retry attempts for failed emails

### Performance Metrics
- **Delivery Rate**: Percentage of successful deliveries
- **Response Time**: Time from trigger to delivery
- **Queue Length**: Number of pending email tasks

## Troubleshooting

### Common Issues
1. **SMTP Authentication Failed**
   - Check EMAIL_HOST_USER and EMAIL_HOST_PASSWORD
   - Verify Zoho app password is correct
   - Ensure 2FA is enabled on Zoho account

2. **Emails Not Sending**
   - Check Celery worker is running
   - Verify email templates exist
   - Check Django logs for errors

3. **Emails Going to Spam**
   - Verify SPF, DKIM, and DMARC records
   - Use proper from address
   - Avoid spam trigger words

### Debug Mode
Enable debug logging for email issues:
```python
LOGGING = {
    'loggers': {
        'django.core.mail': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

## Security Considerations

### Email Security
- **TLS Encryption**: All emails sent over TLS
- **App Passwords**: Use app-specific passwords, not account passwords
- **Rate Limiting**: Prevent email spam and abuse
- **Input Validation**: Sanitize all email content

### Privacy Compliance
- **GDPR Compliance**: Include unsubscribe options
- **Data Protection**: Secure handling of email addresses
- **Audit Trail**: Log all email activities

## Future Enhancements

### Planned Features
1. **Email Templates Editor**: Admin interface for editing templates
2. **Email Analytics**: Track open rates and click-through rates
3. **A/B Testing**: Test different email content
4. **Email Scheduling**: Schedule emails for optimal delivery times
5. **Multi-language Support**: Support for multiple languages

### Integration Opportunities
1. **Email Marketing**: Integration with Mailchimp or similar
2. **Transactional Emails**: Use services like SendGrid or Mailgun
3. **Email Automation**: Automated email sequences
4. **Push Notifications**: Complement emails with push notifications

## Support

For email system issues:
- **Technical Issues**: Check Django and Celery logs
- **Delivery Issues**: Verify SMTP configuration
- **Template Issues**: Check template syntax and variables
- **Performance Issues**: Monitor Celery worker performance

## Version History
- **v1.0**: Initial email system with basic templates
- **v1.1**: Added Celery background processing
- **v1.2**: Added comprehensive error handling
- **v1.3**: Added production Railway deployment support
