# Nilamee — Features Report

Date: 2026-01-16

## System Summary

Nilamee is a transparent auction platform implemented as a Node.js + Express backend with a React frontend (Vite). Core concepts:

- Actors: Bidder, Auctioneer, Admin (Admin / Super Admin)
- Primary entities: Auction (auctionitem), Bid, User, Commission, Escrow, PaymentProof, Notification, TransactionHistory
- Auth: JWT-based; role checks via `isAuthenticated` / `isAuthorized` middleware
- Payments: SSLCommerz integration (init, success/fail/cancel, IPN). Dev demo payment endpoint exists.
- Background jobs: Cron jobs for ending auctions, payment deadlines, commission verification.

Key repo locations:

- Backend entry: [backend/app.js](backend/app.js)
- Auction controllers/routes: [backend/features/auctions/auctions.controller.js](backend/features/auctions/auctions.controller.js), [backend/features/auctions/auctions.routes.js](backend/features/auctions/auctions.routes.js)
- Payment controllers/routes: [backend/features/payments/payments.controller.js](backend/features/payments/payments.controller.js), [backend/features/payments/payments.routes.js](backend/features/payments/payments.routes.js)
- Admin controllers/routes: [backend/features/admin/admin.controller.js](backend/features/admin/admin.controller.js), [backend/features/admin/admin.routes.js](backend/features/admin/admin.routes.js)
- Bids: [backend/features/bids/bids.controller.js](backend/features/bids/bids.controller.js), [backend/features/bids/bids.routes.js](backend/features/bids/bids.routes.js)
- Frontend entry + routes: [frontend/src/App.jsx](frontend/src/App.jsx)
- Frontend env config: [frontend/src/config/env.js](frontend/src/config/env.js)
- Key frontend pages/components: [frontend/src/features/auctions/pages/MyPurchases.jsx](frontend/src/features/auctions/pages/MyPurchases.jsx), [frontend/src/features/auctions/pages/ViewMyAuctions.jsx](frontend/src/features/auctions/pages/ViewMyAuctions.jsx), [frontend/src/shared/components/CardTwo.jsx](frontend/src/shared/components/CardTwo.jsx), [frontend/src/shared/layouts/SideDrawer.jsx](frontend/src/shared/layouts/SideDrawer.jsx), [frontend/src/features/admin/pages/PendingAuctionsPage.jsx](frontend/src/features/admin/pages/PendingAuctionsPage.jsx)

---

## Working Features by Actor

### Bidder

- Browse auctions

  - Backend: `GET /api/v1/auctionitem/allitems` ([backend/features/auctions/auctions.controller.js](backend/features/auctions/auctions.controller.js))
  - Frontend: `/auctions` (Auctions.jsx). Cards show countdown and SOLD badge when auction ended with a winner.

- View auction details & bidders

  - Backend: `GET /api/v1/auctionitem/auction/:id` — returns `auctionItem` and `bidders`.
  - Frontend: `/auction/item/:id` (AuctionItem / ViewAuctionDetails). Displays bidders list, highlights winner.

- Place a bid

  - Backend: `POST /api/v1/bid/place/:id` — middleware `isAuthenticated`, `isAuthorized('Bidder')`, `checkAuctionEndTime`.
  - Frontend: bidding UI on AuctionItem page.

- View won auctions and manage payments

  - Frontend: `/my-purchases` (MyPurchases.jsx) — lists auctions where user is highest bidder; shows `Pay Now`, payment deadline, confirm delivery, open disputes and feedback.
  - Backend payment endpoints:
    - `POST /api/v1/payment/auction/init/:auctionId` — prepare SSLCommerz payment
    - `POST /api/v1/payment/auction/success` — success callback (creates Escrow)
    - `POST /api/v1/payment/auction/ipn` — IPN handling
    - Dev/demo: a dev-only `demo-pay` endpoint available to simulate payment and create Escrow.

- Confirm delivery / disputes / feedback

  - Dispute endpoints: `/api/v1/dispute/*` (create, query)
  - Feedback: `/api/v1/feedback/*` — frontend FeedbackForm used in MyPurchases.

- Profile and payment info

  - Backend/Frontend: user profile and payment info endpoints (`/api/v1/user` and `/profile`) — frontend `/me` and PaymentInfo page.

- Notifications
  - Backend: `/api/v1/notification` routes; frontend displays notifications in layout.

### Auctioneer

- Create auction items

  - Backend: `POST /api/v1/auctionitem/create` (authenticated Auctioneer). File uploads supported via fileUpload middleware.
  - Frontend: `/create-auction` (CreateAuction page).

- Manage auctions (view, republish, delete)

  - Backend: `GET /api/v1/auctionitem/myitems`, `DELETE /api/v1/auctionitem/delete/:id`, `PUT /api/v1/auctionitem/item/republish/:id`.
  - Frontend: `/view-my-auctions` (ViewMyAuctions.jsx) and `CardTwo` drawer for republish/delete.

- View bidders & highest bidder

  - Auction details endpoint provides bidders array. Frontend displays bidders sorted by amount and highlights winner; cards show SOLD if applicable.

- Submit commission proof

  - Backend: `POST /api/v1/commission/proof` (Auctioneer only).
  - Frontend: `/submit-commission` page.

- Sell history and earnings

  - Frontend: `ViewMyAuctions` and Sell History pages show sold items; backend Escrow/TransactionHistory records payments on payment success.

- Receive feedback
  - Backend: `/api/v1/feedback/auctioneer/:userId` and `/api/v1/feedback/my-received`.

### Admin (Admin / Super Admin)

- Admin Dashboard & navigation

  - Frontend: `/dashboard` and subpages; navigation exposed via `SideDrawer` for Admin/Super Admin roles.

- Review and approve auctions

  - Backend: `GET /api/v1/superadmin/auctions/pending`, `PUT /api/v1/superadmin/auction/approve/:id`, `PUT /api/v1/superadmin/auction/reject/:id`.
  - Frontend: PendingAuctionsPage.jsx -> `PendingAuctions` component uses `API_ENDPOINTS.ADMIN.BASE`.

- Manage users

  - Backend: user management endpoints (`/api/v1/superadmin/users/getall`, ban/suspend/soft-delete/restore, permanent deletes).
  - Frontend: ManageUsers page implements actions.

- Payment proof & commission management

  - Backend: `/api/v1/superadmin/paymentproofs/*` routes; Commission model and controller record commission data.
  - Frontend: PaymentProofsPage.

- Pending payments / escrow approvals

  - Backend: endpoints to list pending escrow payouts and approve payouts (creates Commission, marks Escrow Released, records `payoutInfo`, creates TransactionHistory).
  - Frontend: PendingPayments page (super admin slice fetches pending list and calls approve endpoint).

- Reports & revenue

  - Backend: `/api/v1/superadmin/monthlyincome` and other stats endpoints.
  - Frontend: StatsPage consumes these.

- Role & permission management

  - Backend: `/api/v1/superadmin/roles`, create/delete roles, update user roles.
  - Frontend: ManageRoles page.

- Administrative data controls
  - Soft/permanent deletes for auctions, users, payment proofs. DatabaseControl/ActivityLog UI available.

---

## Shared / Cross-cutting Features

- Authentication & roles: `shared/middlewares/auth.middleware.js` controls access.
- Cron jobs: `endedAuctionCron`, `paymentDeadlineCron`, `verifyCommissionCron` triggered after DB connection by `backend/app.js`.
- Notifications: server-side notifications created in controllers and available via `/api/v1/notification`.
- Debug / dev tools: debug endpoints for listing possible won auctions and a `demo-pay` endpoint to simulate payment flow for testing.

---

## Endpoint → UI Mapping (Representative)

- `GET /api/v1/auctionitem/allitems` → Frontend: `Auctions.jsx` (`/auctions`)
- `GET /api/v1/auctionitem/auction/:id` → Frontend: `AuctionItem.jsx` (`/auction/item/:id`)
- `POST /api/v1/bid/place/:id` → Bidding on `AuctionItem.jsx`
- `GET /api/v1/auctionitem/myitems` → Frontend: `ViewMyAuctions.jsx` (`/view-my-auctions`)
- `GET /api/v1/superadmin/auctions/pending` → Frontend: `PendingAuctionsPage.jsx`
- `POST /api/v1/payment/auction/init/:auctionId` → Frontend: `AuctionPayment.jsx` (`/auction/:id/payment`)
- Payment callbacks: `POST /api/v1/payment/auction/success` (backend handles creating `Escrow`)

Files (quick reference):

- Auction model/schema: `backend/models/auctionSchema.js`
- Bid model/schema: `backend/models/bidSchema.js`
- Escrow model (where present): `backend/features/escrow/escrow.model.js` or `backend/features/escrow/escrow.model.js` (see planned files)
- Commission: `backend/features/commissions/commissions.model.js`

---

## Auction -> Payment -> Payout Workflow (high-level)

1. Auction lifecycle

   - Auctioneer creates an auction (`POST /api/v1/auctionitem/create`). Auction is stored and set to `approvalStatus: pending`.
   - Admin approves auction (`PUT /api/v1/superadmin/auction/approve/:id`) which makes it available publicly.
   - Bidders place bids (`POST /api/v1/bid/place/:id`). Cron job `endedAuctionCron` monitors end times.
   - When auction ends, system resolves highest bidder (winner) and updates `highestBidder` / `paymentDeadline`.

2. Winner payment

   - Winner initiates payment via frontend `Pay Now` which calls `POST /api/v1/payment/auction/init/:auctionId`.
   - Backend constructs SSLCommerz payload and returns a gateway URL (or, in dev, a `demo-pay` flow triggers success immediately).

3. Payment success and escrow

   - On success callback / IPN, backend marks auction `paymentStatus: Paid` and creates an `Escrow` record with status `Held` (escrow holds buyer funds temporarily).
   - Escrow stores references: auctionId, buyer, seller, amount, commission percentage, payment metadata.

4. Admin approval & payout

   - Admin views pending escrow payouts in dashboard (`GET /api/v1/superadmin/payments/pending`).
   - Admin approves payout (`POST/PUT /api/v1/superadmin/payments/approve/:escrowId`) — server calculates commission, creates `Commission` record, marks Escrow `Released`, stores `payoutInfo` and creates TransactionHistory entries. Notifications sent to seller/buyer.

5. Edge cases
   - Dispute/refund flows: `POST /api/v1/dispute/*` (refunds or dispute resolution may trigger `Escrow` refund path).
   - Auto-release: planned cron to auto-release after a hold period if not disputed.

---

## Notes, Caveats & Missing / Partial Items

- SSLCommerz live operation requires valid `STORE_ID`, `STORE_PASSWD`, and publicly reachable callback URLs; demo flow exists for development.
- Some escrow/auto-release/refund flows are outlined in `AUCTION_WORKFLOW_IMPLEMENTATION_PLAN.md` and may be partially implemented or planned.
- Admin pending-payments visibility depends on frontend/backend endpoint alignment (recently reconciled to `/api/v1/superadmin/*`). If the admin UI does not show items, confirm frontend API_BASE values in `frontend/src/config/env.js` and that backend server is running.
- There are debug endpoints and helper routes added during development to diagnose `getMyWonAuctions`; these can be removed later.

---

## Next Actions / Recommendations

- Verify end-to-end payment flow in a staging environment with SSLCommerz sandbox credentials and public callback URLs (ngrok or a staging domain).
- Confirm escrow release cron or auto-release policies and implement `autoReleaseFunds()` if desired.
- Add automated tests for: winner resolution, payment callback handling, escrow creation, admin payout approval.

---

## References

- Implementation plan: `AUCTION_WORKFLOW_IMPLEMENTATION_PLAN.md`
- Backend app: `backend/app.js`
- Frontend routes: `frontend/src/App.jsx`

<!-- EOF -->
