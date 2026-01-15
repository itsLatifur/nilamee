# QUICK TESTING GUIDE

**Platform:** Nilamee Auction  
**Implementation:** Day 1 Complete

---

## HOW TO TEST THE NEW FEATURES

### 1. TEST WINNER PAYMENT FLOW

**Prerequisites:**

- Have an auction that has ended
- Auction must have a highest bidder/winner
- Winner must be logged in

**Steps:**

1. Wait for auction to end (or manually end via database)
2. Check winner's email for payment link
3. Winner clicks link or goes to: `/auction/{auction_id}/payment`
4. See payment page with:

   - ✅ Countdown timer showing time left
   - ✅ Payment amount in BDT
   - ✅ Seller information
   - ✅ "Pay Now" button

5. Click "Pay Now"
6. Redirected to SSLCommerz gateway
7. Complete payment (use SSLCommerz test cards)
8. Redirected back to success page

**Expected Results:**

- ✅ Auction `paymentStatus` = "Paid"
- ✅ Escrow record created
- ✅ Seller receives email notification
- ✅ Buyer receives confirmation email

**Database Check:**

```javascript
// Check auction
db.auctions.findOne({ _id: ObjectId("auction_id") });
// Should show: paymentStatus: "Paid", paidAt: Date, transactionId: "AUCTION_..."

// Check escrow
db.escrows.findOne({ auctionId: ObjectId("auction_id") });
// Should show: status: "Held", commissionAmount: 7% of total, sellerAmount: 93%
```

---

### 2. TEST PAYMENT DEADLINE

**Prerequisites:**

- Have an auction that just ended
- Winner NOT logged in yet

**Steps:**

1. Auction ends
2. Check `paymentDeadline` field (should be 24 hours from now)
3. Go to payment page
4. See countdown timer
5. Wait (or manually update deadline to past time)
6. Wait 10 minutes for cron to run

**Expected Results:**

- ✅ Auction `overallStatus` = "Cancelled"
- ✅ Auction `paymentStatus` = "Failed"
- ✅ Seller receives cancellation email
- ✅ Winner receives warning email

**Manual Deadline Test (Fast):**

```javascript
// Set deadline to past
db.auctions.updateOne(
  { _id: ObjectId("auction_id") },
  { $set: { paymentDeadline: new Date(Date.now() - 1000) } }
);
// Wait 10 minutes for cron, or manually trigger paymentDeadlineCron()
```

---

### 3. TEST DELIVERY TRACKING

**Prerequisites:**

- Auction must be paid (`paymentStatus` = "Paid")
- Seller must be logged in

**Steps - Seller Marks Shipped:**

1. Seller logs in
2. Goes to auction details (own auction)
3. Sees "Mark as Shipped" button
4. Enters tracking number
5. Clicks button

**API Call:**

```javascript
PUT /api/v1/auctionitem/mark-shipped/:auctionId
Body: { trackingNumber: "TRACK123" }
Headers: { Cookie: "token=..." }
```

**Expected Results:**

- ✅ Auction `deliveryStatus` = "Shipped"
- ✅ Auction `shippedAt` = current date
- ✅ Auction `overallStatus` = "Shipped - In Transit"
- ✅ Buyer receives email with tracking number

**Steps - Buyer Confirms Delivery:**

1. Buyer logs in
2. Goes to auction payment page or won auctions
3. Sees "Confirm Delivery" button
4. Clicks button

**API Call:**

```javascript
PUT /api/v1/auctionitem/confirm-delivery/:auctionId
Headers: { Cookie: "token=..." }
```

**Expected Results:**

- ✅ Auction `deliveryStatus` = "Delivered"
- ✅ Auction `deliveredAt` = current date
- ✅ Auction `overallStatus` = "Completed"
- ✅ Escrow `status` = "Released"
- ✅ Seller receives payment release email

---

### 4. TEST DISPUTE SYSTEM

**Prerequisites:**

- Auction must be paid
- Buyer must be logged in

**Steps - Raise Dispute:**

1. Buyer logs in
2. Creates dispute via API or UI

**API Call:**

```javascript
POST /api/v1/dispute/raise
Body: {
  auctionId: "auction_id",
  type: "Not Received", // or "Damaged", "Not As Described", "Other"
  description: "Item never arrived after 2 weeks"
}
Headers: { Cookie: "token=..." }
```

**Expected Results:**

- ✅ Dispute created with status "Open"
- ✅ Auction `overallStatus` = "Disputed"
- ✅ Seller receives notification email

**Steps - Admin Resolves:**

1. Admin logs in
2. Views all disputes: `GET /api/v1/dispute/all`
3. Views specific dispute: `GET /api/v1/dispute/:disputeId`
4. Resolves dispute:

**API Call:**

```javascript
PUT /api/v1/dispute/resolve/:disputeId
Body: {
  resolution: "Buyer confirmed item never arrived. Refunding full amount.",
  action: "Refund" // or "Release" or "Partial Refund"
}
Headers: { Cookie: "token=..." } // Admin token
```

**Expected Results:**

- ✅ Dispute `status` = "Resolved"
- ✅ Escrow `status` = "Refunded" (if action = Refund)
- ✅ Auction `overallStatus` = "Cancelled" (if refund) or "Completed" (if release)
- ✅ Both parties receive resolution email

---

### 5. TEST COMMISSION RATE

**Prerequisites:**

- Have an auction with bids

**Steps:**

1. Let auction end
2. Check commission calculation

**Expected Calculation:**

```javascript
// If winning bid = BDT 10,000
Commission (7%) = BDT 700
Seller Share (93%) = BDT 9,300

// Check escrow:
db.escrows.findOne({ auctionId: ObjectId("auction_id") })
// Should show:
// totalAmount: 10000
// commissionAmount: 700
// sellerAmount: 9300
```

---

## POSTMAN/API TESTING COLLECTION

### Authentication

All protected routes require cookie: `token=<JWT_TOKEN>`

Get token by logging in:

```javascript
POST /api/v1/user/login
Body: { email: "user@example.com", password: "password" }
Response: Sets cookie with token
```

### Payment Endpoints:

```javascript
// 1. Initialize auction payment
POST /api/v1/payment/auction/init/:auctionId
Headers: { Cookie: "token=..." }

// 2. SSLCommerz callbacks (called by gateway)
POST /api/v1/payment/auction/success
POST /api/v1/payment/auction/fail
POST /api/v1/payment/auction/cancel
POST /api/v1/payment/auction/ipn
```

### Delivery Endpoints:

```javascript
// 1. Seller marks shipped
PUT /api/v1/auctionitem/mark-shipped/:auctionId
Headers: { Cookie: "token=..." }
Body: { trackingNumber: "TRACK123" }

// 2. Buyer confirms delivery
PUT /api/v1/auctionitem/confirm-delivery/:auctionId
Headers: { Cookie: "token=..." }
```

### Dispute Endpoints:

```javascript
// 1. Raise dispute
POST /api/v1/dispute/raise
Headers: { Cookie: "token=..." }
Body: {
  auctionId: "...",
  type: "Not Received",
  description: "..."
}

// 2. Get all disputes (admin)
GET /api/v1/dispute/all
Headers: { Cookie: "token=..." } // Admin token

// 3. Get dispute details
GET /api/v1/dispute/:disputeId
Headers: { Cookie: "token=..." }

// 4. Resolve dispute (admin)
PUT /api/v1/dispute/resolve/:disputeId
Headers: { Cookie: "token=..." } // Admin token
Body: {
  resolution: "...",
  action: "Refund" // or "Release"
}
```

---

## DATABASE QUERIES FOR VERIFICATION

### Check Payment Status:

```javascript
db.auctions
  .find({
    paymentStatus: { $ne: "Unpaid" },
  })
  .pretty();
```

### Check Active Escrows:

```javascript
db.escrows
  .find({
    status: "Held",
  })
  .pretty();
```

### Check Overdue Payments:

```javascript
db.auctions
  .find({
    paymentStatus: "Unpaid",
    paymentDeadline: { $lt: new Date() },
  })
  .pretty();
```

### Check Open Disputes:

```javascript
db.disputes
  .find({
    status: { $in: ["Open", "Under Review"] },
  })
  .pretty();
```

### Check Completed Auctions:

```javascript
db.auctions
  .find({
    overallStatus: "Completed",
  })
  .pretty();
```

---

## FRONTEND TESTING (Manual)

### Test Payment Page:

1. Navigate to: `http://localhost:5173/auction/{auction_id}/payment`
2. Check:
   - ✅ Countdown timer updates every second
   - ✅ Shows correct amount in BDT
   - ✅ Seller info displays
   - ✅ Pay button works
   - ✅ Error messages show when appropriate
   - ✅ Loading state during payment init

### Test Responsive Design:

- ✅ Mobile view (< 640px)
- ✅ Tablet view (640px - 1024px)
- ✅ Desktop view (> 1024px)

---

## COMMON ISSUES & SOLUTIONS

### Issue: "Payment deadline has passed"

**Solution:** Check `paymentDeadline` field, should be 24h after auction end

### Issue: "You are not the winner"

**Solution:** Verify `highestBidder` matches logged-in user ID

### Issue: Countdown shows negative time

**Solution:** Payment deadline expired, auction should be auto-cancelled

### Issue: Email not received

**Solution:** Check email configuration in `.env`, check spam folder

### Issue: SSLCommerz redirect fails

**Solution:** Verify SSLCommerz credentials, check success/fail URLs

### Issue: Escrow not created

**Solution:** Check payment success callback, verify database connection

---

## CRON JOB TESTING

### Manually Trigger Crons (Development):

```javascript
// In endedAuction.job.js, add:
export { endedAuctionCron };

// In paymentDeadline.job.js, add:
export { paymentDeadlineCron };

// Then in server/testing file:
import { endedAuctionCron } from "./features/auctions/jobs/endedAuction.job.js";
// Run immediately for testing
```

### Check Cron Execution:

```bash
# Backend terminal should show:
"Cron for ended auction running..."
"Cron for payment deadline running..."
"Running Verify Commission Cron..."
```

---

## SUCCESS CRITERIA

✅ **Minimum Viable Product:**

- [ ] Winner can pay for won auction
- [ ] Payment deadline enforced (auto-cancel after 24h)
- [ ] Escrow created and tracked
- [ ] Seller can mark as shipped
- [ ] Buyer can confirm delivery
- [ ] Dispute can be raised
- [ ] Admin can resolve disputes
- [ ] Commission calculated at 7%

✅ **All Systems Working:**

- [ ] Backend server starts without errors
- [ ] All cron jobs running
- [ ] Database connections stable
- [ ] Frontend payment page loads
- [ ] SSLCommerz integration works
- [ ] Emails sent successfully

---

## NEXT: DAY 2 TESTING PLAN

### Frontend Components to Test:

1. Seller auction details (mark shipped button)
2. Buyer won auctions (pay/confirm/dispute buttons)
3. Admin dispute management page
4. Status badges and indicators

### Integration Testing:

1. Complete workflow: Create → Bid → Win → Pay → Ship → Confirm
2. Dispute workflow: Win → Pay → Raise Dispute → Resolve
3. Deadline workflow: Win → Wait 24h → Auto-cancel

### Load Testing (Optional):

1. Multiple simultaneous payments
2. Cron job performance with many auctions
3. Database query optimization

---

**Ready to test!** 🧪
