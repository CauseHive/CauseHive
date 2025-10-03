# CauseHive System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Overview](#architecture-overview)
3. [Database Design](#database-design)
4. [User Flow Diagrams](#user-flow-diagrams)
5. [Technical Implementation](#technical-implementation)
6. [API Documentation](#api-documentation)
7. [Deployment Guide](#deployment-guide)
8. [For Non-Technical Users](#for-non-technical-users)

---

## System Overview

CauseHive is a crowdfunding platform that connects donors with causes, enabling people to raise funds for various projects and initiatives. The system handles user registration, cause creation, donation processing, and fund management.

### Key Features
- **User Management**: Registration, authentication, profile management
- **Cause Management**: Create, approve, and manage fundraising campaigns
- **Donation Processing**: Secure payment processing with Paystack
- **Fund Management**: Withdrawal processing and fund distribution
- **Email Notifications**: Automated email communications
- **Admin Dashboard**: Administrative controls and reporting

---

## Architecture Overview

### High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend"
        FE["🖥️ React Frontend"]
    end
    
    subgraph "Backend Services"
        API["⚡ Django REST API"]
        AUTH["🔐 Authentication Service"]
        PAY["💳 Payment Service"]
        EMAIL["📧 Email Service"]
        ADMIN["👨‍💼 Admin Dashboard"]
    end
    
    subgraph "Background Processing"
        CELERY["⚙️ Celery Worker"]
        BEAT["⏰ Celery Beat Scheduler"]
        CONSUMER["📥 Donation Event Consumer"]
    end
    
    subgraph "Data Layer"
        DB[("🗄️ PostgreSQL Database")]
        CACHE[("⚡ Cache Layer")]
        FILES["📁 Static Files"]
    end
    
    subgraph "External Services"
        PAYSTACK["🏦 Paystack Payment Gateway"]
        ZOHO["📮 Zoho Email Service"]
    end
    
    FE --> API
    API --> AUTH
    API --> PAY
    API --> EMAIL
    API --> ADMIN
    
    API --> DB
    API --> CACHE
    
    CELERY --> DB
    BEAT --> CELERY
    CONSUMER --> DB
    
    PAY --> PAYSTACK
    EMAIL --> ZOHO
    
    API --> FILES
    
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    classDef processing fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef data fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px,color:#000
    classDef external fill:#fff8e1,stroke:#f57f17,stroke-width:2px,color:#000
    
    class FE frontend
    class API,AUTH,PAY,EMAIL,ADMIN backend
    class CELERY,BEAT,CONSUMER processing
    class DB,CACHE,FILES data
    class PAYSTACK,ZOHO external
```

### System Components

```mermaid
graph LR
    subgraph "User Interface"
        WEB["🌐 Web Application"]
        MOBILE["📱 Mobile App"]
        ADMIN_UI["👨‍💼 Admin Interface"]
    end
    
    subgraph "Application Layer"
        DJANGO["🐍 Django Framework"]
        REST["🔗 REST API"]
        MIDDLEWARE["⚙️ Middleware"]
    end
    
    subgraph "Business Logic"
        USERS["👥 User Management"]
        CAUSES["🎯 Cause Management"]
        DONATIONS["💰 Donation Processing"]
        PAYMENTS["💳 Payment Processing"]
        NOTIFICATIONS["🔔 Notification System"]
    end
    
    subgraph "Data Persistence"
        POSTGRES[("🐘 PostgreSQL")]
        REDIS[("⚡ Redis Cache")]
        STATIC["📁 Static Files"]
    end
    
    WEB --> DJANGO
    MOBILE --> DJANGO
    ADMIN_UI --> DJANGO
    
    DJANGO --> REST
    REST --> MIDDLEWARE
    
    MIDDLEWARE --> USERS
    MIDDLEWARE --> CAUSES
    MIDDLEWARE --> DONATIONS
    MIDDLEWARE --> PAYMENTS
    MIDDLEWARE --> NOTIFICATIONS
    
    USERS --> POSTGRES
    CAUSES --> POSTGRES
    DONATIONS --> POSTGRES
    PAYMENTS --> POSTGRES
    NOTIFICATIONS --> POSTGRES
    
    USERS --> REDIS
    CAUSES --> REDIS
    DONATIONS --> REDIS
    
    classDef ui fill:#e3f2fd,stroke:#0277bd,stroke-width:2px,color:#000
    classDef app fill:#f1f8e9,stroke:#33691e,stroke-width:2px,color:#000
    classDef business fill:#fff3e0,stroke:#ef6c00,stroke-width:2px,color:#000
    classDef data fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000
    
    class WEB,MOBILE,ADMIN_UI ui
    class DJANGO,REST,MIDDLEWARE app
    class USERS,CAUSES,DONATIONS,PAYMENTS,NOTIFICATIONS business
    class POSTGRES,REDIS,STATIC data
```

---

## Database Design

### Entity Relationship Diagram

```mermaid
erDiagram
    User {
        int id PK "🔑 Primary Key"
        string email UK "📧 Unique Email"
        string password_hash "🔒 Encrypted Password"
        string first_name "👤 First Name"
        string last_name "👤 Last Name"
        string phone_number "📞 Phone"
        string profile_picture "🖼️ Profile Image"
        boolean is_verified "✅ Verified Status"
        boolean is_active "🟢 Active Status"
        datetime created_at "📅 Created Date"
        datetime updated_at "🔄 Updated Date"
    }
    
    Cause {
        int id PK "🔑 Primary Key"
        int creator_id FK "👤 Creator Reference"
        string title "📝 Cause Title"
        text description "📄 Description"
        decimal target_amount "💰 Target Amount"
        decimal current_amount "💵 Current Amount"
        string status "📊 Status"
        string category "🏷️ Category"
        string image "🖼️ Cause Image"
        datetime created_at "📅 Created Date"
        datetime updated_at "🔄 Updated Date"
        datetime deadline "⏰ Deadline"
    }
    
    Donation {
        int id PK "🔑 Primary Key"
        int donor_id FK "👤 Donor Reference"
        int cause_id FK "🎯 Cause Reference"
        decimal amount "💰 Donation Amount"
        string payment_reference "🔗 Payment Ref"
        string status "📊 Status"
        string payment_method "💳 Payment Method"
        datetime created_at "📅 Created Date"
        datetime updated_at "🔄 Updated Date"
    }
    
    PaymentTransaction {
        int id PK "🔑 Primary Key"
        int donation_id FK "💰 Donation Reference"
        string paystack_reference "🏦 Paystack Ref"
        string status "📊 Status"
        decimal amount "💰 Amount"
        string currency "💱 Currency"
        string email "📧 Email"
        datetime created_at "📅 Created Date"
        datetime updated_at "🔄 Updated Date"
    }
    
    WithdrawalTransfer {
        int id PK "🔑 Primary Key"
        int cause_id FK "🎯 Cause Reference"
        decimal amount "💰 Transfer Amount"
        string status "📊 Status"
        string paystack_transfer_reference "🏦 Transfer Ref"
        string recipient_code "👤 Recipient Code"
        datetime created_at "📅 Created Date"
        datetime updated_at "🔄 Updated Date"
    }
    
    Category {
        int id PK "🔑 Primary Key"
        string name "🏷️ Category Name"
        string description "📄 Description"
        string icon "🎨 Icon"
        datetime created_at "📅 Created Date"
    }
    
    Notification {
        int id PK "🔑 Primary Key"
        int user_id FK "👤 User Reference"
        string title "📢 Title"
        text message "💬 Message"
        string type "📋 Type"
        boolean is_read "👁️ Read Status"
        datetime created_at "📅 Created Date"
    }
    
    Cart {
        int id PK "🔑 Primary Key"
        int user_id FK "👤 User Reference"
        datetime created_at "📅 Created Date"
        datetime updated_at "🔄 Updated Date"
    }
    
    CartItem {
        int id PK "🔑 Primary Key"
        int cart_id FK "🛒 Cart Reference"
        int cause_id FK "🎯 Cause Reference"
        decimal amount "💰 Amount"
        datetime created_at "📅 Created Date"
    }
    
    User ||--o{ Cause : "creates"
    User ||--o{ Donation : "makes"
    User ||--o{ Notification : "receives"
    User ||--o{ Cart : "has"
    
    Cause ||--o{ Donation : "receives"
    Cause ||--o{ WithdrawalTransfer : "has"
    Cause }o--|| Category : "belongs_to"
    Cause ||--o{ CartItem : "in_cart"
    
    Donation ||--|| PaymentTransaction : "has"
    Cart ||--o{ CartItem : "contains"
```

### Database Tables Overview

```mermaid
graph TB
    subgraph "User Management"
        USER[User]
        AUTH[Authentication]
        PROFILE[Profile]
    end
    
    subgraph "Cause Management"
        CAUSE[Cause]
        CATEGORY[Category]
        CAUSE_IMAGE[Cause Images]
    end
    
    subgraph "Donation System"
        DONATION[Donation]
        PAYMENT[Payment Transaction]
        CART[Cart]
        CART_ITEM[Cart Item]
    end
    
    subgraph "Financial Management"
        WITHDRAWAL[Withdrawal Transfer]
        TRANSACTION[Transaction Log]
    end
    
    subgraph "Communication"
        NOTIFICATION[Notification]
        EMAIL_LOG[Email Log]
    end
    
    USER --> CAUSE
    USER --> DONATION
    USER --> CART
    USER --> NOTIFICATION
    
    CAUSE --> DONATION
    CAUSE --> WITHDRAWAL
    CAUSE --> CATEGORY
    
    DONATION --> PAYMENT
    CART --> CART_ITEM
    CART_ITEM --> CAUSE
```

---

## User Flow Diagrams

### User Registration Flow

```mermaid
flowchart TD
    A[User visits site] --> B[Click Register]
    B --> C[Fill registration form]
    C --> D{Form valid?}
    D -->|No| E[Show validation errors]
    E --> C
    D -->|Yes| F[Create user account]
    F --> G[Send verification email]
    G --> H[User checks email]
    H --> I[Click verification link]
    I --> J[Account verified]
    J --> K[Redirect to login]
    K --> L[User can now login]
```

### Donation Flow

```mermaid
flowchart TD
    A[User browses causes] --> B[Select cause]
    B --> C[Click Donate]
    C --> D[Enter donation amount]
    D --> E{Amount valid?}
    E -->|No| F[Show error message]
    F --> D
    E -->|Yes| G[Proceed to payment]
    G --> H[Redirect to Paystack]
    H --> I[User enters payment details]
    I --> J{Payment successful?}
    J -->|No| K[Show payment error]
    K --> G
    J -->|Yes| L[Payment confirmed]
    L --> M[Update cause amount]
    M --> N[Send confirmation email]
    N --> O[Show success message]
    O --> P[Redirect to cause page]
```

### Cause Creation Flow

```mermaid
flowchart TD
    A[User logs in] --> B[Click Create Cause]
    B --> C[Fill cause form]
    C --> D[Upload cause image]
    D --> E[Submit for review]
    E --> F[Admin notification sent]
    F --> G[Admin reviews cause]
    G --> H{Approved?}
    H -->|No| I[Send rejection email]
    I --> J[User can edit and resubmit]
    H -->|Yes| K[Send approval email]
    K --> L[Cause goes live]
    L --> M[Users can donate]
```

### Withdrawal Process Flow

```mermaid
flowchart TD
    A[Cause reaches target] --> B[Creator requests withdrawal]
    B --> C[Admin reviews request]
    C --> D{Approved?}
    D -->|No| E[Send rejection notification]
    E --> F[Creator can resubmit]
    D -->|Yes| G[Process Paystack transfer]
    G --> H{Transfer successful?}
    H -->|No| I[Log error and notify]
    I --> J[Retry or manual processing]
    H -->|Yes| K[Update withdrawal status]
    K --> L[Send confirmation email]
    L --> M[Withdrawal complete]
```

---

## Technical Implementation

### API Architecture

```mermaid
graph TB
    subgraph "API Layer"
        URLS[URL Routing]
        VIEWS[View Functions]
        SERIALIZERS[Data Serializers]
        PERMISSIONS[Permission Classes]
    end
    
    subgraph "Business Logic"
        MODELS[Django Models]
        SERVICES[Business Services]
        TASKS[Celery Tasks]
    end
    
    subgraph "Data Access"
        ORM[Django ORM]
        QUERYSET[QuerySets]
        MIGRATIONS[Database Migrations]
    end
    
    URLS --> VIEWS
    VIEWS --> SERIALIZERS
    VIEWS --> PERMISSIONS
    VIEWS --> MODELS
    
    MODELS --> ORM
    ORM --> QUERYSET
    
    SERVICES --> MODELS
    TASKS --> SERVICES
    
    VIEWS --> TASKS
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database
    participant E as Email Service
    
    U->>F: Enter credentials
    F->>A: POST /api/auth/login/
    A->>D: Validate credentials
    D-->>A: User data
    A->>A: Generate JWT token
    A-->>F: Return token
    F->>F: Store token
    F-->>U: Redirect to dashboard
    
    Note over U,E: For new users
    U->>F: Register
    F->>A: POST /api/auth/register/
    A->>D: Create user
    A->>E: Send verification email
    E-->>U: Verification email
    U->>F: Click verification link
    F->>A: Verify email
    A->>D: Update user status
```

### Payment Processing Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant P as Paystack
    participant D as Database
    participant E as Email Service
    participant C as Celery
    
    U->>F: Make donation
    F->>A: POST /api/donations/
    A->>D: Create donation record
    A->>P: Initialize payment
    P-->>A: Payment reference
    A-->>F: Return payment URL
    F->>P: Redirect to payment
    P->>U: Payment form
    U->>P: Complete payment
    P->>A: Webhook notification
    A->>D: Update donation status
    A->>C: Queue email task
    C->>E: Send confirmation email
    E-->>U: Confirmation email
```

---

## API Documentation

### Authentication Endpoints

```mermaid
graph LR
    subgraph "Authentication"
        LOGIN["🔐 POST /api/auth/login/"]
        REGISTER["📝 POST /api/auth/register/"]
        REFRESH["🔄 POST /api/auth/refresh/"]
        LOGOUT["🚪 POST /api/auth/logout/"]
        VERIFY["✅ POST /api/auth/verify-email/"]
    end
    
    subgraph "User Management"
        PROFILE["👤 GET/PUT /api/user/profile/"]
        PASSWORD["🔒 POST /api/user/change-password/"]
        RESET["🔄 POST /api/user/reset-password/"]
    end
    
    classDef auth fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px,color:#000
    classDef user fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#000
    
    class LOGIN,REGISTER,REFRESH,LOGOUT,VERIFY auth
    class PROFILE,PASSWORD,RESET user
```

### Core API Endpoints

```mermaid
graph TB
    subgraph "Causes"
        CAUSES["📋 GET /api/causes/"]
        CAUSE_DETAIL["🔍 GET /api/causes/{id}/"]
        CREATE_CAUSE["➕ POST /api/causes/"]
        UPDATE_CAUSE["✏️ PUT /api/causes/{id}/"]
    end
    
    subgraph "Donations"
        DONATIONS["💰 GET /api/donations/"]
        DONATE["💳 POST /api/donations/"]
        DONATION_DETAIL["🔍 GET /api/donations/{id}/"]
    end
    
    subgraph "Categories"
        CATEGORIES["🏷️ GET /api/categories/"]
        CATEGORY_DETAIL["🔍 GET /api/categories/{id}/"]
    end
    
    subgraph "Admin"
        ADMIN_CAUSES["👨‍💼 GET /api/admin/causes/"]
        APPROVE_CAUSE["✅ POST /api/admin/causes/{id}/approve/"]
        REJECT_CAUSE["❌ POST /api/admin/causes/{id}/reject/"]
    end
    
    classDef causes fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    classDef donations fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#000
    classDef categories fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef admin fill:#ffebee,stroke:#d32f2f,stroke-width:2px,color:#000
    
    class CAUSES,CAUSE_DETAIL,CREATE_CAUSE,UPDATE_CAUSE causes
    class DONATIONS,DONATE,DONATION_DETAIL donations
    class CATEGORIES,CATEGORY_DETAIL categories
    class ADMIN_CAUSES,APPROVE_CAUSE,REJECT_CAUSE admin
```

---

## Deployment Guide

### Production Architecture

```mermaid
graph TB
    subgraph "Railway Platform"
        subgraph "Web Service"
            GUNICORN[Gunicorn WSGI Server]
            DJANGO[Django Application]
        end
        
        subgraph "Background Services"
            CELERY_WORKER[Celery Worker]
            CELERY_BEAT[Celery Beat Scheduler]
            DONATION_CONSUMER[Donation Event Consumer]
        end
        
        subgraph "Database"
            POSTGRES[PostgreSQL Database]
        end
    end
    
    subgraph "External Services"
        PAYSTACK[Paystack Payment Gateway]
        ZOHO[Zoho Email Service]
        FRONTEND[React Frontend - Netlify]
    end
    
    FRONTEND --> GUNICORN
    GUNICORN --> DJANGO
    DJANGO --> POSTGRES
    
    CELERY_WORKER --> POSTGRES
    CELERY_BEAT --> CELERY_WORKER
    DONATION_CONSUMER --> POSTGRES
    
    DJANGO --> PAYSTACK
    DJANGO --> ZOHO
```

### Deployment Process

```mermaid
flowchart TD
    A[Code committed to Git] --> B[Railway detects changes]
    B --> C[Build Docker image]
    C --> D[Run migrations]
    D --> E[Create superuser]
    E --> F[Start background services]
    F --> G[Start Gunicorn server]
    G --> H[Application ready]
    
    subgraph "Background Services"
        F1[Start Celery Worker]
        F2[Start Celery Beat]
        F3[Start Donation Consumer]
    end
    
    F --> F1
    F --> F2
    F --> F3
```

---

## For Non-Technical Users

### What is CauseHive?

CauseHive is like a digital marketplace where people can:
- **Create causes** (fundraising campaigns) for things they care about
- **Donate money** to causes they want to support
- **Track progress** of causes they've donated to
- **Receive updates** about how their donations are being used

### How It Works (Simple Explanation)

```mermaid
flowchart LR
    A[Someone has a need] --> B[Creates a cause on CauseHive]
    B --> C[People see the cause and donate]
    C --> D[Money is collected safely]
    D --> E[Funds are transferred to the cause creator]
    E --> F[Updates are sent to donors]
```

### Key Features Explained

#### 1. **User Registration & Login**
- Users create accounts with email and password
- Email verification ensures real users
- Secure login system protects accounts

#### 2. **Cause Creation**
- Anyone can create a fundraising campaign
- Causes are reviewed by administrators
- Approved causes go live for donations

#### 3. **Donation Process**
- Users browse available causes
- Select amount to donate
- Secure payment through Paystack
- Instant confirmation and receipt

#### 4. **Fund Management**
- Money is held securely until cause reaches target
- Automatic transfer to cause creator
- Transparent tracking of all transactions

#### 5. **Communication**
- Email notifications for all activities
- Updates on cause progress
- Confirmation of donations and withdrawals

### Security Features

```mermaid
graph TB
    subgraph "Security Measures"
        A[Secure Payment Processing]
        B[Email Verification]
        C[Admin Approval Process]
        D[Encrypted Data Storage]
        E[Regular Security Updates]
    end
    
    subgraph "User Protection"
        F[Password Protection]
        G[Account Verification]
        H[Transaction Monitoring]
        I[Fraud Prevention]
    end
```

### Benefits for Different Users

#### **For Cause Creators:**
- Easy campaign setup
- Professional fundraising platform
- Secure payment processing
- Donor communication tools

#### **For Donors:**
- Browse verified causes
- Secure payment options
- Receipt and confirmation
- Progress updates

#### **For Administrators:**
- Cause approval system
- User management
- Financial oversight
- Reporting and analytics

### System Reliability

```mermaid
graph LR
    subgraph "Reliability Features"
        A[24/7 Availability]
        B[Automatic Backups]
        C[Error Recovery]
        D[Performance Monitoring]
    end
    
    subgraph "Support"
        E[Email Support]
        F[Documentation]
        G[Regular Updates]
        H[Community Help]
    end
```

---

## Technical Specifications

### System Requirements
- **Backend**: Python 3.12, Django 5.2
- **Database**: PostgreSQL
- **Cache**: Redis (optional, falls back to database)
- **Web Server**: Gunicorn
- **Background Tasks**: Celery
- **Payment**: Paystack integration
- **Email**: Zoho SMTP

### Performance Metrics
- **Response Time**: < 200ms for API calls
- **Uptime**: 99.9% availability
- **Concurrent Users**: Supports 1000+ simultaneous users
- **Database**: Optimized queries with proper indexing

### Monitoring & Maintenance
- **Logging**: Comprehensive application and error logging
- **Health Checks**: Automated system health monitoring
- **Backups**: Daily automated database backups
- **Updates**: Regular security and feature updates

---

## Support & Contact

### Technical Support
- **Documentation**: Comprehensive guides and API docs
- **Email Support**: support@causehive.tech
- **Issue Tracking**: GitHub issues for bug reports
- **Community**: Developer community for questions

---

*This documentation is regularly updated to reflect the current state of the CauseHive system. For the latest version, please check the repository.*
