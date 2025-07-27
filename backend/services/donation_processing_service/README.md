# Donation Processing Service

A Django-based microservice for handling donations, payments, and cart management for the CauseHive platform. This service integrates with Paystack for payment processing and manages the complete donation flow from cart to payment completion.

## 🏗️ Architecture

This service is part of the CauseHive microservices architecture and handles:
- **Cart Management**: Shopping cart functionality for causes
- **Donation Processing**: Recording and managing donations
- **Payment Integration**: Paystack payment gateway integration
- **Webhook Handling**: Payment status updates via webhooks

## 🪶 Features

### Cart Management
- Add/remove items from cart
- Update item quantities
- Cart persistence across sessions
- Checkout process

### Donation Processing
- Create and manage donations
- Link donations to causes
- Track donation status
- Filter donations by user

### Payment Integration
- Paystack payment gateway integration
- Payment initiation and verification
- Webhook handling for payment status updates
- Transaction tracking

## 🔗 API Endpoints

### Cart Endpoints
- `GET /api/cart/` - Get current user's cart
- `POST /api/cart/add/` - Add item to cart
- `PATCH /api/cart/update/<item_id>/` - Update cart item quantity
- `DELETE /api/cart/remove/<item_id>/` - Remove item from cart
- `POST /api/cart/checkout/` - Checkout cart (create donations & initiate payment)

### Donation Endpoints
- `GET /api/donations/` - List all donations
- `POST /api/donations/` - Create a donation
- `GET /api/donations/<id>/` - Get specific donation
- `PUT /api/donations/<id>/` - Update donation
- `DELETE /api/donations/<id>/` - Delete donation
- `GET /api/donations/statistics/` - Get donation statistics

### Payment Endpoints
- `GET /api/payments/` - List all payment transactions
- `POST /api/payments/` - Create payment transaction
- `GET /api/payments/<id>/` - Get specific payment transaction
- `PUT /api/payments/<id>/` - Update payment transaction
- `DELETE /api/payments/<id>/` - Delete payment transaction
- `POST /api/payments/initiate/` - Initiate payment with Paystack
- `GET /api/payments/verify/<reference>/` - Verify payment by reference
- `POST /api/payments/webhook/` - Paystack webhook endpoint

## ⚒️ Workflow

### Cart to Donation Flow
1. User adds items to cart (`POST /api/cart/add/`)
2. User checks out cart (`POST /api/cart/checkout/`)
3. System creates `Donation` objects for each cart item
4. System initiates payment via Paystack
5. On payment success, cart status is updated to 'completed'

### Payment Processing Flow
1. Payment is initiated via Paystack
2. User completes payment on Paystack
3. Paystack sends webhook to `/api/payments/webhook/`
4. System verifies payment and updates transaction status
5. Donation status is updated based on payment result

## ⚙️ Configuration

### Paystack Webhook Setup
1. In your Paystack dashboard, go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook/`
3. Select events: `charge.success`, `charge.failed`

### External Service Integration
The service integrates with external services for validation:
- **User Service**: Validates user IDs
- **Causes Service**: Validates cause IDs

## 📊 Database Schema

### Cart Models
- `Cart`: User's shopping cart with status tracking
- `CartItem`: Individual items in cart with cause reference and quantity

### Donation Models
- `Donation`: Records of donations with user, cause, amount, and status

### Payment Models
- `PaymentTransaction`: Payment records linked to donations with Paystack integration

## 🔒 Security

- All sensitive data (API keys, database credentials) stored in environment variables
- Proper permission classes on API endpoints
- Input validation and sanitization

---

## 🧩 Related Services

- **User Service**: User management and authentication
- **Causes Service**: Cause and event management
- **Frontend Application**: User interface for the platform