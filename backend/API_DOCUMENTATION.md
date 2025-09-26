# CauseHive API Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL & Headers](#base-url--headers)
4. [Error Handling](#error-handling)
5. [User Authentication APIs](#user-authentication-apis)
6. [Email Notification System](#email-notification-system)
7. [User Profile APIs](#user-profile-apis)
8. [Cause Management APIs](#cause-management-apis)
9. [Donation APIs](#donation-apis)
10. [Payment APIs](#payment-apis)
11. [Admin APIs](#admin-apis)
12. [Notification APIs](#notification-apis)
13. [Category APIs](#category-apis)
14. [Cart APIs](#cart-apis)
15. [Withdrawal APIs](#withdrawal-apis)
16. [Response Examples](#response-examples)
17. [Rate Limiting](#rate-limiting)
18. [Webhooks](#webhooks)

## Overview

The CauseHive API is a RESTful service built with Django REST Framework that enables users to create, discover, and support charitable causes. The API supports JWT authentication, Google OAuth integration, and comprehensive payment processing through Paystack.

### Key Features
- **JWT Authentication** with refresh token support
- **Google OAuth 2.0** integration
- **Email Verification System** with beautiful HTML templates
- **Cause Management** with approval workflow
- **Donation Processing** via Paystack
- **Real-time Notifications**
- **Comprehensive Email System** with 6 different email types
- **Admin Dashboard** with analytics
- **Multi-currency Support** (Ghanaian Cedi)
- **User-Specific Donation Filtering** - Users only see their own donations
- **Optimized Database Queries** with proper `select_related` usage
- **Rich Nested API Responses** with cause, donor, and recipient details

## Authentication

### JWT Authentication
Most endpoints require JWT authentication. Include the access token in the Authorization header:

```http
Authorization: Bearer <access_token>
```

### Google OAuth Flow
1. Get OAuth URL: `GET /api/user/google/url/`
2. User authorizes on Google
3. Google redirects to callback with authorization code
4. Backend exchanges code for JWT tokens
5. User is redirected to profile with access token

### Token Types
- **Access Token**: Short-lived (1 hour), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens

## Base URL & Headers

### Base URL
```
Development: http://127.0.0.1:8000/api
Production: https://yourdomain.com/api
```

### Required Headers
```http
Content-Type: application/json
Authorization: Bearer <access_token>  # For authenticated endpoints
```

### Optional Headers
```http
Accept: application/json
X-Requested-With: XMLHttpRequest
```

## Error Handling

### Error Response Format
```json
{
  "error": "Error message",
  "detail": "Detailed error description",
  "code": "ERROR_CODE",
  "field_errors": {
    "field_name": ["Field-specific error message"]
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `405` - Method Not Allowed
- `429` - Too Many Requests
- `500` - Internal Server Error

### Common Error Codes
- `INVALID_CREDENTIALS` - Invalid email/password
- `TOKEN_EXPIRED` - JWT token has expired
- `INVALID_TOKEN` - Invalid or malformed token
- `PERMISSION_DENIED` - Insufficient permissions
- `VALIDATION_ERROR` - Request data validation failed
- `PAYMENT_FAILED` - Payment processing failed

---

## User Authentication APIs

### Register User
```http
POST /api/user/auth/signup/
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "user@example.com",
  "password": "securepassword123",
  "password2": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "date_joined": "2025-09-14T10:30:00Z"
  }
}
```

### Login User
```http
POST /api/user/auth/login/
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true
  }
}
```

### Logout User
```http
POST /api/user/auth/logout/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

### Refresh Token
```http
POST /api/user/auth/token/refresh/
```

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Google OAuth URL
```http
GET /api/user/google/url/
```

**Response:**
```json
{
  "google_oauth_url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...",
  "message": "Use this URL to initiate Google OAuth flow"
}
```

### Google OAuth Callback
```http
GET /api/user/google/callback/?code=AUTHORIZATION_CODE
```

**Description:** Handles Google OAuth callback and redirects to profile with access token.

**Redirect URL:** `/api/user/profile/?access_token=JWT_TOKEN`

### Verify Account Email
```http
GET /api/user/auth/verify/{uid}/{token}/
```

**Description:**
Verifies a user's email address using the verification link sent during registration. This endpoint is typically called by the frontend when a user clicks the verification link in their email.

**Response:**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "user_uuid",
    "email": "user@example.com",
    "is_active": true,
    "is_verified": true
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid verification link",
  "detail": "The verification link has expired or is invalid"
}
```

### Resend Verification Email
```http
POST /api/user/auth/resend-verification/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification email sent successfully"
}
```

### Request Password Reset
```http
POST /api/user/auth/password-reset/
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent"
}
```

### Confirm Password Reset
```http
POST /api/user/auth/password-reset-confirm/
```

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

---

## Email Notification System

### Overview
The CauseHive platform includes a comprehensive email notification system that sends beautifully designed HTML emails for various user actions and system events. All emails use a consistent design with the CauseHive branding and green color scheme.

### Email Types

#### 1. Account Verification Email
**Triggered:** When a user registers for a new account
**Template:** `templates/email/verification_email.html`
**Features:**
- Professional HTML design with CauseHive branding
- Verification link with 30-minute expiry
- Responsive design for all email clients
- Fallback plain text version

#### 2. Password Reset Email
**Triggered:** When a user requests a password reset
**Template:** `templates/email/password_reset_email.html`
**Features:**
- Secure password reset link
- Clear instructions for password reset
- Consistent branding with other emails

#### 3. Donation Success Email
**Triggered:** When a donation is successfully processed
**Template:** `templates/email/donation_successful.html`
**Features:**
- Donation confirmation with amount and cause details
- Professional receipt-style design
- Cause information and impact details

#### 4. Withdrawal Processed Email
**Triggered:** When a withdrawal request is successfully processed
**Template:** `templates/email/withdrawal_processed.html`
**Features:**
- Withdrawal confirmation with amount and processing details
- Transaction reference information
- Professional financial notification design

#### 5. Cause Approval Email
**Triggered:** When an admin approves a cause for publication
**Template:** `templates/email/cause_approved.html`
**Features:**
- Congratulations message for cause organizers
- Cause details and target amount
- Direct link to view the live cause
- Encouragement to share the cause

#### 6. Cause Rejection Email
**Triggered:** When an admin rejects a cause submission
**Template:** `templates/email/cause_rejected.html`
**Features:**
- Professional rejection notification
- Rejection reason (if provided)
- Encouragement to create a new cause
- Link to create a new cause

### Email Configuration

#### SMTP Settings
```python
# settings.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.zoho.com'  # or your SMTP provider
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@domain.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'CauseHive <no-reply@causehive.tech>'
SUPPORT_EMAIL = 'support@causehive.tech'
```

#### Email Templates
All email templates are located in `templates/email/` and use Django template syntax with the following common context variables:
- `first_name` or `organizer_name` - User's first name
- `now` - Current timestamp
- `support_email` - Support contact email
- `logo_src` - Logo URL (hardcoded in templates)

### Email Sending Functions

#### User Authentication Emails
```python
# users_n_auth/email_utils.py
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

#### Donation Emails
```python
# donations/email_utils.py
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

#### Withdrawal Emails
```python
# withdrawal_transfer/email_utils.py
from withdrawal_transfer.email_utils import send_withdrawal_processed_email

send_withdrawal_processed_email(
    to_email="user@example.com",
    first_name="John",
    amount=500.00,
    currency="₵",
    processed_at=timezone.now()
)
```

#### Cause Management Emails
```python
# causes/email_utils.py
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

### Email Delivery Status
All email functions return an integer indicating the number of emails sent:
- `1` - Email sent successfully
- `0` - Email failed to send
- Exceptions are raised for critical failures (when `fail_silently=False`)

### Email Testing
Test email functionality using Django shell:
```python
# Test verification email
from users_n_auth.email_utils import send_account_verification_email
send_account_verification_email(
    to_email="test@example.com",
    first_name="Test User",
    verification_url="https://example.com/verify/test/"
)
```

---

## User Profile APIs

### Get User Profile
```http
GET /api/user/profile/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "profile_uuid",
  "full_name": "John Doe",
  "bio": "Passionate about helping others",
  "profile_picture": "http://127.0.0.1:8000/media/profile_pictures/user.jpg",
  "phone_number": "+233123456789",
  "address": "Accra, Ghana",
  "withdrawal_address": {
    "payment_method": "mobile_money",
    "phone_number": "05XXXXXX",
    "provider": "MTN"
  },
  "withdrawal_wallet": "MetaMask",
  "updated_at": "2025-09-14T10:30:00Z",
  "user": "user_uuid"
}
```

### Update User Profile
```http
PATCH /api/user/profile/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "full_name": "John Smith",
  "bio": "Updated bio",
  "phone_number": "+233987654321",
  "address": "Kumasi, Ghana"
}
```

**Response:**
```json
{
  "id": "profile_uuid",
  "full_name": "John Smith",
  "bio": "Updated bio",
  "profile_picture": "http://127.0.0.1:8000/media/profile_pictures/user.jpg",
  "phone_number": "+233987654321",
  "address": "Kumasi, Ghana",
  "withdrawal_address": "0x1234...",
  "withdrawal_wallet": "MetaMask",
  "updated_at": "2025-09-14T11:00:00Z",
  "user": "user_uuid"
}
```

### Get User Details
```http
GET /api/user/details/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "user_uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "date_joined": "2025-09-14T10:30:00Z",
  "last_login": "2025-09-14T11:00:00Z"
}
```

### Delete User Account
```http
DELETE /api/user/delete/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "password": "currentpassword123"
}
```

**Response:**
```json
{
  "message": "Account deleted successfully"
}
```

---

## Cause Management APIs

### List Causes
```http
GET /api/causes/
```

**Query Parameters:**
- `category` - Filter by category ID
- `status` - Filter by status (draft, pending, live, completed, rejected)
- `search` - Search in title and description
- `ordering` - Order by field (created_at, title, target_amount, etc.)
- `page` - Page number for pagination
- `page_size` - Number of items per page

**Example:**
```http
GET /api/causes/?category=1&status=live&search=education&ordering=-created_at&page=1&page_size=10
```

**Response:**
```json
{
  "count": 25,
  "next": "http://127.0.0.1:8000/api/causes/?page=2",
  "previous": null,
  "results": [
    {
      "id": "cause_uuid",
      "title": "Build a School in Rural Ghana",
      "description": "Help us build a school for children in rural Ghana...",
      "target_amount": 50000.00,
      "current_amount": 25000.00,
      "progress_percentage": 50.0,
      "status": "live",
      "category": {
        "id": 1,
        "name": "Education",
        "description": "Educational causes"
      },
      "creator": {
        "id": "user_uuid",
        "full_name": "John Doe",
  "profile_picture": "http://127.0.0.1:8000/media/profile_pictures/user.jpg"
      },
      "created_at": "2025-09-14T10:30:00Z",
      "updated_at": "2025-09-14T11:00:00Z",
      "deadline": "2025-12-31T23:59:59Z",
  "featured_image": "http://127.0.0.1:8000/media/causes/school.jpg",
      "donation_count": 45,
      "is_featured": true
    }
  ]
}
```

### Get Cause Details
```http
GET /api/causes/{id}/
```

**Response:**
```json
{
  "id": "cause_uuid",
  "title": "Build a School in Rural Ghana",
  "description": "Help us build a school for children in rural Ghana...",
  "target_amount": 50000.00,
  "current_amount": 25000.00,
  "progress_percentage": 50.0,
  "status": "live",
  "category": {
    "id": 1,
    "name": "Education",
    "description": "Educational causes"
  },
  "creator": {
    "id": "user_uuid",
    "full_name": "John Doe",
  "profile_picture": "http://127.0.0.1:8000/media/profile_pictures/user.jpg",
    "bio": "Passionate educator"
  },
  "created_at": "2025-09-14T10:30:00Z",
  "updated_at": "2025-09-14T11:00:00Z",
  "deadline": "2025-12-31T23:59:59Z",
  "featured_image": "http://127.0.0.1:8000/media/causes/school.jpg",
  "gallery": [
  "http://127.0.0.1:8000/media/causes/school1.jpg",
  "http://127.0.0.1:8000/media/causes/school2.jpg"
  ],
  "donation_count": 45,
  "is_featured": true,
  "tags": ["education", "children", "rural", "school"],
  "updates": [
    {
      "id": "update_uuid",
      "title": "Construction Started",
      "description": "We've begun construction on the foundation...",
      "created_at": "2025-09-15T10:00:00Z"
    }
  ]
}
```

### Create Cause
```http
POST /api/causes/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Help Build a Community Center",
  "description": "We need your help to build a community center...",
  "target_amount": 30000.00,
  "category": 1,
  "deadline": "2025-12-31T23:59:59Z",
  "featured_image": "image_file",
  "gallery": ["image1", "image2"],
  "tags": ["community", "development", "center"]
}
```

**Response:**
```json
{
  "id": "cause_uuid",
  "title": "Help Build a Community Center",
  "description": "We need your help to build a community center...",
  "target_amount": 30000.00,
  "current_amount": 0.00,
  "progress_percentage": 0.0,
  "status": "draft",
  "category": {
    "id": 1,
    "name": "Community Development",
    "description": "Community development causes"
  },
  "creator": {
    "id": "user_uuid",
    "full_name": "John Doe"
  },
  "created_at": "2025-09-14T10:30:00Z",
  "updated_at": "2025-09-14T10:30:00Z",
  "deadline": "2025-12-31T23:59:59Z",
  "featured_image": "http://127.0.0.1:8000/media/causes/community.jpg",
  "gallery": [
  "http://127.0.0.1:8000/media/causes/community1.jpg",
  "http://127.0.0.1:8000/media/causes/community2.jpg"
  ],
  "donation_count": 0,
  "is_featured": false,
  "tags": ["community", "development", "center"]
}
```

### Update Cause
```http
PATCH /api/causes/{id}/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Updated Cause Title",
  "description": "Updated description...",
  "target_amount": 35000.00
}
```

**Response:**
```json
{
  "id": "cause_uuid",
  "title": "Updated Cause Title",
  "description": "Updated description...",
  "target_amount": 35000.00,
  "current_amount": 5000.00,
  "progress_percentage": 14.3,
  "status": "live",
  "updated_at": "2025-09-14T12:00:00Z"
}
```

### Delete Cause
```http
DELETE /api/causes/{id}/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Cause deleted successfully"
}
```

### Submit Cause for Approval
```http
POST /api/causes/{id}/submit/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Cause submitted for approval",
  "status": "pending"
}
```

---

## Donation APIs

### List Donations
```http
GET /api/donations/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Description:**
Returns only donations made by the authenticated user. This endpoint provides a personalized view of the user's donation history with rich nested data including cause details, donor information, and recipient details.

**Query Parameters:**
- `cause_id` - Filter by cause ID
- `status` - Filter by status (pending, completed, failed)
- `search` - Search by cause name
- `ordering` - Order by field (donated_at, amount, etc.)
- `page` - Page number
- `page_size` - Items per page (default: 20)

**Response:**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "donation_uuid",
      "amount": 100.00,
      "currency": "GHS",
      "status": "completed",
      "donated_at": "2025-09-14T10:30:00Z",
      "transaction_id": "paystack_ref_123",
      "cause": {
        "id": "cause_uuid",
        "title": "Build a School in Rural Ghana",
        "creator": {
          "id": "creator_uuid",
          "full_name": "Jane Doe"
        }
      },
      "donor": {
        "id": "user_uuid",
        "full_name": "John Smith",
        "email": "john@example.com"
      },
      "recipient": {
        "id": "creator_uuid",
        "full_name": "Jane Doe"
      }
    }
  ]
}
```

**Important Notes:**
- This endpoint only returns donations made by the authenticated user
- All foreign key relationships are optimized with `select_related` for better performance
- The `cause` field contains nested cause information including the creator
- The `donor` field contains the authenticated user's information
- The `recipient` field contains the cause organizer's information

### Create Donation
```http
POST /api/donations/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Description:**
Creates a new donation for the authenticated user. The `user_id` and `recipient_id` are automatically set based on the authenticated user and the cause organizer respectively.

**Request Body:**
```json
{
  "cause_id": "cause_uuid",
  "amount": 50.00
}
```

**Response:**
```json
{
  "id": "donation_uuid",
  "amount": 50.00,
  "currency": "GHS",
  "status": "pending",
  "donated_at": "2025-09-14T10:30:00Z",
  "transaction_id": null,
  "cause": {
    "id": "cause_uuid",
    "title": "Build a School in Rural Ghana",
    "creator": {
      "id": "creator_uuid",
      "full_name": "Jane Doe"
    }
  },
  "donor": {
    "id": "user_uuid",
    "full_name": "John Doe",
    "email": "john@example.com"
  },
  "recipient": {
    "id": "creator_uuid",
    "full_name": "Jane Doe"
  }
}
```

**Important Notes:**
- The `user_id` is automatically set to the authenticated user
- The `recipient_id` is automatically set to the cause organizer
- The `currency` is automatically set to "GHS" (Ghanaian Cedi)
- The `status` is initially set to "pending"
- The `transaction_id` will be populated after payment processing
- **Email Notification**: A donation success email is automatically sent to the donor after successful payment processing

### Get Donation Details
```http
GET /api/donations/{id}/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Description:**
Retrieves detailed information about a specific donation. Only returns donations made by the authenticated user.

**Response:**
```json
{
  "id": "donation_uuid",
  "amount": 100.00,
  "currency": "GHS",
  "status": "completed",
  "donated_at": "2025-09-14T10:30:00Z",
  "transaction_id": "paystack_ref_123",
  "cause": {
    "id": "cause_uuid",
    "title": "Build a School in Rural Ghana",
    "creator": {
      "id": "creator_uuid",
      "full_name": "Jane Doe"
    }
  },
  "donor": {
    "id": "user_uuid",
    "full_name": "John Doe",
    "email": "john@example.com"
  },
  "recipient": {
    "id": "creator_uuid",
    "full_name": "Jane Doe"
  }
}
```

**Important Notes:**
- Only returns donations made by the authenticated user
- Returns 404 if the donation doesn't exist or doesn't belong to the user
- All nested relationships are included for comprehensive data

### Admin Donation List
```http
GET /api/admin/donations/
```

**Headers:**
```http
Authorization: Bearer <admin_access_token>
```

**Description:**
Admin-only endpoint that returns all donations across the platform. Requires admin service authentication.

**Query Parameters:**
- `user_id` - Filter by user ID
- `cause_id` - Filter by cause ID
- `status` - Filter by status
- `donated_at` - Filter by donation date
- `search` - Search by user email, cause name, or transaction ID
- `ordering` - Order by field (donated_at, amount, etc.)
- `page` - Page number
- `page_size` - Items per page

**Response:**
```json
{
  "count": 150,
  "next": "http://127.0.0.1:8000/api/admin/donations/?page=2",
  "previous": null,
  "results": [
    {
      "id": "donation_uuid",
      "amount": 100.00,
      "currency": "GHS",
      "status": "completed",
      "donated_at": "2025-09-14T10:30:00Z",
      "transaction_id": "paystack_ref_123",
      "cause": {
        "id": "cause_uuid",
        "title": "Build a School in Rural Ghana",
        "creator": {
          "id": "creator_uuid",
          "full_name": "Jane Doe"
        }
      },
      "donor": {
        "id": "user_uuid",
        "full_name": "John Doe",
        "email": "john@example.com"
      },
      "recipient": {
        "id": "creator_uuid",
        "full_name": "Jane Doe"
      }
    }
  ]
}
```

**Important Notes:**
- Requires admin service authentication
- Returns all donations across the platform
- Optimized with `select_related` for better performance
- Supports comprehensive filtering and searching

### Recent Updates & Fixes

**Database Query Optimization:**
- Fixed `select_related` field names to use correct foreign key references (`user_id`, `cause_id`, `recipient_id`)
- Optimized database queries for better performance
- Fixed search fields to use correct model field names (`cause_id__name` instead of `cause__title`)

**User-Specific Filtering:**
- `/api/donations/` endpoint now correctly filters to show only donations made by the authenticated user
- Automatic user assignment in donation creation
- Proper recipient assignment based on cause organizer

**Field Structure Updates:**
- Updated response structure to match current serializer implementation
- Added proper currency field (GHS - Ghanaian Cedi)
- Enhanced nested data structure for cause, donor, and recipient information
- Fixed field naming consistency across all endpoints

### Get Donation Statistics
```http
GET /api/donations/statistics/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Description:**
Returns donation statistics for the authenticated user.

**Response:**
```json
{
  "total_donations": 15,
  "total_amount": 2500.00,
  "average_donation": 166.67,
  "this_month": {
    "count": 5,
    "amount": 500.00
  },
  "by_status": {
    "completed": 140,
    "pending": 8,
    "failed": 2
  },
  "top_causes": [
    {
      "cause_id": "cause_uuid",
      "title": "Build a School in Rural Ghana",
      "donation_count": 45,
      "total_amount": 15000.00
    }
  ]
}
```

---

## Payment APIs

### Initialize Payment
```http
POST /api/payments/initialize/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "donation_id": "donation_uuid",
  "amount": 100.00,
  "email": "user@example.com",
  "callback_url": "https://yourdomain.com/payment/callback"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Payment initialized successfully",
  "data": {
    "authorization_url": "https://checkout.paystack.com/pay/paystack_ref_123",
    "access_code": "access_code_123",
    "reference": "paystack_ref_123"
  }
}
```

### Verify Payment
```http
GET /api/payments/verify/{reference}/
```

**Response:**
```json
{
  "status": true,
  "message": "Payment verified successfully",
  "data": {
    "reference": "paystack_ref_123",
    "amount": 100.00,
    "status": "success",
    "donation_id": "donation_uuid",
    "transaction_date": "2025-09-14T10:35:00Z"
  }
}
```

### Get Bank List
```http
GET /api/payments/banks/
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Access Bank",
      "code": "044",
      "longcode": "044150149",
      "gateway": "emandate",
      "pay_with_bank": true,
      "active": true,
      "is_deleted": false,
      "country": "Ghana",
      "currency": "GHS",
      "type": "nuban"
    }
  ]
}
```

### Get Mobile Money Providers
```http
GET /api/payments/mobile-money/
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "MTN Mobile Money",
      "code": "MTN",
      "longcode": "MTN_MOBILE_MONEY",
      "gateway": "mtn",
      "pay_with_bank": false,
      "active": true,
      "is_deleted": false,
      "country": "Ghana",
      "currency": "GHS",
      "type": "mobile_money"
    }
  ]
}
```

### Validate Bank Account
```http
POST /api/payments/validate-account/
```

**Request Body:**
```json
{
  "bank_code": "044",
  "account_number": "1234567890"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "account_name": "John Doe",
    "account_number": "1234567890",
    "bank_id": 1
  }
}
```

---

## Admin APIs

### Admin Dashboard Data
```http
GET /admin/api/dashboard/
```

**Headers:**
```http
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "total_users": 1250,
  "total_causes": 89,
  "total_donations": 456,
  "total_amount_raised": 125000.00,
  "pending_causes": 12,
  "recent_donations": [
    {
      "id": "donation_uuid",
      "amount": 100.00,
      "donor_name": "John Doe",
      "cause_title": "Build a School",
      "created_at": "2025-09-14T10:30:00Z"
    }
  ],
  "monthly_stats": {
    "users": [10, 15, 20, 25, 30, 35],
    "donations": [5000, 7500, 10000, 12500, 15000, 17500],
    "causes": [5, 8, 12, 15, 18, 22]
  }
}
```

### Donations Chart Data
```http
GET /admin/api/donations-chart/
```

**Headers:**
```http
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  "datasets": [
    {
      "label": "Donations (₵)",
      "data": [10000, 15000, 20000, 25000, 30000, 35000],
      "backgroundColor": "rgba(34, 197, 94, 0.2)",
      "borderColor": "rgba(34, 197, 94, 1)",
      "borderWidth": 2
    }
  ]
}
```

### Approve Cause
```http
POST /admin/api/causes/{id}/approve/
```

**Headers:**
```http
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "message": "Cause approved successfully",
  "status": "live"
}
```

**Email Notification:**
When a cause is approved, an email notification is automatically sent to the cause organizer with:
- Congratulations message
- Cause details and target amount
- Direct link to view the live cause
- Encouragement to share the cause

### Reject Cause
```http
POST /admin/api/causes/{id}/reject/
```

**Headers:**
```http
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "reason": "Incomplete documentation"
}
```

**Response:**
```json
{
  "message": "Cause rejected",
  "status": "rejected",
  "reason": "Incomplete documentation"
}
```

**Email Notification:**
When a cause is rejected, an email notification is automatically sent to the cause organizer with:
- Professional rejection notification
- Rejection reason (if provided)
- Encouragement to create a new cause
- Link to create a new cause

### Admin Email Notifications
The admin interface includes automatic email notifications for:
- **Cause Approval**: Sends congratulatory email to organizers
- **Cause Rejection**: Sends rejection notification with reason
- **Bulk Actions**: Supports bulk approval/rejection with individual emails
- **Error Handling**: Graceful handling of email delivery failures

---

## Notification APIs

### List Notifications
```http
GET /api/notifications/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `unread_only` - Show only unread notifications
- `type` - Filter by notification type
- `page` - Page number
- `page_size` - Items per page

**Response:**
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "notification_uuid",
      "title": "Donation Received",
      "message": "You received a donation of ₵100 for your cause 'Build a School'",
      "type": "donation",
      "is_read": false,
      "created_at": "2025-09-14T10:30:00Z",
      "data": {
        "donation_id": "donation_uuid",
        "amount": 100.00,
        "cause_id": "cause_uuid"
      }
    }
  ]
}
```

### Mark Notification as Read
```http
PATCH /api/notifications/{id}/read/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Notification marked as read",
  "is_read": true
}
```

### Mark All Notifications as Read
```http
POST /api/notifications/mark-all-read/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "All notifications marked as read",
  "updated_count": 15
}
```

---

## Category APIs

### List Categories
```http
GET /api/categories/
```

**Response:**
```json
{
  "count": 8,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Education",
      "description": "Educational causes and initiatives",
      "icon": "graduation-cap",
      "color": "#3B82F6",
      "cause_count": 25,
      "created_at": "2025-09-14T10:30:00Z"
    }
  ]
}
```

### Get Category Details
```http
GET /api/categories/{id}/
```

**Response:**
```json
{
  "id": 1,
  "name": "Education",
  "description": "Educational causes and initiatives",
  "icon": "graduation-cap",
  "color": "#3B82F6",
  "cause_count": 25,
  "created_at": "2025-09-14T10:30:00Z",
  "causes": [
    {
      "id": "cause_uuid",
      "title": "Build a School in Rural Ghana",
      "target_amount": 50000.00,
      "current_amount": 25000.00,
      "progress_percentage": 50.0,
      "status": "live",
      "created_at": "2025-09-14T10:30:00Z"
    }
  ]
}
```

---

## Cart APIs

### Add to Cart
```http
POST /api/cart/add/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "cause_id": "cause_uuid",
  "amount": 50.00
}
```

**Response:**
```json
{
  "message": "Item added to cart",
  "cart_item": {
    "id": "cart_item_uuid",
    "cause": {
      "id": "cause_uuid",
      "title": "Build a School in Rural Ghana"
    },
    "amount": 50.00,
    "created_at": "2025-09-14T10:30:00Z"
  }
}
```

### Get Cart Items
```http
GET /api/cart/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "items": [
    {
      "id": "cart_item_uuid",
      "cause": {
        "id": "cause_uuid",
        "title": "Build a School in Rural Ghana",
  "featured_image": "http://127.0.0.1:8000/media/causes/school.jpg"
      },
      "amount": 50.00,
      "created_at": "2025-09-14T10:30:00Z"
    }
  ],
  "total_amount": 50.00,
  "item_count": 1
}
```

### Update Cart Item
```http
PATCH /api/cart/{id}/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "amount": 75.00
}
```

**Response:**
```json
{
  "message": "Cart item updated",
  "cart_item": {
    "id": "cart_item_uuid",
    "amount": 75.00
  }
}
```

### Remove from Cart
```http
DELETE /api/cart/{id}/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Item removed from cart"
}
```

### Clear Cart
```http
DELETE /api/cart/clear/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Cart cleared successfully"
}
```

---

## Withdrawal APIs

### Request Withdrawal
```http
POST /api/withdrawals/request/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "amount": 1000.00,
  "withdrawal_method": "bank_transfer",
  "account_details": {
    "bank_code": "044",
    "account_number": "1234567890",
    "account_name": "John Doe"
  }
}
```

**Response:**
```json
{
  "id": "withdrawal_uuid",
  "amount": 1000.00,
  "status": "pending",
  "withdrawal_method": "bank_transfer",
  "account_details": {
    "bank_code": "044",
    "account_number": "1234567890",
    "account_name": "John Doe"
  },
  "created_at": "2025-09-14T10:30:00Z",
  "processing_fee": 25.00,
  "net_amount": 975.00
}
```

**Email Notification:**
When a withdrawal is successfully processed, an email notification is automatically sent to the user with:
- Withdrawal confirmation with amount and processing details
- Transaction reference information
- Professional financial notification design

### List Withdrawals
```http
GET /api/withdrawals/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "withdrawal_uuid",
      "amount": 1000.00,
      "status": "completed",
      "withdrawal_method": "bank_transfer",
      "created_at": "2025-09-14T10:30:00Z",
      "processed_at": "2025-09-14T14:30:00Z",
      "processing_fee": 25.00,
      "net_amount": 975.00
    }
  ]
}
```

### Get Withdrawal Details
```http
GET /api/withdrawals/{id}/
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "withdrawal_uuid",
  "amount": 1000.00,
  "status": "completed",
  "withdrawal_method": "bank_transfer",
  "account_details": {
    "bank_code": "044",
    "account_number": "1234567890",
    "account_name": "John Doe"
  },
  "created_at": "2025-09-14T10:30:00Z",
  "processed_at": "2025-09-14T14:30:00Z",
  "processing_fee": 25.00,
  "net_amount": 975.00,
  "reference": "WTH_123456789"
}
```

---

## Response Examples

### Success Response
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "message": "Operation completed successfully"
  }
}
```

### Error Response
```json
{
  "error": "Validation failed",
  "detail": "The provided data is invalid",
  "field_errors": {
    "email": ["This field is required"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

### Paginated Response
```json
{
  "count": 100,
  "next": "http://127.0.0.1:8000/api/endpoint/?page=2",
  "previous": null,
  "results": [
    // Array of objects
  ]
}
```

---

## Rate Limiting

### Rate Limits
- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per hour
- **File upload endpoints**: 10 requests per hour
- **Admin endpoints**: 200 requests per hour

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response
```json
{
  "error": "Rate limit exceeded",
  "detail": "You have exceeded the rate limit for this endpoint",
  "retry_after": 3600
}
```

---

## Webhooks

### Paystack Webhooks
The API automatically handles Paystack webhooks for payment verification and status updates.

**Webhook URL**: `https://yourdomain.com/api/webhooks/paystack/`

**Supported Events**:
- `charge.success` - Payment completed successfully
- `charge.failed` - Payment failed
- `transfer.success` - Withdrawal completed successfully
- `transfer.failed` - Withdrawal failed

### Webhook Payload Example
```json
{
  "event": "charge.success",
  "data": {
    "reference": "paystack_ref_123",
    "amount": 10000,
    "status": "success",
    "customer": {
      "email": "user@example.com"
    }
  }
}
```

---

## SDKs and Libraries

### JavaScript/Node.js
```javascript
// Install the SDK
npm install causehive-api-client

// Usage
import CauseHiveAPI from 'causehive-api-client';

const api = new CauseHiveAPI({
  baseURL: 'https://yourdomain.com/api',
  accessToken: 'your_access_token'
});

// Make requests
const causes = await api.causes.list();
const donation = await api.donations.create({
  cause: 'cause_uuid',
  amount: 100.00
});
```

### Python
```python
# Install the SDK
pip install causehive-api-client

# Usage
from causehive_api import CauseHiveAPI

api = CauseHiveAPI(
    base_url='https://yourdomain.com/api',
    access_token='your_access_token'
)

# Make requests
causes = api.causes.list()
donation = api.donations.create({
    'cause': 'cause_uuid',
    'amount': 100.00
})
```

---

## Support

For API support and questions:
- **Documentation**: This comprehensive API guide
- **Email**: api-support@causehive.com
- **Status Page**: https://status.causehive.com
- **GitHub Issues**: https://github.com/causehive/backend/issues

---

**CauseHive API** - Empowering charitable giving through technology 🌟
