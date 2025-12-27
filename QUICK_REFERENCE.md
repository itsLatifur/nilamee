# Feature-Based Architecture Quick Reference

## 🗂️ Backend Feature Locations

### Users Feature

**Location:** `backend/features/users/`

- **Model:** `users.model.js` - User schema with auth methods
- **Controller:** `users.controller.js` - register, login, getProfile, logout, fetchLeaderboard
- **Routes:** `users.routes.js` - `/api/v1/user/*`

### Auctions Feature

**Location:** `backend/features/auctions/`

- **Model:** `auctions.model.js` - Auction schema
- **Controller:** `auctions.controller.js` - addNewAuctionItem, getAllItems, getAuctionDetails, getMyAuctionItems, removeFromAuction, republishItem
- **Routes:** `auctions.routes.js` - `/api/v1/auctionitem/*`
- **Middleware:** `auctions.middleware.js` - checkAuctionEndTime
- **Jobs:** `jobs/endedAuction.job.js` - Cron for ended auctions

### Bids Feature

**Location:** `backend/features/bids/`

- **Model:** `bids.model.js` - Bid schema
- **Controller:** `bids.controller.js` - placeBid
- **Routes:** `bids.routes.js` - `/api/v1/bid/*`

### Commissions Feature

**Location:** `backend/features/commissions/`

- **Models:**
  - `commissions.model.js` - Commission schema
  - `proof.model.js` - PaymentProof schema
- **Controller:** `commissions.controller.js` - proofOfCommission, calculateCommission
- **Routes:** `commissions.routes.js` - `/api/v1/commission/*`
- **Middleware:** `commissions.middleware.js` - trackCommissionStatus
- **Jobs:** `jobs/verifyCommission.job.js` - Cron for verifying commissions

### Admin Feature

**Location:** `backend/features/admin/`

- **Controller:** `admin.controller.js` - deleteAuctionItem, getAllPaymentProofs, getPaymentProofDetail, updateProofStatus, deletePaymentProof, fetchAllUsers, monthlyRevenue
- **Routes:** `admin.routes.js` - `/api/v1/superadmin/*`

### Shared Backend

**Location:** `backend/shared/`

- **Middlewares:**
  - `auth.middleware.js` - isAuthenticated, isAuthorized
  - `error.middleware.js` - ErrorHandler, errorMiddleware
  - `async.middleware.js` - catchAsyncErrors
- **Utils:**
  - `jwt.util.js` - generateToken
  - `email.util.js` - sendEmail

## 🖥️ Frontend Feature Locations

### Auth Feature

**Location:** `frontend/src/features/auth/`

- **Pages:** `SignUp.jsx`, `Login.jsx`
- **Store:** `userSlice.js` - User authentication state
- **Actions:** register, login, logout, fetchUser, fetchLeaderboard

### Auctions Feature

**Location:** `frontend/src/features/auctions/`

- **Pages:**
  - `Auctions.jsx` - Browse all auctions
  - `AuctionItem.jsx` - View single auction
  - `CreateAuction.jsx` - Create new auction
  - `ViewMyAuctions.jsx` - Auctioneer's auction list
  - `ViewAuctionDetails.jsx` - Detailed auction view
- **Store:** `auctionSlice.js` - Auction state management
- **Actions:** getAllAuctionItems, getAuctionDetail, createAuction, republishAuction

### Bids Feature

**Location:** `frontend/src/features/bids/`

- **Store:** `bidSlice.js` - Bid state management
- **Actions:** placeBid

### Commissions Feature

**Location:** `frontend/src/features/commissions/`

- **Pages:** `SubmitCommission.jsx` - Submit commission payment proof
- **Store:** `commissionSlice.js` - Commission state
- **Actions:** postCommissionProof

### Admin Feature

**Location:** `frontend/src/features/admin/`

- **Pages:**
  - `Dashboard/Dashboard.jsx` - Super Admin dashboard
  - `Dashboard/sub-components/`:
    - `AuctionItemDelete.jsx`
    - `BiddersAuctioneersGraph.jsx`
    - `PaymentGraph.jsx`
    - `PaymentProofs.jsx`
- **Store:** `superAdminSlice.js` - Admin state
- **Actions:** getAllPaymentProofs, deleteAuction, updateProofStatus, getAllUsers, getMonthlyRevenue

### Profile Feature

**Location:** `frontend/src/features/profile/`

- **Pages:** `UserProfile.jsx` - User profile view

### Leaderboard Feature

**Location:** `frontend/src/features/leaderboard/`

- **Pages:** `Leaderboard.jsx` - Top bidders leaderboard

### Shared Frontend

**Location:** `frontend/src/shared/`

- **Components:**
  - `Home.jsx` - Landing page
  - `HowItWorks.jsx` - Info page
  - `About.jsx` - About page
  - `Contact.jsx` - Contact page
  - `Card.jsx` - Custom card component
  - `CardTwo.jsx` - Alternative card style
  - `Spinner.jsx` - Loading spinner
  - `home-sub-components/`:
    - `FeaturedAuctions.jsx`
    - `Leaderboard.jsx`
    - `UpcomingAuctions.jsx`
- **Layouts:**
  - `SideDrawer.jsx` - Navigation sidebar

## 🔍 How to Find Code

### Example 1: "Where is user registration?"

**Answer:** `backend/features/users/users.controller.js` → `register` function

### Example 2: "Where is the auction listing page?"

**Answer:** `frontend/src/features/auctions/pages/Auctions.jsx`

### Example 3: "Where is the bid placing logic?"

**Answer:**

- Backend: `backend/features/bids/bids.controller.js` → `placeBid`
- Frontend: `frontend/src/features/bids/store/bidSlice.js` → `placeBid` action

### Example 4: "Where is the authentication middleware?"

**Answer:** `backend/shared/middlewares/auth.middleware.js`

### Example 5: "Where are the Redux slices?"

**Answer:** Each feature has its own store folder:

- Auth: `frontend/src/features/auth/store/userSlice.js`
- Auctions: `frontend/src/features/auctions/store/auctionSlice.js`
- Bids: `frontend/src/features/bids/store/bidSlice.js`
- Commissions: `frontend/src/features/commissions/store/commissionSlice.js`
- Admin: `frontend/src/features/admin/store/superAdminSlice.js`

## 📦 Adding a New Feature

### Backend

1. Create feature folder: `backend/features/my-feature/`
2. Add files:
   - `my-feature.model.js` - Mongoose model
   - `my-feature.controller.js` - Business logic
   - `my-feature.routes.js` - Express routes
   - `my-feature.middleware.js` (optional)
   - `jobs/` folder (if needed)
3. Import and register routes in `backend/app.js`:
   ```javascript
   import myFeatureRouter from "./features/my-feature/my-feature.routes.js";
   app.use("/api/v1/my-feature", myFeatureRouter);
   ```

### Frontend

1. Create feature folder: `frontend/src/features/my-feature/`
2. Add subfolders:
   - `pages/` - React page components
   - `components/` - Feature-specific components
   - `store/` - Redux slice
   - `services/` - API calls (optional)
3. Create Redux slice: `store/myFeatureSlice.js`
4. Register slice in `frontend/src/store/store.js`:
   ```javascript
   import myFeatureReducer from "../features/my-feature/store/myFeatureSlice";
   export const store = configureStore({
     reducer: {
       myFeature: myFeatureReducer,
       // ... other reducers
     },
   });
   ```
5. Add routes in `frontend/src/App.jsx`:
   ```javascript
   import MyFeaturePage from "./features/my-feature/pages/MyFeaturePage";
   // In Routes:
   <Route path="/my-feature" element={<MyFeaturePage />} />;
   ```

## 🎯 Common Tasks

### Task: Fix a bug in user login

**Files to check:**

1. `backend/features/users/users.controller.js` - Login controller
2. `frontend/src/features/auth/pages/Login.jsx` - Login form
3. `frontend/src/features/auth/store/userSlice.js` - Login Redux action

### Task: Add a new auction field

**Files to modify:**

1. `backend/features/auctions/auctions.model.js` - Add field to schema
2. `backend/features/auctions/auctions.controller.js` - Handle new field in controllers
3. `frontend/src/features/auctions/pages/CreateAuction.jsx` - Add input field
4. `frontend/src/features/auctions/store/auctionSlice.js` - Update state if needed

### Task: Modify commission calculation

**Files to check:**

1. `backend/features/commissions/commissions.controller.js` - calculateCommission function
2. `backend/features/auctions/jobs/endedAuction.job.js` - Where commission is calculated

### Task: Update navigation menu

**Files to check:**

1. `frontend/src/shared/layouts/SideDrawer.jsx` - Navigation component

## 🚨 Important Patterns

### Import Patterns (Backend)

```javascript
// Within same feature
import { User } from "./users.model.js";

// From another feature
import { Auction } from "../auctions/auctions.model.js";

// From shared
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
```

### Import Patterns (Frontend)

```javascript
// Within same feature
import { userSlice } from "./store/userSlice";

// From another feature
import { getAllAuctionItems } from "../auctions/store/auctionSlice";

// From shared
import Card from "../../shared/components/Card";
import SideDrawer from "../../shared/layouts/SideDrawer";
```

## 📝 Naming Conventions

### Backend

- Models: `{feature}.model.js` (e.g., `users.model.js`)
- Controllers: `{feature}.controller.js` (e.g., `auctions.controller.js`)
- Routes: `{feature}.routes.js` (e.g., `bids.routes.js`)
- Middleware: `{feature}.middleware.js` (e.g., `auctions.middleware.js`)
- Jobs/Crons: `{jobName}.job.js` (e.g., `endedAuction.job.js`)

### Frontend

- Pages: PascalCase (e.g., `Auctions.jsx`, `CreateAuction.jsx`)
- Components: PascalCase (e.g., `Card.jsx`, `Spinner.jsx`)
- Slices: `{feature}Slice.js` (e.g., `userSlice.js`, `auctionSlice.js`)

## 🔗 API Route Mapping

| Feature     | Route Prefix          | File Location                                |
| ----------- | --------------------- | -------------------------------------------- |
| Users       | `/api/v1/user`        | `features/users/users.routes.js`             |
| Auctions    | `/api/v1/auctionitem` | `features/auctions/auctions.routes.js`       |
| Bids        | `/api/v1/bid`         | `features/bids/bids.routes.js`               |
| Commissions | `/api/v1/commission`  | `features/commissions/commissions.routes.js` |
| Admin       | `/api/v1/superadmin`  | `features/admin/admin.routes.js`             |

---

**Pro Tip:** When adding new functionality, always ask yourself: "Which feature does this belong to?" This will help you maintain the clean feature-based structure!
