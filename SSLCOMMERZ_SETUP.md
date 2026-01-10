# SSLCommerz Payment Integration

This project now uses SSLCommerz as the payment gateway for commission payments in Bangladesh.

## Setup Instructions

### 1. Get SSLCommerz Credentials

1. Visit [SSLCommerz](https://www.sslcommerz.com/) and create an account
2. For testing, use the SSLCommerz Sandbox:
   - Store ID: Get from SSLCommerz dashboard
   - Store Password: Get from SSLCommerz dashboard
   - Set `SSLCOMMERZ_IS_LIVE=false` for sandbox testing

### 2. Backend Configuration

Add these environment variables to `backend/config/config.env`:

```env
SSLCOMMERZ_STORE_ID=your_store_id_here
SSLCOMMERZ_STORE_PASSWORD=your_store_password_here
SSLCOMMERZ_IS_LIVE=false
BACKEND_URL=http://localhost:5000
```

**For Testing (Sandbox):**

- Set `SSLCOMMERZ_IS_LIVE=false`
- Use sandbox credentials from SSLCommerz
- Test cards: https://developer.sslcommerz.com/doc/v4/#test-cards

**For Production:**

- Set `SSLCOMMERZ_IS_LIVE=true`
- Use your live store credentials from SSLCommerz

### 3. How to Get SSLCommerz Credentials:

1. Visit: https://sslcommerz.com/
2. Register for a merchant account
3. For testing, use sandbox credentials (sign up at https://developer.sslcommerz.com/)
4. Get your Store ID and Store Password from the dashboard
5. Update the values in `backend/config/config.env`

## Removed Features

The following payment methods have been removed:

- Manual bank transfer details
- Easypaisa account numbers
- PayPal email
- Screenshot-based payment proof uploads

All commission payments are now processed through SSLCommerz Bangladesh payment gateway with support for:

- Credit/Debit Cards (Visa, MasterCard, AmEx)
- Mobile Banking (bKash, Rocket, Nagad, Upay)
- Internet Banking
- Mobile Wallets

## Usage

1. **For Auctioneers**: When you need to pay commission, go to "Submit Commission" and enter the amount. You'll be redirected to SSLCommerz secure payment gateway.

2. **For Winners**: After winning an auction, you'll receive an email with a payment link to complete the transaction.

3. **Admin**: Payment proofs are automatically created and approved upon successful SSLCommerz payment.

## Payment Flow

1. User initiates payment → `POST /api/v1/payment/commission/init`
2. System creates pending payment proof and returns SSLCommerz gateway URL
3. User redirected to SSLCommerz payment page
4. After payment:
   - Success → `/api/v1/payment/commission/success` → Redirect to `/payment-success`
   - Failed → `/api/v1/payment/commission/fail` → Redirect to `/payment-failed`
   - Cancelled → `/api/v1/payment/commission/cancel` → Redirect to `/payment-cancelled`
5. IPN (webhook) → `/api/v1/payment/commission/ipn` for payment verification

## Testing

Use these test cards in sandbox mode:

- **Success**: 4111 1111 1111 1111
- **Failed**: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

## Installation

The SSLCommerz package is already installed:

```bash
npm install sslcommerz-lts
```

## Environment Variables Required

```
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

**Complete! SSLCommerz payment gateway has been fully integrated replacing the old manual payment system.**
