# Trust, Rating & Badge System - Comprehensive Plan

**Date:** January 14, 2026  
**Status:** Planning Phase (Implementation Pending)

---

## 1. SYSTEM OVERVIEW

### 1.1 Core Objectives

- Build trust in the marketplace through transparent, automated rating systems
- Reward consistent, high-value users with visible status badges
- Provide feedback mechanism for transaction quality
- Create tiered profile visibility (Free vs Premium users)
- Ensure fairness through automated + admin-moderated scoring

### 1.2 Key Features

1. **Automated Trust Scoring**: System assigns ratings based on transaction success/failure
2. **Bidirectional Ratings**: Both Auctioneers and Bidders get rated
3. **Badge Tier System**: 6 main tiers with 15 sub-tiers total
4. **Feedback System**: Text-based reviews from buyers to sellers
5. **Profile Visibility Levels**: Free (basic) vs Premium (detailed)
6. **Verification System**: First-time success = Verified badge

---

## 2. BADGE TIER SYSTEM (Refined)

### 2.1 Tier Progression Logic

**Transaction Volume = Sum of all completed auction final bid amounts**

| Badge Tier   | Sub-Tiers      | Min Transaction Volume (BDT) | Visual Color   | Trust Score Range |
| ------------ | -------------- | ---------------------------- | -------------- | ----------------- |
| **Bronze**   | I, II, III     | 0 - 9,999                    | 🟤 Brown       | 0 - 99            |
| **Silver**   | I, II, III     | 10,000 - 49,999              | ⚪ Silver      | 100 - 249         |
| **Gold**     | I, II, III     | 50,000 - 99,999              | 🟡 Gold        | 250 - 499         |
| **Platinum** | I, II, III     | 100,000 - 499,999            | 💎 Platinum    | 500 - 999         |
| **Diamond**  | I, II, III     | 500,000 - 1,999,999          | 💠 Diamond     | 1000 - 2499       |
| **Royal**    | (No Sub-tiers) | 2,000,000+                   | 👑 Purple/Gold | 2500+             |

### 2.2 Sub-Tier Breakdown

**Within each main tier (except Royal), divide into thirds:**

**Example: Gold Tier (50,000 - 99,999 BDT)**

- **Gold-I**: 50,000 - 66,666 BDT
- **Gold-II**: 66,667 - 83,333 BDT
- **Gold-III**: 83,334 - 99,999 BDT

**Formula:**

```
tierRange = maxAmount - minAmount
subTierSize = tierRange / 3

Gold-I:   minAmount to (minAmount + subTierSize)
Gold-II:  (minAmount + subTierSize + 1) to (minAmount + 2 * subTierSize)
Gold-III: (minAmount + 2 * subTierSize + 1) to maxAmount
```

### 2.3 Verified Badge Logic

**Separate from tier badges - appears BEFORE tier badge:**

- **Auctioneers**: Get "Verified Seller ✓" after 1st successful delivery (deliveryStatus = "Delivered")
- **Bidders**: Get "Verified Buyer ✓" after 1st successful payment (paymentStatus = "Paid")

**Display Format:**

```
✓ Verified Seller | Gold-II 🟡
✓ Verified Buyer | Platinum-I 💎
```

---

## 3. TRUST SCORE CALCULATION

### 3.1 Trust Points Formula (Automated)

**For Auctioneers (Sellers):**

```javascript
Points Per Auction = {
  basePoints: 10,
  volumeBonus: Math.floor(finalBidAmount / 1000), // 1 point per 1000 BDT
  deliverySpeed: {
    within3Days: +15,
    within7Days: +10,
    within14Days: +5,
    over14Days: 0
  },
  penalties: {
    lateShipment: -5,
    disputeRaised: -20,
    disputeLost: -50
  }
}

totalScore = basePoints + volumeBonus + deliverySpeed - penalties
```

**For Bidders (Buyers):**

```javascript
Points Per Auction = {
  basePoints: 10,
  volumeBonus: Math.floor(finalBidAmount / 1000), // 1 point per 1000 BDT
  paymentSpeed: {
    within1Hour: +15,
    within6Hours: +10,
    within12Hours: +5,
    within24Hours: 0
  },
  penalties: {
    paymentMissed: -30,
    disputeRaisedAndLost: -10,
    fraudulentDispute: -50
  }
}

totalScore = basePoints + volumeBonus + paymentSpeed - penalties
```

### 3.2 Admin-Judged Ratings

**When disputes are resolved, admins assign penalty:**

- **Dispute resolved in favor of buyer**: Seller loses 50 points
- **Dispute resolved in favor of seller**: Buyer loses 10 points (frivolous dispute)
- **Partial refund**: Both lose 10 points (both at fault)

### 3.3 Rating Score (Star Rating 1-5)

**Displayed as stars on profile:**

```javascript
starRating = Math.min(5, Math.max(1, Math.floor(trustScore / 100)));

// Examples:
// 0-99 points = 1 star ⭐
// 100-199 points = 2 stars ⭐⭐
// 500-599 points = 5 stars ⭐⭐⭐⭐⭐
```

---

## 4. FEEDBACK SYSTEM

### 4.1 Feedback Rules

1. **Who can leave feedback**: Only auction winners (buyers)
2. **When**: After auction status = "Completed" or "Delivered"
3. **Content**: Text-only (no rating stars - that's automated)
4. **Visibility**: Shown on auctioneer's profile (Premium users only)
5. **Limit**: 1 feedback per auction (immutable after submission)

### 4.2 Feedback Schema

```javascript
{
  auctionId: ObjectId,
  auctioneerUserId: ObjectId,
  bidderUserId: ObjectId,
  feedbackText: String (max 500 chars),
  createdAt: Date,
  auctionTitle: String, // Denormalized for display
  auctionAmount: Number // Denormalized for context
}
```

### 4.3 Feedback Display

**On Auctioneer Profile:**

```
Recent Feedback (Premium Only):
┌─────────────────────────────────────────────┐
│ ⭐⭐⭐⭐⭐ Gold-II Buyer                      │
│ Auction: Vintage Camera Lens                │
│ "Fast shipping, item exactly as described!" │
│ January 10, 2026                             │
└─────────────────────────────────────────────┘
```

---

## 5. PROFILE VISIBILITY SYSTEM

### 5.1 User Tiers

**Free Users (Default):**

- Can view other users' profiles with LIMITED info:
  - Name
  - Badge tier (e.g., "Gold-II")
  - Star rating (e.g., ⭐⭐⭐⭐)

**Premium Users ($10/month subscription):**

- Can view FULL profiles:
  - Name
  - Profile picture
  - Badge tier with detailed stats
  - Star rating + trust score number
  - Past feedbacks (last 10)
  - Transaction history (successful auctions count, total volume)
  - Member since date

### 5.2 Profile Access Rules

**Who can view profiles:**

- All authenticated users (Auctioneers + Bidders) can click on other users' names to view profiles
- Profile access points:
  - Auction details page (click auctioneer name)
  - Bid list (click bidder name)
  - Leaderboard (click user name)
  - Feedback section (click buyer name)

**Privacy:**

- Unauthenticated users (guests): Cannot view profiles at all
- Free users: See basic profile (name + badge + rating)
- Premium users: See full profile (all details)

---

## 6. DATABASE SCHEMA CHANGES

### 6.1 User Schema Additions

```javascript
// backend/models/userSchema.js

const userSchema = new mongoose.Schema({
  // ... existing fields ...

  // NEW FIELDS:
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
  },

  totalTransactionVolume: {
    type: Number,
    default: 0,
    comment: "Sum of all completed auction amounts (BDT)",
  },

  completedAuctionsCount: {
    type: Number,
    default: 0,
  },

  badgeTier: {
    type: String,
    enum: [
      "Bronze-I",
      "Bronze-II",
      "Bronze-III",
      "Silver-I",
      "Silver-II",
      "Silver-III",
      "Gold-I",
      "Gold-II",
      "Gold-III",
      "Platinum-I",
      "Platinum-II",
      "Platinum-III",
      "Diamond-I",
      "Diamond-II",
      "Diamond-III",
      "Royal",
    ],
    default: "Bronze-I",
  },

  isVerifiedSeller: {
    type: Boolean,
    default: false,
    comment: "True after 1st successful delivery",
  },

  isVerifiedBuyer: {
    type: Boolean,
    default: false,
    comment: "True after 1st successful payment",
  },

  starRating: {
    type: Number,
    default: 1,
    min: 1,
    max: 5,
  },

  isPremium: {
    type: Boolean,
    default: false,
  },

  premiumExpiresAt: {
    type: Date,
    default: null,
  },

  // Activity tracking
  firstSuccessfulAuctionDate: Date,
  lastActivityDate: Date,

  // Stats
  stats: {
    totalAuctionsCreated: { type: Number, default: 0 },
    totalAuctionsWon: { type: Number, default: 0 },
    totalAuctionsCompleted: { type: Number, default: 0 },
    disputesRaised: { type: Number, default: 0 },
    disputesLost: { type: Number, default: 0 },
    averageDeliveryTime: { type: Number, default: 0 }, // in hours
    averagePaymentTime: { type: Number, default: 0 }, // in hours
  },
});
```

### 6.2 New Feedback Model

```javascript
// backend/features/feedback/feedback.model.js

const feedbackSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
    unique: true, // One feedback per auction
  },

  auctioneerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  bidderUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  feedbackText: {
    type: String,
    required: true,
    maxlength: 500,
    minlength: 10,
  },

  // Denormalized fields for faster display
  auctionTitle: String,
  auctionAmount: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

feedbackSchema.index({ auctioneerUserId: 1, createdAt: -1 });
feedbackSchema.index({ auctionId: 1 }, { unique: true });
```

### 6.3 Transaction History Model

```javascript
// backend/features/transactions/transactionHistory.model.js

const transactionHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },

  role: {
    type: String,
    enum: ["Auctioneer", "Bidder"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  trustPointsEarned: {
    type: Number,
    default: 0,
  },

  completedAt: {
    type: Date,
    default: Date.now,
  },

  deliveryTimeHours: Number, // For sellers
  paymentTimeHours: Number, // For buyers

  outcome: {
    type: String,
    enum: ["Success", "Disputed", "Failed"],
    default: "Success",
  },
});

transactionHistorySchema.index({ userId: 1, completedAt: -1 });
```

---

## 7. API ENDPOINTS NEEDED

### 7.1 Profile Endpoints

```
GET  /api/v1/user/profile/:userId
     - Returns profile based on requester's subscription tier
     - Query: ?view=basic|premium (auto-detected from user.isPremium)
     - Response: { name, badgeTier, starRating, [premium fields if applicable] }

GET  /api/v1/user/my-profile
     - Returns full profile of authenticated user

PUT  /api/v1/user/update-profile
     - Update profile picture, bio, etc.
```

### 7.2 Feedback Endpoints

```
POST /api/v1/feedback/submit
     - Body: { auctionId, feedbackText }
     - Validates: User is winner, auction is completed, no existing feedback

GET  /api/v1/feedback/auctioneer/:userId
     - Returns last 10 feedbacks for auctioneer (Premium only)
     - Query: ?limit=10&offset=0

GET  /api/v1/feedback/my-received
     - Auctioneer views their own received feedbacks (no premium required)
```

### 7.3 Premium Subscription Endpoints

```
POST /api/v1/subscription/purchase-premium
     - Integrate with SSLCommerz (price: 1000 BDT/month)
     - Sets isPremium=true, premiumExpiresAt=Date.now()+30days

GET  /api/v1/subscription/status
     - Returns { isPremium, expiresAt, daysRemaining }

POST /api/v1/subscription/cancel
     - Cancels auto-renewal (expires at end of period)
```

### 7.4 Trust Score Endpoints

```
GET  /api/v1/trust/leaderboard
     - Returns top 100 users by trustScore
     - Query: ?role=Auctioneer|Bidder

GET  /api/v1/trust/my-stats
     - Returns detailed breakdown of trust score calculation
```

---

## 8. FRONTEND COMPONENTS NEEDED

### 8.1 New Components

**1. `BadgeDisplay.jsx`**

```jsx
// Shows tier badge with icon + color
<BadgeDisplay tier="Gold-II" size="md" showTooltip />
// Output: 🟡 Gold-II (hover: "50,000 - 83,333 BDT transacted")
```

**2. `TrustScoreCard.jsx`**

```jsx
// Shows star rating + trust score
<TrustScoreCard
  starRating={4}
  trustScore={450}
  showBreakdown={true} // Premium only
/>
```

**3. `UserProfileModal.jsx`**

```jsx
// Modal popup when clicking user names
<UserProfileModal userId={userId} isPremiumViewer={user.isPremium} />
// Shows basic or full profile based on viewer tier
```

**4. `FeedbackList.jsx`**

```jsx
// Lists feedbacks on profile (Premium only)
<FeedbackList userId={auctioneerId} limit={10} />
```

**5. `FeedbackForm.jsx`**

```jsx
// Form to submit feedback after auction completion
<FeedbackForm auctionId={auctionId} onSubmit={handleSubmit} />
```

**6. `PremiumBadge.jsx`**

```jsx
// Shows "Premium" badge next to user name
<PremiumBadge isPremium={user.isPremium} />
// Output: 👑 Premium
```

**7. `UpgradeToPremiumBanner.jsx`**

```jsx
// CTA banner when free user tries to view premium content
<UpgradeToPremiumBanner />
```

### 8.2 Modified Components

**1. `ViewAuctionDetails.jsx`**

- Add auctioneer name, badge, and rating below item details
- Make auctioneer name clickable → opens UserProfileModal
- Add "Leave Feedback" button (only for winner after delivery)

**2. `MyAuctions.jsx` (Seller view)**

- Show own badge tier + star rating at top
- Link to "View My Feedbacks"

**3. `MyPurchases.jsx` (Buyer view)**

- Add "Leave Feedback" button on completed auctions
- Show auctioneer badge on each item

**4. `SideDrawer.jsx`**

- Show user's badge next to name at top
- Add "Upgrade to Premium" link (if not premium)

**5. `Leaderboard.jsx`**

- Add badge column
- Add trust score column
- Make user names clickable

**6. `Card.jsx` (Auction cards)**

- Show auctioneer badge on auction cards

---

## 9. AUTOMATION LOGIC

### 9.1 Trust Score Update Triggers

**Trigger 1: Auction Payment Success**

```javascript
// backend/features/payments/payments.controller.js
// In auctionPaymentSuccess() callback:

async function updateBuyerTrustOnPayment(auction, buyer) {
  const paymentTime = Date.now() - auction.endTime;
  const paymentHours = paymentTime / (1000 * 60 * 60);

  let points = 10; // Base
  points += Math.floor(auction.currentBid / 1000); // Volume bonus

  if (paymentHours < 1) points += 15;
  else if (paymentHours < 6) points += 10;
  else if (paymentHours < 12) points += 5;

  buyer.trustScore += points;
  buyer.totalTransactionVolume += auction.currentBid;

  // First payment? Award verified badge
  if (!buyer.isVerifiedBuyer) {
    buyer.isVerifiedBuyer = true;
    buyer.firstSuccessfulAuctionDate = Date.now();
  }

  // Recalculate badge tier
  buyer.badgeTier = calculateBadgeTier(buyer.totalTransactionVolume);
  buyer.starRating = Math.min(5, Math.floor(buyer.trustScore / 100) || 1);

  await buyer.save();

  // Log transaction
  await TransactionHistory.create({
    userId: buyer._id,
    auctionId: auction._id,
    role: "Bidder",
    amount: auction.currentBid,
    trustPointsEarned: points,
    paymentTimeHours: paymentHours,
    outcome: "Success",
  });
}
```

**Trigger 2: Auction Delivery Confirmation**

```javascript
// backend/features/auctions/auctions.controller.js
// In confirmDelivery() function:

async function updateSellerTrustOnDelivery(auction, seller) {
  const deliveryTime = Date.now() - auction.shippedAt;
  const deliveryDays = deliveryTime / (1000 * 60 * 60 * 24);

  let points = 10; // Base
  points += Math.floor(auction.currentBid / 1000); // Volume bonus

  if (deliveryDays <= 3) points += 15;
  else if (deliveryDays <= 7) points += 10;
  else if (deliveryDays <= 14) points += 5;

  seller.trustScore += points;
  seller.totalTransactionVolume += auction.currentBid;
  seller.completedAuctionsCount += 1;

  // First delivery? Award verified badge
  if (!seller.isVerifiedSeller) {
    seller.isVerifiedSeller = true;
    seller.firstSuccessfulAuctionDate = Date.now();
  }

  seller.badgeTier = calculateBadgeTier(seller.totalTransactionVolume);
  seller.starRating = Math.min(5, Math.floor(seller.trustScore / 100) || 1);

  await seller.save();

  await TransactionHistory.create({
    userId: seller._id,
    auctionId: auction._id,
    role: "Auctioneer",
    amount: auction.currentBid,
    trustPointsEarned: points,
    deliveryTimeHours: deliveryDays * 24,
    outcome: "Success",
  });
}
```

**Trigger 3: Dispute Resolution**

```javascript
// backend/features/disputes/dispute.controller.js
// In resolveDispute() function:

async function applyDisputePenalties(dispute, resolution) {
  const auction = await Auction.findById(dispute.auctionId).populate(
    "auctioneer highestBidder"
  );

  if (resolution.action === "Refund") {
    // Buyer wins - penalize seller
    auction.auctioneer.trustScore -= 50;
    auction.auctioneer.stats.disputesLost += 1;
    await auction.auctioneer.save();
  } else if (resolution.action === "Release") {
    // Seller wins - penalize buyer for frivolous dispute
    auction.highestBidder.trustScore -= 10;
    auction.highestBidder.stats.disputesLost += 1;
    await auction.highestBidder.save();
  } else if (resolution.action === "Partial Refund") {
    // Both at fault
    auction.auctioneer.trustScore -= 10;
    auction.highestBidder.trustScore -= 10;
    await auction.auctioneer.save();
    await auction.highestBidder.save();
  }

  // Ensure no negative scores
  if (auction.auctioneer.trustScore < 0) auction.auctioneer.trustScore = 0;
  if (auction.highestBidder.trustScore < 0)
    auction.highestBidder.trustScore = 0;
}
```

### 9.2 Badge Tier Calculator

```javascript
// backend/shared/utils/calculateBadgeTier.js

function calculateBadgeTier(totalVolume) {
  // Define tier ranges
  const tiers = [
    { name: "Bronze", min: 0, max: 9999, subTiers: true },
    { name: "Silver", min: 10000, max: 49999, subTiers: true },
    { name: "Gold", min: 50000, max: 99999, subTiers: true },
    { name: "Platinum", min: 100000, max: 499999, subTiers: true },
    { name: "Diamond", min: 500000, max: 1999999, subTiers: true },
    { name: "Royal", min: 2000000, max: Infinity, subTiers: false },
  ];

  for (let tier of tiers) {
    if (totalVolume >= tier.min && totalVolume <= tier.max) {
      if (!tier.subTiers) return "Royal";

      // Calculate sub-tier
      const range = tier.max - tier.min + 1;
      const subTierSize = range / 3;

      if (totalVolume < tier.min + subTierSize) return `${tier.name}-I`;
      else if (totalVolume < tier.min + 2 * subTierSize)
        return `${tier.name}-II`;
      else return `${tier.name}-III`;
    }
  }

  return "Bronze-I"; // Default
}

module.exports = calculateBadgeTier;
```

---

## 10. PREMIUM SUBSCRIPTION FLOW

### 10.1 SSLCommerz Integration

**Price:** 1000 BDT/month

**Payment Flow:**

1. User clicks "Upgrade to Premium" button
2. Frontend sends POST to `/api/v1/subscription/purchase-premium`
3. Backend initiates SSLCommerz payment (similar to auction payment)
4. On success callback: Set `isPremium=true`, `premiumExpiresAt=Date.now()+30days`
5. Send confirmation email with premium features list

### 10.2 Auto-Renewal Cron Job

```javascript
// backend/automation/premiumExpirationCron.js

cron.schedule("0 0 * * *", async () => {
  // Daily at midnight
  const expiredUsers = await User.find({
    isPremium: true,
    premiumExpiresAt: { $lt: Date.now() },
  });

  for (let user of expiredUsers) {
    user.isPremium = false;
    await user.save();

    // Send email notification
    await sendEmail({
      email: user.email,
      subject: "Premium Subscription Expired",
      message:
        "Your premium subscription has expired. Renew to continue enjoying full profiles!",
    });
  }
});
```

---

## 11. IMPLEMENTATION PHASES

### Phase 1: Database & Backend (Week 1)

- [ ] Update User schema with new trust/badge fields
- [ ] Create Feedback model + routes + controllers
- [ ] Create TransactionHistory model
- [ ] Implement `calculateBadgeTier()` utility
- [ ] Add trust score update logic in payment/delivery callbacks
- [ ] Add penalty logic in dispute resolution
- [ ] Create profile API endpoints (basic/premium views)

### Phase 2: Premium Subscription (Week 2)

- [ ] Create subscription routes + controllers
- [ ] Integrate SSLCommerz payment for premium
- [ ] Create premium expiration cron job
- [ ] Add middleware to check premium status on protected routes

### Phase 3: Frontend Components (Week 3)

- [ ] Create BadgeDisplay component
- [ ] Create TrustScoreCard component
- [ ] Create UserProfileModal component (basic/premium views)
- [ ] Create FeedbackForm component
- [ ] Create FeedbackList component
- [ ] Create PremiumBadge component
- [ ] Create UpgradeToPremiumBanner component

### Phase 4: Integration (Week 4)

- [ ] Add auctioneer info to ViewAuctionDetails page
- [ ] Add "Leave Feedback" button to MyPurchases
- [ ] Update SideDrawer to show user badge
- [ ] Update Leaderboard with badges + clickable names
- [ ] Add badges to auction Card components
- [ ] Update MyAuctions to show seller stats

### Phase 5: Testing & Polish (Week 5)

- [ ] Test complete flow: Auction → Payment → Delivery → Badge upgrade
- [ ] Test feedback submission + display
- [ ] Test premium subscription purchase + expiration
- [ ] Test profile views (free vs premium)
- [ ] Edge cases: negative scores, first-time users, dispute penalties
- [ ] Performance optimization (caching badge calculations)

---

## 12. VISUAL DESIGN SPECS

### 12.1 Badge Icons

```
Bronze-I:   🥉  #CD7F32
Bronze-II:  🥉  #CD7F32 (slightly brighter)
Bronze-III: 🥉  #CD7F32 (brightest)

Silver-I:   🥈  #C0C0C0
Silver-II:  🥈  #C0C0C0
Silver-III: 🥈  #C0C0C0

Gold-I:     🥇  #FFD700
Gold-II:    🥇  #FFD700
Gold-III:   🥇  #FFD700

Platinum-I:   💎  #E5E4E2
Platinum-II:  💎  #E5E4E2
Platinum-III: 💎  #E5E4E2

Diamond-I:   💠  #B9F2FF
Diamond-II:  💠  #B9F2FF
Diamond-III: 💠  #B9F2FF

Royal:       👑  #800080 (Purple + Gold gradient)
```

### 12.2 Verified Badge

```
✓ Verified Seller
✓ Verified Buyer

Color: Green (#10B981)
Position: Before tier badge
```

### 12.3 Star Rating Display

```
⭐⭐⭐⭐⭐ (5 stars)
⭐⭐⭐⭐☆ (4 stars)
⭐⭐⭐☆☆ (3 stars)
etc.

Color: Gold (#FFD700)
Size: 16px on cards, 24px on profiles
```

### 12.4 Profile Card Layout (Premium View)

```
┌─────────────────────────────────────────────┐
│ [Profile Pic]  John Doe  👑 Premium          │
│                ✓ Verified Seller | Gold-II  │
│                ⭐⭐⭐⭐ (450 trust points)    │
│                                              │
│ Stats:                                       │
│ • 45 Auctions Completed                      │
│ • ৳89,500 Total Volume                       │
│ • Avg Delivery: 4 days                       │
│ • Member since: Jan 2025                     │
│                                              │
│ Recent Feedback:                             │
│ ┌─────────────────────────────────────────┐ │
│ │ ⭐⭐⭐⭐⭐ Platinum-I Buyer              │ │
│ │ "Excellent service, highly recommend!" │ │
│ └─────────────────────────────────────────┘ │
│ [View All Feedback]                          │
└─────────────────────────────────────────────┘
```

### 12.5 Profile Card Layout (Free View)

```
┌─────────────────────────────────────────────┐
│ [Silhouette]  John Doe                       │
│               ✓ Verified Seller | Gold-II   │
│               ⭐⭐⭐⭐                        │
│                                              │
│ ──────────────────────────────────────────  │
│ 🔒 Upgrade to Premium to view:              │
│ • Profile picture                            │
│ • Detailed stats                             │
│ • Past feedbacks                             │
│ • Transaction history                        │
│                                              │
│ [Upgrade Now - 1000 BDT/month]               │
└─────────────────────────────────────────────┘
```

---

## 13. EDGE CASES & CONSIDERATIONS

### 13.1 Negative Scenarios

**Problem:** User loses trust points and drops below badge tier threshold
**Solution:** Badge tier can DECREASE (not locked in)

**Problem:** User accumulates negative trust score from disputes
**Solution:** Trust score has floor of 0 (cannot go negative)

**Problem:** First-time user has 0 transactions - what badge?
**Solution:** Default to Bronze-I, 1-star rating

### 13.2 Gaming Prevention

**Problem:** Users creating fake auctions to boost volume
**Solution:**

- Only count auctions where payment was completed
- Admin flags suspicious patterns (same buyer/seller repeatedly)
- Require minimum 3 different unique buyers for tier progression

**Problem:** Users asking friends to leave fake positive feedback
**Solution:**

- Feedback is text-only (no rating inflation)
- Only winners can leave feedback (1 per auction)
- Admin can remove fraudulent feedback

### 13.3 Performance Optimization

**Problem:** Calculating badge tier on every profile view is expensive
**Solution:**

- Store `badgeTier` in User document (pre-calculated)
- Update only when `totalTransactionVolume` changes
- Cache profile views for 5 minutes (Redis)

**Problem:** Fetching feedbacks for popular users is slow
**Solution:**

- Index feedbacks by `auctioneerUserId` + `createdAt`
- Paginate results (10 per page)
- Cache top 10 feedbacks per user

---

## 14. SUCCESS METRICS

**Key Performance Indicators:**

1. **User Engagement:**

   - % of users who reach Silver tier within 3 months: Target 30%
   - Average trust score across platform: Target 200+
   - % of completed auctions with feedback: Target 60%

2. **Premium Conversion:**

   - % of users upgrading to premium: Target 10%
   - Premium retention rate (renewals): Target 70%

3. **Trust Improvement:**

   - % reduction in disputes after trust system launch: Target 40%
   - % of users with Verified badge: Target 50% within 6 months

4. **Platform Growth:**
   - Increase in repeat users (2+ auctions): Target 50%
   - Increase in high-value auctions (>10,000 BDT): Target 30%

---

## 15. FUTURE ENHANCEMENTS

1. **Tier Rewards:**

   - Gold+ users get reduced commission (6% instead of 7%)
   - Platinum+ users get priority support
   - Royal users featured on homepage

2. **Reputation Decay:**

   - Users lose 5 trust points per month of inactivity
   - Keeps leaderboard active and competitive

3. **Referral Bonuses:**

   - Invite friends → earn 50 trust points per successful referral
   - Accelerates badge progression

4. **Badges Collection:**

   - "Speed Demon" badge for fastest payments
   - "Lightning Seller" badge for same-day shipping
   - "Feedback King" badge for 50+ positive feedbacks

5. **Trust Score History Graph:**
   - Premium users see chart of trust score over time
   - Identify trends (improving/declining)

---

## 16. FINAL NOTES

**Estimated Development Time:** 5-6 weeks (1 developer)

**Dependencies:**

- Existing payment system (SSLCommerz) ✅
- Existing auction/escrow system ✅
- Email notification system ✅

**Risks:**

- User confusion about tier progression (needs clear UI/tooltips)
- Premium paywall may reduce engagement (offer 7-day free trial?)
- Complex automation logic (thorough testing required)

**Next Steps:**

1. Get stakeholder approval on tier thresholds
2. Design mockups for profile pages
3. Start Phase 1 implementation (backend schema updates)

---

**Document Version:** 1.0  
**Last Updated:** January 14, 2026  
**Author:** System Architect  
**Status:** ✅ Ready for Review & Approval
