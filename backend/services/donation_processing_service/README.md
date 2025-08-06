# Donation Processing Service

A Django-based microservice for handling donations, payments, cart management, and withdrawal processing for the CauseHive platform. This service integrates with Paystack for payment processing and money transfers, managing the complete financial flow from donations to withdrawals.

## 🏗️ Architecture

This service is part of the CauseHive microservices architecture and handles:
- **Cart Management**: Shopping cart functionality for causes
- **Donation Processing**: Recording and managing donations
- **Payment Integration**: Paystack payment gateway integration
- **Withdrawal Management**: Fund withdrawal processing for cause organizers
- **Webhook Handling**: Payment status updates via webhooks

## �� Features

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
- Donation statistics and reporting

### Payment Integration
- Paystack payment gateway integration
- Payment initiation and verification
- Webhook handling for payment status updates
- Transaction tracking and history

### Withdrawal Management
- Withdrawal request creation and processing
- Paystack money transfer integration
- Support for bank transfers and mobile money
- Withdrawal status tracking
- Email notifications for withdrawal completion
- Recipient management for efficient transfers

## �� API Endpoints

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

### Withdrawal Endpoints
- `GET /api/withdrawals/` - List user's withdrawal requests
- `POST /api/withdrawals/` - Create withdrawal request
- `GET /api/withdrawals/statistics/` - Get withdrawal statistics
- `GET /api/withdrawals/admin/requests/` - Admin: List all withdrawal requests
- `GET /api/withdrawals/admin/statistics/` - Admin: Get withdrawal statistics
- `POST /api/withdrawals/admin/retry/<id>/` - Admin: Retry failed withdrawal

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

### Withdrawal Processing Flow
1. Cause organizer creates withdrawal request (`POST /api/withdrawals/`)
2. System validates user, cause, and withdrawal amount
3. System extracts payment details from user's profile
4. Paystack transfer is initiated with recipient creation/reuse
5. Transfer status is tracked and updated
6. Email notification sent on successful withdrawal
7. Admin can retry failed withdrawals

## ⚙️ Configuration

### Paystack Integration
- **Payment Gateway**: For processing donations
- **Money Transfer API**: For processing withdrawals
- **Webhook Setup**: For payment status updates

### External Service Integration
The service integrates with external services for validation:
- **User Service**: Validates user IDs and retrieves payment information
- **Causes Service**: Validates cause IDs and retrieves cause details

## 📊 Database Schema

### Cart Models
- `Cart`: User's shopping cart with status tracking
- `CartItem`: Individual items in cart with cause reference and quantity

### Donation Models
- `Donation`: Records of donations with user, cause, amount, and status

### Payment Models
- `PaymentTransaction`: Payment records linked to donations with Paystack integration

### Withdrawal Models
- `WithdrawalRequest`: Withdrawal requests with status tracking, payment details, and transaction information

## 🔒 Security

- All sensitive data (API keys, database credentials) stored in environment variables
- Proper permission classes on API endpoints
- Input validation and sanitization
- JWT authentication for secure API access

## �� Email Templates

- **Withdrawal Success Email**: Notifies users of successful withdrawals
- **Payment Confirmation Email**: Confirms successful donations

## �� Background Tasks

- **Payment Verification**: Asynchronous payment status verification
- **Withdrawal Processing**: Background withdrawal transfer processing
- **Transfer Status Verification**: Periodic verification of transfer status

---

## �� Related Services

- **User Service**: User management, authentication, and profile management
- **Causes Service**: Cause and event management
- **Admin Reporting Service**: Analytics and reporting dashboard