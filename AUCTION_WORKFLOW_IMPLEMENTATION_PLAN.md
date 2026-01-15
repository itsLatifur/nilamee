# AUCTION WORKFLOW IMPLEMENTATION PLAN

**Date:** January 14, 2026  
**Platform:** Nilamee Auction Platform  
**Objective:** Implement Simple & Practical Auction Platform Workflow

---

## CURRENT STATE ANALYSIS

### Existing Features ✅

1. **Auction Approval System** - Already exists
   - `approvalStatus`: "pending", "approved", "rejected"
   - Admin approval workflow implemented
2. **Bidding System** - Functional

   - Users can place bids
   - Highest bidder tracking
   - Bid history maintained

3. **Payment Integration** - SSLCommerz

   - Commission payment gateway active
   - Transaction tracking
   - Payment proof system

4. **User Roles** - Established

   - Auctioneer, Bidder, Admin, Super Admin
   - Custom roles supported

5. **Commission System** - Partial
   - Commission calculation (5% currently)
   - Unpaid commission tracking
   - Payment proof workflow

### Missing/Incomplete Features ❌

1. **Auction Lifecycle Statuses** - Need expansion

   - Current: Only `approvalStatus` (pending/approved/rejected)
   - Missing: Payment, shipping, delivery, dispute states

2. **Payment Deadline System** - Not implemented

   - No 24-hour payment window
   - No automatic cancellation on payment failure

3. **Escrow System** - Empty folder exists

   - No escrow model
   - No fund holding mechanism
   - No delivery confirmation workflow

4. **Delivery/Shipping Tracking** - Not implemented

   - No shipping status
   - No delivery confirmation
   - No buyer "Received" confirmation

5. **Dispute Resolution** - Empty folder exists

   - No dispute model
   - No admin dispute resolution
   - No 48-hour claim window

6. **Commission Rate** - Needs update

   - Current: 5%
   - Required: 7%

7. **Automated Workflows** - Limited

   - No payment deadline enforcement
   - No automatic cancellation
   - No automatic fund release

8. **Abuse Prevention** - Minimal
   - User banning exists but no tracking
   - No win-but-no-pay tracking
   - No fake auction detection

---

## IMPLEMENTATION PLAN

### PHASE 1: DATABASE SCHEMA UPDATES

#### 1.1 Auction Model Enhancement

**File:** `backend/features/auctions/auctions.model.js`

**Add new fields:**

```javascript
// Lifecycle Status
auctionStatus: {
  type: String,
  enum: [
    "Pending Approval",  // Waiting admin approval
    "Live",              // Approved & within time window
    "Ended",             // Time expired, awaiting payment
    "Awaiting Payment",  // Winner identified, payment pending
    "Paid",              // Payment received, awaiting shipment
    "Shipped",           // Item shipped by seller
    "Completed",         // Buyer confirmed receipt
    "Cancelled",         // Cancelled (no payment/other reasons)
    "Disputed"           // Under dispute
  ],
  default: "Pending Approval"
},

// Payment tracking
paymentDeadline: {
  type: Date,
  default: null
},
paymentCompletedAt: {
  type: Date,
  default: null
},
paymentAmount: {
  type: Number,
  default: 0
},

// Shipping tracking
shippedAt: {
  type: Date,
  default: null
},
shippingTrackingNumber: {
  type: String,
  default: null
},
shippingCarrier: {
  type: String,
  default: null
},
estimatedDelivery: {
  type: Date,
  default: null
},

// Delivery tracking
deliveredAt: {
  type: Date,
  default: null
},
deliveryConfirmedAt: {
  type: Date,
  default: null
},
deliveryConfirmedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},

// Dispute tracking
disputeRaised: {
  type: Boolean,
  default: false
},
disputeDeadline: {
  type: Date,
  default: null // 48 hours after delivery
},

// Cancellation tracking
cancelledAt: {
  type: Date,
  default: null
},
cancellationReason: {
  type: String,
  enum: [
    "Payment Timeout",
    "Seller Cancelled",
    "Admin Cancelled",
    "Dispute Resolution",
    "Other"
  ],
  default: null
},

// Escrow reference
escrowId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Escrow",
  default: null
}
```

**Update existing field:**

```javascript
commissionCalculated: {
  type: Boolean,
  default: false
}
// Keep this but add commissionPaid field
commissionPaid: {
  type: Boolean,
  default: false
}
```

---

#### 1.2 Create Escrow Model

**New File:** `backend/features/escrow/escrow.model.js`

```javascript
import mongoose from "mongoose";

const escrowSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
    unique: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  commissionAmount: {
    type: Number,
    required: true,
  },
  sellerAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Pending", // Payment initiated
      "Held", // Funds secured
      "Released", // Paid to seller
      "Refunded", // Returned to buyer
      "Disputed", // Under dispute
    ],
    default: "Pending",
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentMethod: {
    type: String,
    default: "SSLCommerz",
  },
  heldAt: {
    type: Date,
    default: null,
  },
  releasedAt: {
    type: Date,
    default: null,
  },
  refundedAt: {
    type: Date,
    default: null,
  },
  autoReleaseAt: {
    type: Date,
    default: null, // Set when item delivered + 48 hours
  },
  notes: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Escrow = mongoose.model("Escrow", escrowSchema);
```

---

#### 1.3 Create Dispute Model

**New File:** `backend/features/disputes/dispute.model.js`

```javascript
import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  raisedAgainst: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "Item Not Received",
      "Item Damaged",
      "Item Not As Described",
      "Seller Not Responding",
      "Other",
    ],
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
  evidence: [
    {
      public_id: String,
      url: String,
      description: String,
    },
  ],
  status: {
    type: String,
    enum: [
      "Open",
      "Under Review",
      "Resolved - Buyer Favor",
      "Resolved - Seller Favor",
      "Resolved - Partial",
      "Closed",
    ],
    default: "Open",
  },
  adminNotes: {
    type: String,
    default: null,
  },
  resolution: {
    type: String,
    enum: [
      "Full Refund",
      "Partial Refund",
      "No Refund",
      "Reship Item",
      "Other",
    ],
    default: null,
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Dispute = mongoose.model("Dispute", disputeSchema);
```

---

#### 1.4 User Model Enhancement

**File:** `backend/features/users/users.model.js`

**Add abuse tracking fields:**

```javascript
// Abuse Prevention Tracking
abuseFlags: {
  winsWithoutPayment: {
    type: Number,
    default: 0
  },
  fakeAuctions: {
    type: Number,
    default: 0
  },
  disputesLost: {
    type: Number,
    default: 0
  },
  lastIncidentDate: {
    type: Date,
    default: null
  }
},

// Restriction tracking
restricted: {
  type: Boolean,
  default: false
},
restrictionReason: {
  type: String,
  default: null
},
restrictedUntil: {
  type: Date,
  default: null
}
```

---

### PHASE 2: CONFIGURATION UPDATES

#### 2.1 Update Commission Rate

**File:** `backend/config/appConfig.js`

```javascript
settings: {
  commissionPercentage: 7, // Changed from 5 to 7
  defaultCurrency: "BDT",
  auctionMinDuration: 1,
  paymentDeadlineHours: 24, // NEW
  disputeWindowHours: 48,   // NEW
  autoReleaseHours: 48      // NEW (after delivery)
}
```

---

### PHASE 3: CONTROLLER & ROUTE UPDATES

#### 3.1 Create Escrow Controller

**New File:** `backend/features/escrow/escrow.controller.js`

**Functions to implement:**

- `createEscrow()` - Create escrow when payment successful
- `holdFunds()` - Mark funds as held
- `releaseFunds()` - Release to seller (commission deducted)
- `refundFunds()` - Refund to buyer (dispute resolution)
- `getEscrowDetails()` - Get escrow status
- `autoReleaseFunds()` - Automated release after 48h (cron job)

---

#### 3.2 Create Dispute Controller

**New File:** `backend/features/disputes/dispute.controller.js`

**Functions to implement:**

- `raiseDispute()` - Buyer raises dispute
- `getDisputeDetails()` - Get dispute info
- `getAllDisputes()` - Admin view all disputes
- `updateDispute()` - Admin updates status
- `resolveDispute()` - Admin resolves with action

---

#### 3.3 Update Auction Controller

**File:** `backend/features/auctions/auctions.controller.js`

**Functions to update/create:**

- `updateAuctionStatus()` - Central status management
- `confirmDelivery()` - Buyer confirms receipt
- `shipItem()` - Seller updates shipping info
- `cancelAuction()` - Handle cancellation with reason
- `getAuctionTimeline()` - Get status history

---

#### 3.4 Create Auction Payment Controller

**New File:** `backend/features/auctions/auctionPayment.controller.js`

**Functions to implement:**

- `initAuctionPayment()` - Winner pays auction amount
- `auctionPaymentSuccess()` - Handle payment success
- `auctionPaymentFail()` - Handle payment failure
- `auctionPaymentIPN()` - IPN webhook

---

### PHASE 4: AUTOMATED JOBS (CRON)

#### 4.1 Update Ended Auction Job

**File:** `backend/features/auctions/jobs/endedAuction.job.js`

**Update logic to:**

1. Find ended auctions where `endTime < now` AND `auctionStatus === "Live"`
2. Set `auctionStatus = "Ended"`
3. If highest bidder exists:
   - Set `auctionStatus = "Awaiting Payment"`
   - Set `paymentDeadline = now + 24 hours`
   - Send payment notification email to winner
4. Calculate commission (7%)
5. Update auctioneer's `unpaidCommission`

---

#### 4.2 Create Payment Deadline Job

**New File:** `backend/features/auctions/jobs/paymentDeadline.job.js`

```javascript
// Runs every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  const now = new Date();

  // Find auctions with expired payment deadline
  const expiredPayments = await Auction.find({
    auctionStatus: "Awaiting Payment",
    paymentDeadline: { $lt: now },
  });

  for (const auction of expiredPayments) {
    // Cancel auction
    auction.auctionStatus = "Cancelled";
    auction.cancelledAt = now;
    auction.cancellationReason = "Payment Timeout";
    await auction.save();

    // Track abuse - winner didn't pay
    const winner = await User.findById(auction.highestBidder);
    if (winner) {
      winner.abuseFlags.winsWithoutPayment += 1;
      winner.abuseFlags.lastIncidentDate = now;

      // Auto-restrict after 3 failures
      if (winner.abuseFlags.winsWithoutPayment >= 3) {
        winner.restricted = true;
        winner.restrictionReason = "Multiple wins without payment";
        winner.restrictedUntil = new Date(
          now.getTime() + 30 * 24 * 60 * 60 * 1000
        ); // 30 days
      }
      await winner.save();
    }

    // Notify seller auction cancelled
    const seller = await User.findById(auction.createdBy);
    // Send email notification
  }
});
```

---

#### 4.3 Create Auto-Release Escrow Job

**New File:** `backend/features/escrow/jobs/autoReleaseEscrow.job.js`

```javascript
// Runs every hour
cron.schedule("0 * * * *", async () => {
  const now = new Date();

  // Find escrows ready for auto-release
  const readyToRelease = await Escrow.find({
    status: "Held",
    autoReleaseAt: { $lt: now },
  });

  for (const escrow of readyToRelease) {
    // Release funds to seller
    const auction = await Auction.findById(escrow.auctionId);

    if (!auction.disputeRaised) {
      // Release funds
      escrow.status = "Released";
      escrow.releasedAt = now;
      await escrow.save();

      auction.auctionStatus = "Completed";
      await auction.save();

      // Pay seller (already have sellerAmount calculated)
      // Integration with payment provider to transfer funds

      // Send notifications
    }
  }
});
```

---

### PHASE 5: FRONTEND UPDATES

#### 5.1 Auction Status Display Component

**New Component:** `frontend/src/features/auctions/components/AuctionStatusBadge.jsx`

Display status with color coding:

- Pending Approval → Yellow
- Live → Green
- Ended → Blue
- Awaiting Payment → Orange
- Paid → Teal
- Shipped → Purple
- Completed → Green
- Cancelled → Red
- Disputed → Red

---

#### 5.2 Auction Timeline Component

**New Component:** `frontend/src/features/auctions/components/AuctionTimeline.jsx`

Show vertical timeline:

1. Created → Approved → Live
2. Ended → Payment Deadline
3. Paid → Shipped
4. Delivered → Confirmed
5. Completed

---

#### 5.3 Winner Payment Page

**New Page:** `frontend/src/features/auctions/pages/AuctionPayment.jsx`

- Show auction details
- Display payment deadline countdown
- Payment amount breakdown (bid + any fees)
- Pay now button → SSLCommerz integration

---

#### 5.4 Delivery Confirmation

**New Component:** `frontend/src/features/auctions/components/DeliveryConfirmation.jsx`

For buyers:

- "Mark as Received" button
- "Report Issue" button (opens dispute)
- Countdown to auto-release

---

#### 5.5 Dispute Submission Form

**New Page:** `frontend/src/features/disputes/pages/RaiseDispute.jsx`

- Dispute type selector
- Description textarea
- Evidence upload (images)
- Submit button

---

#### 5.6 Seller Shipping Form

**New Component:** `frontend/src/features/auctions/components/ShippingForm.jsx`

- Tracking number input
- Carrier selection
- Estimated delivery date
- Mark as shipped button

---

#### 5.7 Admin Dispute Management

**New Page:** `frontend/src/features/admin/pages/DisputeManagement.jsx`

- List all disputes
- Filter by status
- View details modal
- Resolve dispute with action selection

---

### PHASE 6: EMAIL NOTIFICATIONS

#### 6.1 New Email Templates Needed

**File:** `backend/shared/utils/email.util.js`

Create templates for:

1. **Winner Notification** - You won, pay within 24h
2. **Payment Reminder** - 6 hours before deadline
3. **Payment Deadline Passed** - Auction cancelled
4. **Payment Received** - Seller notified to ship
5. **Item Shipped** - Buyer notified with tracking
6. **Delivery Confirmation Request** - Buyer to confirm
7. **Auto-Release Warning** - Funds releasing in 24h
8. **Funds Released** - Seller notified payment sent
9. **Dispute Raised** - Both parties notified
10. **Dispute Resolved** - Resolution communicated

---

### PHASE 7: API ROUTES

#### 7.1 Escrow Routes

**New File:** `backend/features/escrow/escrow.routes.js`

```javascript
GET    /api/v1/escrow/:auctionId          - Get escrow details
POST   /api/v1/escrow/release/:escrowId   - Manual release (admin)
POST   /api/v1/escrow/refund/:escrowId    - Refund (admin)
```

---

#### 7.2 Dispute Routes

**New File:** `backend/features/disputes/dispute.routes.js`

```javascript
POST   /api/v1/dispute/raise              - Raise dispute (buyer)
GET    /api/v1/dispute/:disputeId         - Get dispute details
GET    /api/v1/disputes/my                - User's disputes
GET    /api/v1/disputes/admin/all         - All disputes (admin)
PUT    /api/v1/dispute/update/:id         - Update dispute (admin)
PUT    /api/v1/dispute/resolve/:id        - Resolve dispute (admin)
```

---

#### 7.3 Auction Payment Routes

**New File:** `backend/features/auctions/auctionPayment.routes.js`

```javascript
POST   /api/v1/auction/payment/init       - Initialize winner payment
POST   /api/v1/auction/payment/success    - Payment success callback
POST   /api/v1/auction/payment/fail       - Payment fail callback
POST   /api/v1/auction/payment/cancel     - Payment cancel callback
POST   /api/v1/auction/payment/ipn        - IPN webhook
```

---

#### 7.4 Auction Lifecycle Routes

**Update File:** `backend/features/auctions/auctions.routes.js`

```javascript
PUT    /api/v1/auction/ship/:id           - Mark as shipped (seller)
PUT    /api/v1/auction/confirm-delivery/:id - Confirm delivery (buyer)
PUT    /api/v1/auction/cancel/:id         - Cancel auction (admin/seller)
GET    /api/v1/auction/timeline/:id       - Get status timeline
```

---

### PHASE 8: ABUSE PREVENTION

#### 8.1 Middleware for Restricted Users

**New File:** `backend/features/users/middlewares/checkRestriction.middleware.js`

```javascript
export const checkRestriction = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.restricted) {
    if (user.restrictedUntil && user.restrictedUntil > new Date()) {
      return next(
        new ErrorHandler(
          `Your account is restricted until ${user.restrictedUntil}. Reason: ${user.restrictionReason}`,
          403
        )
      );
    } else if (user.restrictedUntil && user.restrictedUntil <= new Date()) {
      // Auto-remove restriction
      user.restricted = false;
      user.restrictionReason = null;
      user.restrictedUntil = null;
      await user.save();
    }
  }

  next();
};
```

Apply to:

- Create auction route
- Place bid route
- Any money-related routes

---

#### 8.2 Admin Abuse Management Page

**New Page:** `frontend/src/features/admin/pages/AbuseManagement.jsx`

Display users with:

- High `winsWithoutPayment` count
- High `fakeAuctions` count
- High `disputesLost` count
- Currently restricted users
- Actions: Warn, Restrict, Ban

---

### PHASE 9: TESTING CHECKLIST

#### 9.1 Backend Tests

- [ ] Auction status transitions correctly
- [ ] Payment deadline enforcement works
- [ ] Escrow creation on payment
- [ ] Auto-release after 48h
- [ ] Dispute creation and resolution
- [ ] Commission deduction (7%)
- [ ] Abuse tracking increments
- [ ] Auto-restriction triggers
- [ ] Email notifications sent

#### 9.2 Frontend Tests

- [ ] Status badges display correctly
- [ ] Timeline shows proper flow
- [ ] Payment page accessible to winner only
- [ ] Countdown timers accurate
- [ ] Delivery confirmation works
- [ ] Dispute form submits
- [ ] Shipping form works for seller
- [ ] Admin can resolve disputes

#### 9.3 Integration Tests

- [ ] Full auction lifecycle (create → approve → bid → end → pay → ship → deliver → complete)
- [ ] Payment timeout → cancellation flow
- [ ] Dispute flow (raise → admin review → resolve → escrow action)
- [ ] Multiple abuse incidents → auto-restriction

---

## IMPLEMENTATION ORDER (RECOMMENDED)

### Week 1: Database & Core Logic

1. Day 1-2: Update Auction model, create Escrow model, create Dispute model
2. Day 3-4: Update User model, update appConfig
3. Day 5: Create escrow controller, dispute controller

### Week 2: Payment & Automation

1. Day 1-2: Create auction payment controller & routes
2. Day 3: Update ended auction cron job
3. Day 4: Create payment deadline cron job
4. Day 5: Create auto-release escrow cron job

### Week 3: Frontend Core

1. Day 1: Status badge component, timeline component
2. Day 2: Winner payment page
3. Day 3: Delivery confirmation, shipping form
4. Day 4: Dispute submission form
5. Day 5: Update auction detail pages with new features

### Week 4: Admin & Polish

1. Day 1-2: Admin dispute management page
2. Day 3: Admin abuse management page
3. Day 4: Email template creation
4. Day 5: Testing & bug fixes

---

## MIGRATION STRATEGY

### Handling Existing Auctions

1. Run migration script to add default values to existing auctions:

   ```javascript
   // Set all approved auctions to "Live" if within time window
   // Set all ended auctions to "Ended"
   // Set unpaid commissions properly
   ```

2. Initialize abuse flags for all users:
   ```javascript
   // Add abuseFlags with 0 counts to all existing users
   ```

---

## RISK MITIGATION

### Potential Issues & Solutions

1. **Commission Change Impact**

   - **Risk:** Existing unpaid commissions calculated at 5%
   - **Solution:** Add `commissionRate` field to Commission model to track historical rates

2. **Escrow Integration Complexity**

   - **Risk:** SSLCommerz might not support escrow/split payments natively
   - **Solution:** Hold funds in platform account, manually transfer to seller after release

3. **Auto-Release Timing**

   - **Risk:** Buyer misses 48h window unintentionally
   - **Solution:** Send reminder emails at 24h, 6h, 1h before auto-release

4. **Dispute Abuse**
   - **Risk:** Buyers raising fake disputes to delay payment
   - **Solution:** Track `disputesLost` and restrict repeat offenders

---

## SUCCESS METRICS

Post-implementation, track:

1. **Payment Success Rate** - % of winners who pay within 24h
2. **Dispute Rate** - % of completed auctions with disputes
3. **Auto-Release Rate** - % of escrows released automatically vs manually
4. **Restriction Rate** - % of users restricted for abuse
5. **Completion Rate** - % of auctions reaching "Completed" status

---

## DOCUMENTATION UPDATES NEEDED

1. Update `README.md` with new workflow explanation
2. Create `AUCTION_LIFECYCLE.md` documenting all statuses
3. Update `API_DOCUMENTATION.md` with new endpoints
4. Create `ESCROW_GUIDE.md` explaining escrow process
5. Create `DISPUTE_RESOLUTION.md` for admin reference

---

## NOTES

- **Backward Compatibility:** Existing auctions will need migration script
- **SSLCommerz Limitation:** May need custom escrow account management
- **Email Volume:** Will significantly increase with new notifications
- **Admin Workload:** Dispute resolution will require dedicated admin time
- **Commission Change:** Announce to users before implementation

---

**END OF IMPLEMENTATION PLAN**
