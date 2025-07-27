# User Service

A Django-based microservice for user management, authentication, and profile handling for the CauseHive platform. This service provides comprehensive user functionality including registration, authentication, social login, and profile management.

## 🏗️ Architecture

This service is part of the CauseHive microservices architecture and handles:
- **User Management**: Registration, profile management, and account operations
- **Authentication**: JWT-based authentication with social login support
- **Authorization**: Role-based access control (regular users vs organizers)
- **Profile Management**: Extended user profiles with personal information
- **Security**: Password management, rate limiting, and account protection

## �� Features

### User Authentication
- **Email-based Authentication**: Uses email as the primary identifier (no username)
- **JWT Token Management**: Secure token-based authentication with refresh capabilities
- **Social Login**: Google OAuth integration for seamless sign-in
- **Password Management**: Secure password reset and change functionality
- **Session Management**: Automatic session handling and logout capabilities

### User Management
- **User Registration**: Complete user signup with email verification
- **Profile Management**: Extended user profiles with personal information
- **Role Management**: Distinction between regular users and organizers
- **Account Operations**: Profile updates, account deletion, and data management

### Security Features
- **Rate Limiting**: Protection against brute force attacks and abuse
- **Token Blacklisting**: Secure token invalidation on logout
- **Password Validation**: Strong password requirements and validation
- **Account Protection**: Account status management and security controls

## 📊 Data Models

### User Model
```python
class User(AbstractUser):
    id = models.UUIDField(primary_key=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    is_organizer = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
```

**Key Features:**
- UUID-based primary keys for enhanced security
- Email as the primary identifier (no username field)
- Organizer role flag for cause management permissions
- Active status tracking for account management

### UserProfile Model
```python
class UserProfile(models.Model):
    id = models.UUIDField(primary_key=True)
    user = models.OneToOneField(User, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    preferred_payment_method = models.CharField(max_length=50, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Key Features:**
- Extended user information beyond basic auth data
- Profile picture management with automatic storage
- Contact information and personal details
- Payment preference tracking for donation processing

## 🔗 API Endpoints

### Authentication Endpoints
- `POST /user/api/auth/signup/` - User registration
- `POST /user/api/auth/login/` - User login
- `POST /user/api/auth/logout/` - User logout
- `POST /user/api/auth/google/` - Google OAuth login

### JWT Token Management
- `POST /user/api/auth/token/` - Obtain JWT access token
- `POST /user/api/auth/token/refresh/` - Refresh JWT token
- `POST /user/api/auth/token/verify/` - Verify JWT token

### Password Management
- `POST /user/api/auth/password-reset/` - Request password reset
- `POST /user/api/auth/password-reset/confirm/<uidb64>/<token>/` - Confirm password reset

### User Profile Management
- `GET /user/api/auth/profile/` - Get user profile
- `PUT /user/api/auth/profile/` - Update user profile
- `GET /user/api/auth/users/<uuid:id>/` - Get specific user details
- `DELETE /user/api/auth/profile/delete` - Delete user account

## 🔒 Security Configuration

### Rate Limiting
```python
ACCOUNT_RATE_LIMITS = {
    'login': '5/m',           # 5 login attempts per minute
    'login_failed': '5/m',    # 5 failed login attempts per minute
    'signup': '3/h',          # 3 signups per hour
    'password_reset': '2/h',  # 2 password reset requests per hour
}
```

### JWT Configuration
```python
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}
```

### Social Authentication (Yet to be implemented)
- **Google OAuth**: Configured with email and profile scope
- **PKCE Enabled**: Enhanced security for OAuth flows
- **Offline Access**: Support for refresh tokens


## ⚒️ Workflow

### User Registration Flow
1. User submits registration data via `POST /user/api/auth/signup/`
2. System validates email uniqueness and password strength
3. User account is created with default profile
4. Email verification is sent (if enabled)
5. User can log in and access the platform

### Authentication Flow
1. User submits credentials via `POST /user/api/auth/login/`
2. System validates credentials and rate limiting
3. JWT access and refresh tokens are issued
4. User can access protected endpoints using Bearer token
5. Tokens can be refreshed or blacklisted on logout

### Social Login Flow
1. User initiates Google OAuth via `POST /user/api/auth/google/`
2. System redirects to Google for authentication
3. Google returns user information
4. System creates or updates user account
5. JWT tokens are issued for authenticated session

### Password Reset Flow
1. User requests password reset via `POST /user/api/auth/password-reset/`
2. System validates email and rate limiting
3. Reset email is sent with secure token
4. User clicks link and submits new password
5. Password is updated and user can log in

## ⚙️ Configuration

### Environment Variables
```env
# Django
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=user_service
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# External Services
FRONTEND_URL=http://localhost:5173
BACKEND_URL=https://localhost:8000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Database Configuration
- **PostgreSQL**: Primary database for user data
- **UUID Primary Keys**: Enhanced security and scalability
- **One-to-One Relationships**: User profiles linked to main user accounts

### File Storage
- **Profile Pictures**: Stored in `profile_pictures/` directory
- **Default Images**: Automatic fallback for missing profile pictures
- **Media Serving**: Configured for development and production

## 📈 Monitoring

### Key Metrics to Track
- User registration rates
- Authentication success/failure rates
- Social login usage
- Password reset requests
- Profile update frequency
- Account deletion rates

### Health Checks
- Database connectivity
- JWT token validation
- Social authentication providers
- File storage accessibility
- Rate limiting effectiveness

## 🔄 Integration

### External Service Dependencies
- **Cause Service**: Validates organizer permissions
- **Donation Processing Service**: Validates user IDs for donations
- **Frontend Application**: User interface for authentication and profiles

### API Integration Points
- User validation endpoints for other services
- Profile data sharing for personalization
- Authentication token validation across services
- Role-based access control for organizer features

## Related Services

- **Cause Service**: Uses user data for organizer validation
- **Donation Processing Service**: Validates user IDs for donation tracking
- **Frontend Application**: User interface for authentication and profile management