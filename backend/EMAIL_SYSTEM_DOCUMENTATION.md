# CauseHive Email System Documentation

## 📧 Overview

The CauseHive platform includes a comprehensive email notification system that sends beautifully designed HTML emails for various user actions and system events. All emails use a consistent design with the CauseHive branding and green color scheme.

## 🎨 Email Design

### Design Principles
- **Consistent Branding**: All emails feature the CauseHive logo and green color scheme (#2ac343)
- **Responsive Design**: Templates work across all email clients and devices
- **Professional Layout**: Clean, modern design with proper spacing and typography
- **Accessibility**: High contrast colors and readable fonts
- **Mobile-First**: Optimized for mobile email clients

### Color Scheme
- **Primary Green**: #2ac343 (CauseHive brand color)
- **Dark Green**: #20a836 (buttons and accents)
- **Background**: #f5f7fb (light gray background)
- **Text**: #1b1b1b (dark text for readability)
- **Secondary Text**: #6b7a88 (lighter text for secondary information)

## 📋 Email Types

### 1. Account Verification Email
**File**: `templates/email/verification_email.html`
**Triggered**: When a user registers for a new account
**Purpose**: Verify the user's email address to activate their account

**Features**:
- Professional welcome message
- Verification link with 30-minute expiry
- Clear instructions for account activation
- Support contact information

**Context Variables**:
- `first_name` - User's first name
- `verification_url` - Link to verify email
- `expires_at` - Expiration time (human-readable)
- `now` - Current timestamp
- `support_email` - Support contact email

### 2. Password Reset Email
**File**: `templates/email/password_reset_email.html`
**Triggered**: When a user requests a password reset
**Purpose**: Provide a secure link to reset the user's password

**Features**:
- Clear password reset instructions
- Secure reset link with expiration
- Security reminders
- Support contact information

**Context Variables**:
- `first_name` - User's first name
- `reset_url` - Link to reset password
- `expires_at` - Expiration time (human-readable)
- `now` - Current timestamp
- `support_email` - Support contact email

### 3. Donation Success Email
**File**: `templates/email/donation_successful.html`
**Triggered**: When a donation is successfully processed
**Purpose**: Confirm the donation and provide receipt information

**Features**:
- Donation confirmation with amount and cause details
- Professional receipt-style design
- Cause information and impact details
- Thank you message

**Context Variables**:
- `first_name` - Donor's first name
- `amount` - Donation amount
- `currency` - Currency symbol (₵)
- `cause_name` - Name of the cause
- `donated_at` - Donation timestamp
- `now` - Current timestamp
- `support_email` - Support contact email

### 4. Withdrawal Processed Email
**File**: `templates/email/withdrawal_processed.html`
**Triggered**: When a withdrawal request is successfully processed
**Purpose**: Confirm the withdrawal and provide transaction details

**Features**:
- Withdrawal confirmation with amount and processing details
- Transaction reference information
- Professional financial notification design
- Processing timeline information

**Context Variables**:
- `first_name` - User's first name
- `amount` - Withdrawal amount
- `currency` - Currency symbol (₵)
- `processed_at` - Processing timestamp
- `now` - Current timestamp
- `support_email` - Support contact email

### 5. Cause Approval Email
**File**: `templates/email/cause_approved.html`
**Triggered**: When an admin approves a cause for publication
**Purpose**: Notify the organizer that their cause is now live

**Features**:
- Congratulations message for cause organizers
- Cause details and target amount
- Direct link to view the live cause
- Encouragement to share the cause
- Category information

**Context Variables**:
- `organizer_name` - Organizer's first name
- `cause_name` - Name of the cause
- `target_amount` - Target amount for the cause
- `currency` - Currency symbol (₵)
- `category_name` - Cause category
- `cause_url` - Link to view the cause
- `now` - Current timestamp
- `support_email` - Support contact email

### 6. Cause Rejection Email
**File**: `templates/email/cause_rejected.html`
**Triggered**: When an admin rejects a cause submission
**Purpose**: Notify the organizer that their cause was rejected

**Features**:
- Professional rejection notification
- Rejection reason (if provided)
- Encouragement to create a new cause
- Link to create a new cause
- Support contact information

**Context Variables**:
- `organizer_name` - Organizer's first name
- `cause_name` - Name of the cause
- `target_amount` - Target amount for the cause
- `currency` - Currency symbol (₵)
- `category_name` - Cause category
- `rejection_reason` - Reason for rejection
- `create_new_cause_url` - Link to create a new cause
- `now` - Current timestamp
- `support_email` - Support contact email

## ⚙️ Configuration

### SMTP Settings
```python
# settings.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # or your SMTP provider
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@domain.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'CauseHive <no-reply@causehive.tech>'
SUPPORT_EMAIL = 'support@causehive.tech'
```

### Environment Variables
```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=True
EMAIL_PORT=587
DEFAULT_FROM_EMAIL=CauseHive <no-reply@causehive.tech>
SUPPORT_EMAIL=support@causehive.tech
```

## 🔧 Email Utility Functions

### User Authentication Emails
**File**: `users_n_auth/email_utils.py`

```python
from users_n_auth.email_utils import send_account_verification_email, send_password_reset_email

# Send verification email
send_account_verification_email(
    to_email="user@example.com",
    first_name="John",
    verification_url="https://causehive.tech/verify/uid/token/"
)

# Send password reset email
send_password_reset_email(
    to_email="user@example.com",
    first_name="John",
    reset_url="https://causehive.tech/reset/uid/token/"
)
```

### Donation Emails
**File**: `donations/email_utils.py`

```python
from donations.email_utils import send_donation_success_email

send_donation_success_email(
    to_email="donor@example.com",
    first_name="John",
    amount=100.00,
    currency="₵",
    cause_name="Build a School",
    donated_at=timezone.now()
)
```

### Withdrawal Emails
**File**: `withdrawal_transfer/email_utils.py`

```python
from withdrawal_transfer.email_utils import send_withdrawal_processed_email

send_withdrawal_processed_email(
    to_email="user@example.com",
    first_name="John",
    amount=500.00,
    currency="₵",
    processed_at=timezone.now()
)
```

### Cause Management Emails
**File**: `causes/email_utils.py`

```python
from causes.email_utils import send_cause_approved_email, send_cause_rejected_email

# Send approval email
send_cause_approved_email(
    to_email="organizer@example.com",
    organizer_name="Jane",
    cause_name="Community Center",
    target_amount=10000.00,
    category_name="Community Development",
    cause_url="https://causehive.tech/causes/uuid/"
)

# Send rejection email
send_cause_rejected_email(
    to_email="organizer@example.com",
    organizer_name="Jane",
    cause_name="Community Center",
    target_amount=10000.00,
    category_name="Community Development",
    rejection_reason="Incomplete documentation"
)
```

## 📤 Email Sending Process

### 1. Template Rendering
- Templates are rendered using Django's template engine
- Context variables are passed to populate dynamic content
- HTML and plain text versions are generated

### 2. Email Construction
- `EmailMultiAlternatives` is used for HTML emails
- Plain text version is auto-generated from HTML
- Proper headers and metadata are set

### 3. Delivery
- Emails are sent via SMTP
- Delivery status is tracked
- Error handling for failed deliveries

### 4. Response Handling
- Functions return integer indicating emails sent
- `1` = Success, `0` = Failure
- Exceptions raised for critical failures

## 🧪 Testing

### Django Shell Testing
```python
# Test verification email
from users_n_auth.email_utils import send_account_verification_email
send_account_verification_email(
    to_email="test@example.com",
    first_name="Test User",
    verification_url="https://example.com/verify/test/"
)

# Test donation email
from donations.email_utils import send_donation_success_email
send_donation_success_email(
    to_email="test@example.com",
    first_name="Test User",
    amount=100.00,
    currency="₵",
    cause_name="Test Cause",
    donated_at=timezone.now()
)
```

### Email Client Testing
- Test emails in different email clients (Gmail, Outlook, Apple Mail)
- Verify responsive design on mobile devices
- Check spam folder placement
- Test with different email providers

## 🚨 Error Handling

### Common Issues
1. **SMTP Authentication Errors**: Check credentials and app passwords
2. **Template Rendering Errors**: Verify context variables
3. **Email Delivery Failures**: Check SMTP settings and network
4. **Spam Filtering**: Monitor email deliverability

### Debugging
```python
# Enable debug mode for email testing
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Check email content in console
python manage.py shell
from users_n_auth.email_utils import send_account_verification_email
send_account_verification_email(...)
```

## 📊 Monitoring

### Email Delivery Tracking
- Monitor SMTP logs for delivery status
- Track bounce rates and delivery failures
- Monitor spam complaints

### Performance Metrics
- Email sending response times
- Template rendering performance
- SMTP connection stability

## 🔒 Security Considerations

### Email Security
- Use TLS/SSL for SMTP connections
- Implement rate limiting for email sending
- Validate email addresses before sending
- Use secure token generation for verification links

### Privacy
- Don't include sensitive information in emails
- Use secure links with expiration times
- Implement proper access controls

## 🚀 Production Deployment

### SMTP Provider Setup
1. **Gmail**: Use App Passwords for authentication
2. **SendGrid**: Configure API keys and domain authentication
3. **Amazon SES**: Set up verified domains and credentials
4. **Mailgun**: Configure domain and API keys

### Monitoring Setup
- Set up email delivery monitoring
- Configure alerts for delivery failures
- Monitor bounce rates and spam complaints

### Performance Optimization
- Use connection pooling for SMTP
- Implement email queuing for high volume
- Cache template rendering when possible

## 📚 Best Practices

### Email Design
- Keep subject lines clear and concise
- Use alt text for images
- Test across multiple email clients
- Maintain consistent branding

### Content
- Use clear, actionable language
- Include relevant contact information
- Provide clear next steps
- Keep emails concise but informative

### Technical
- Use proper email headers
- Implement proper error handling
- Monitor delivery rates
- Keep templates maintainable

---

**CauseHive Email System** - Professional, reliable, and beautifully designed email notifications 🌟
