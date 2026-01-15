# SSLCommerz Payment Gateway - Development Credentials

## Testing Credentials

### Store Configuration

- **Store ID**: `nilamee64dcd6c2dd2e7`
- **Store Password**: `nilamee64dcd6c2dd2e7@ssl`
- **Environment**: Sandbox (Development)
- **Is Live**: `false`

## Backend Configuration

Add these to your `backend/config/config.env` file:

```env
# SSLCommerz Configuration
SSLCOMMERZ_STORE_ID=nilamee64dcd6c2dd2e7
SSLCOMMERZ_STORE_PASSWORD=nilamee64dcd6c2dd2e7@ssl
SSLCOMMERZ_IS_LIVE=false

# URLs for payment callbacks
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

## Test Card Details (Sandbox)

### Credit/Debit Cards

- **Card Number**: 4111111111111111 (Visa)
- **Card Number**: 5555555555554444 (Mastercard)
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits (e.g., 123)
- **Card Holder Name**: Any name

### Mobile Wallets (Sandbox)

All mobile wallet transactions in sandbox will be successful by default.

## Premium Subscription Details

- **Price**: ৳999/month
- **Features**:
  - Priority bidding access
  - Extended buyer protection (60 days)
  - 50% lower commission fees
  - Verified premium badge
  - Early access to new auctions

## Payment Flow

1. **User clicks "Get Premium Now"** on Premium page or modal
2. **Frontend** sends request to `/api/v1/payment/premium/init`
3. **Backend** creates payment session with SSLCommerz
4. **User** redirects to SSLCommerz payment gateway
5. **User** completes payment with test card
6. **SSLCommerz** redirects to success URL with transaction ID
7. **Frontend** verifies payment via `/api/v1/payment/premium/verify`
8. **Backend** activates premium subscription
9. **User** sees success message and premium features unlocked

## API Endpoints

### Initialize Premium Payment

```
POST /api/v1/payment/premium/init
Headers: Cookie (authentication)
Response: { success: true, gatewayUrl: "...", transactionId: "..." }
```

### Verify Premium Payment

```
GET /api/v1/payment/premium/verify?tranId=PREM-xxxxx-xxxxx
Response: { success: true, message: "...", user: {...} }
```

### IPN Handler (Server-to-Server)

```
POST /api/v1/payment/premium/ipn
Body: SSLCommerz IPN data
```

## Installation

Make sure you have the SSLCommerz package installed:

```bash
cd backend
npm install sslcommerz-lts
```

## Testing Steps

1. **Start Backend**:

   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend**:

   ```bash
   cd frontend
   npm run dev
   ```

3. **Login** to the application

4. **Navigate** to Premium page (`/premium`) or click Premium in sidebar

5. **Click** "Get Premium Now" button

6. **You'll be redirected** to SSLCommerz sandbox payment page

7. **Enter test card details**:

   - Card: 4111111111111111
   - Expiry: 12/25
   - CVV: 123
   - Name: Test User

8. **Complete payment** - you'll be redirected to success page

9. **Premium activated** - check your profile, you should now have premium badge

## Database Schema Updates

The User model now includes:

```javascript
isPremium: Boolean (default: false)
premiumActivatedAt: Date
premiumExpiresAt: Date
pendingPremiumTransaction: {
  transactionId: String,
  amount: Number,
  initiatedAt: Date
}
```

## Troubleshooting

### Payment fails immediately

- Check if backend is running
- Verify `config.env` has correct credentials
- Check console for errors

### Redirect fails after payment

- Verify `FRONTEND_URL` in config.env matches your frontend URL
- Check browser console for errors

### Premium not activated

- Check backend logs for verification errors
- Ensure transaction ID is passed correctly in URL
- Manually check database for `isPremium` field

## Production Setup

When moving to production:

1. Get **live credentials** from SSLCommerz
2. Update `config.env`:

   ```env
   SSLCOMMERZ_STORE_ID=your_live_store_id
   SSLCOMMERZ_STORE_PASSWORD=your_live_password
   SSLCOMMERZ_IS_LIVE=true
   FRONTEND_URL=https://your-domain.com
   BACKEND_URL=https://api.your-domain.com
   ```

3. Update all hardcoded URLs in frontend code to use environment variables

## Support

For SSLCommerz sandbox issues:

- Email: integration@sslcommerz.com
- Phone: +880-1678-272727
- Documentation: https://developer.sslcommerz.com/

## Notes

- Sandbox payments are **always successful** when using test cards
- Real money is **never charged** in sandbox mode
- Premium subscription is **30 days** from activation
- Users can purchase while already premium (will extend expiry)
- Admins and Super Admins don't see premium options
