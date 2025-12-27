# 🔄 Restructuring Implementation Guide

## Overview

This guide provides step-by-step instructions to migrate from layer-based to feature-based architecture.

---

## ⚠️ Important Notes

1. **Backup First**: Commit all changes before starting
2. **Test After Each Phase**: Ensure nothing breaks
3. **Update Imports**: Many import paths will change
4. **Run Tests**: Test endpoints after backend changes
5. **Check UI**: Test pages after frontend changes

---

## Phase 1: Backend Restructuring

### Step 1: Create New Directory Structure

```bash
# Create main directories
mkdir backend/features
mkdir backend/shared
mkdir backend/shared/middlewares
mkdir backend/shared/utils
mkdir backend/shared/constants

# Create feature directories
mkdir backend/features/auth
mkdir backend/features/users
mkdir backend/features/auctions
mkdir backend/features/auctions/jobs
mkdir backend/features/bids
mkdir backend/features/commissions
mkdir backend/features/commissions/jobs
mkdir backend/features/admin
mkdir backend/features/admin/analytics
```

### Step 2: Move Shared Code

**Middlewares** (used by all features):

```
OLD → NEW
middlewares/auth.js                → shared/middlewares/auth.middleware.js
middlewares/error.js               → shared/middlewares/error.middleware.js
middlewares/catchAsyncErrors.js    → shared/middlewares/async.middleware.js
middlewares/checkAuctionEndTime.js → features/auctions/auctions.middleware.js
middlewares/trackCommissionStatus.js → features/commissions/commissions.middleware.js
```

**Utils** (used by all features):

```
OLD → NEW
utils/jwtToken.js  → shared/utils/jwt.util.js
utils/sendEmail.js → shared/utils/email.util.js
```

**Database**:

```
OLD → NEW
database/connection.js → config/database.config.js
```

### Step 3: Reorganize Features

#### AUTH Feature

```
features/auth/
  ├── auth.controller.js     # login, register, logout
  ├── auth.routes.js         # /api/v1/auth/*
  ├── auth.service.js        # business logic
  └── auth.validation.js     # input validation
```

**Files to merge**:

- From: `controllers/userController.js` (register, login, logout)
- From: `router/userRoutes.js` (auth routes)

#### USERS Feature

```
features/users/
  ├── users.controller.js    # getProfile, fetchLeaderboard
  ├── users.model.js         # User schema
  ├── users.routes.js        # /api/v1/users/*
  └── users.service.js       # business logic
```

**Files to move**:

- From: `models/userSchema.js` → `users.model.js`
- From: `controllers/userController.js` (profile, leaderboard)
- From: `router/userRoutes.js` (user routes)

#### AUCTIONS Feature

```
features/auctions/
  ├── auctions.controller.js
  ├── auctions.model.js
  ├── auctions.routes.js
  ├── auctions.service.js
  ├── auctions.middleware.js  # checkAuctionEndTime
  └── jobs/
      └── endedAuction.job.js
```

**Files to move**:

- From: `models/auctionSchema.js` → `auctions.model.js`
- From: `controllers/auctionItemController.js` → `auctions.controller.js`
- From: `router/auctionItemRoutes.js` → `auctions.routes.js`
- From: `automation/endedAuctionCron.js` → `jobs/endedAuction.job.js`

#### BIDS Feature

```
features/bids/
  ├── bids.controller.js
  ├── bids.model.js
  ├── bids.routes.js
  └── bids.service.js
```

**Files to move**:

- From: `models/bidSchema.js` → `bids.model.js`
- From: `controllers/bidController.js` → `bids.controller.js`
- From: `router/bidRoutes.js` → `bids.routes.js`

#### COMMISSIONS Feature

```
features/commissions/
  ├── commissions.controller.js
  ├── commissions.model.js
  ├── commissions.routes.js
  ├── commissions.service.js
  ├── commissions.middleware.js  # trackCommissionStatus
  ├── proof.model.js             # Payment proof schema
  └── jobs/
      └── verifyCommission.job.js
```

**Files to move**:

- From: `models/commissionSchema.js` → `commissions.model.js`
- From: `models/commissionProofSchema.js` → `proof.model.js`
- From: `controllers/commissionController.js` → `commissions.controller.js`
- From: `router/commissionRouter.js` → `commissions.routes.js`
- From: `automation/verifyCommissionCron.js` → `jobs/verifyCommission.job.js`

#### ADMIN Feature

```
features/admin/
  ├── admin.controller.js
  ├── admin.routes.js
  ├── admin.service.js
  └── analytics/
      ├── users.analytics.js
      └── revenue.analytics.js
```

**Files to move**:

- From: `controllers/superAdminController.js` → `admin.controller.js`
- From: `router/superAdminRoutes.js` → `admin.routes.js`

### Step 4: Update app.js

**OLD app.js**:

```javascript
import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js";
// ...

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
// ...
```

**NEW app.js**:

```javascript
// Feature routes
import authRoutes from "./features/auth/auth.routes.js";
import usersRoutes from "./features/users/users.routes.js";
import auctionsRoutes from "./features/auctions/auctions.routes.js";
import bidsRoutes from "./features/bids/bids.routes.js";
import commissionsRoutes from "./features/commissions/commissions.routes.js";
import adminRoutes from "./features/admin/admin.routes.js";

// Register routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/auctions", auctionsRoutes);
app.use("/api/v1/bids", bidsRoutes);
app.use("/api/v1/commissions", commissionsRoutes);
app.use("/api/v1/admin", adminRoutes);
```

### Step 5: Update Import Paths

**Before**:

```javascript
import { User } from "../models/userSchema.js";
import { isAuthenticated } from "../middlewares/auth.js";
import ErrorHandler from "../middlewares/error.js";
```

**After**:

```javascript
import { User } from "../users/users.model.js";
import { isAuthenticated } from "../../shared/middlewares/auth.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
```

---

## Phase 2: Frontend Restructuring

### Step 1: Create New Directory Structure

```bash
# Create main directories
mkdir frontend/src/features
mkdir frontend/src/shared
mkdir frontend/src/shared/components
mkdir frontend/src/shared/layouts
mkdir frontend/src/shared/hooks
mkdir frontend/src/shared/utils
mkdir frontend/src/shared/constants

# Create feature directories
mkdir frontend/src/features/auth
mkdir frontend/src/features/auth/components
mkdir frontend/src/features/auth/pages
mkdir frontend/src/features/auth/store
mkdir frontend/src/features/auth/services

mkdir frontend/src/features/auctions
mkdir frontend/src/features/auctions/components
mkdir frontend/src/features/auctions/pages
mkdir frontend/src/features/auctions/store
mkdir frontend/src/features/auctions/services

mkdir frontend/src/features/bids
mkdir frontend/src/features/bids/components
mkdir frontend/src/features/bids/store
mkdir frontend/src/features/bids/services

mkdir frontend/src/features/commissions
mkdir frontend/src/features/commissions/components
mkdir frontend/src/features/commissions/pages
mkdir frontend/src/features/commissions/store
mkdir frontend/src/features/commissions/services

mkdir frontend/src/features/admin
mkdir frontend/src/features/admin/components
mkdir frontend/src/features/admin/pages
mkdir frontend/src/features/admin/store
mkdir frontend/src/features/admin/services

mkdir frontend/src/features/profile
mkdir frontend/src/features/profile/components
mkdir frontend/src/features/profile/pages
mkdir frontend/src/features/profile/services

mkdir frontend/src/features/leaderboard
mkdir frontend/src/features/leaderboard/components
mkdir frontend/src/features/leaderboard/pages
mkdir frontend/src/features/leaderboard/services
```

### Step 2: Move Shared Components

```
OLD → NEW
layout/SideDrawer.jsx → shared/layouts/SideDrawer/index.jsx
custom-components/Card.jsx → shared/components/Card/index.jsx
custom-components/CardTwo.jsx → shared/components/CardTwo/index.jsx
custom-components/Spinner.jsx → shared/components/Spinner/index.jsx
lib/utils.js → shared/utils/helpers.util.js
```

### Step 3: Reorganize Features

#### AUTH Feature

```
features/auth/
  ├── pages/
  │   ├── LoginPage.jsx       # from pages/Login.jsx
  │   └── SignUpPage.jsx      # from pages/SignUp.jsx
  ├── store/
  │   └── auth.slice.js       # from store/slices/userSlice.js (auth part)
  └── services/
      └── auth.service.js     # API calls
```

#### AUCTIONS Feature

```
features/auctions/
  ├── components/
  │   ├── FeaturedAuctions/   # from pages/home-sub-components/FeaturedAuctions.jsx
  │   ├── UpcomingAuctions/   # from pages/home-sub-components/UpcomingAuctions.jsx
  │   └── AuctionCard/        # extract from pages
  ├── pages/
  │   ├── AuctionsPage.jsx    # from pages/Auctions.jsx
  │   ├── AuctionItemPage.jsx # from pages/AuctionItem.jsx
  │   ├── CreateAuctionPage.jsx # from pages/CreateAuction.jsx
  │   ├── MyAuctionsPage.jsx  # from pages/ViewMyAuctions.jsx
  │   └── AuctionDetailsPage.jsx # from pages/ViewAuctionDetails.jsx
  ├── store/
  │   └── auctions.slice.js   # from store/slices/auctionSlice.js
  └── services/
      └── auctions.service.js
```

#### BIDS Feature

```
features/bids/
  ├── store/
  │   └── bids.slice.js       # from store/slices/bidSlice.js
  └── services/
      └── bids.service.js
```

#### COMMISSIONS Feature

```
features/commissions/
  ├── pages/
  │   └── SubmitCommissionPage.jsx # from pages/SubmitCommission.jsx
  ├── store/
  │   └── commissions.slice.js # from store/slices/commissionSlice.js
  └── services/
      └── commissions.service.js
```

#### ADMIN Feature

```
features/admin/
  ├── components/
  │   ├── AuctionItemDelete/  # from pages/Dashboard/sub-components/
  │   ├── BiddersAuctioneersGraph/
  │   ├── PaymentGraph/
  │   └── PaymentProofs/
  ├── pages/
  │   └── DashboardPage.jsx   # from pages/Dashboard/Dashboard.jsx
  ├── store/
  │   └── admin.slice.js      # from store/slices/superAdminSlice.js
  └── services/
      └── admin.service.js
```

#### PROFILE Feature

```
features/profile/
  ├── pages/
  │   └── ProfilePage.jsx     # from pages/UserProfile.jsx
  └── services/
      └── profile.service.js
```

#### LEADERBOARD Feature

```
features/leaderboard/
  ├── components/
  │   └── LeaderboardCard/    # from pages/home-sub-components/Leaderboard.jsx
  ├── pages/
  │   └── LeaderboardPage.jsx # from pages/Leaderboard.jsx
  └── services/
      └── leaderboard.service.js
```

### Step 4: Update App.jsx Routes

**Before**:

```jsx
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// ...
```

**After**:

```jsx
import HomePage from "./pages/HomePage"; // Keep Home as special
import LoginPage from "./features/auth/pages/LoginPage";
import SignUpPage from "./features/auth/pages/SignUpPage";
import AuctionsPage from "./features/auctions/pages/AuctionsPage";
// ...
```

### Step 5: Update Redux Store

**Before** (store/store.js):

```javascript
import userReducer from "./slices/userSlice";
import auctionReducer from "./slices/auctionSlice";
// ...
```

**After**:

```javascript
import authReducer from "../features/auth/store/auth.slice";
import usersReducer from "../features/users/store/users.slice";
import auctionsReducer from "../features/auctions/store/auctions.slice";
import bidsReducer from "../features/bids/store/bids.slice";
import commissionsReducer from "../features/commissions/store/commissions.slice";
import adminReducer from "../features/admin/store/admin.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    auctions: auctionsReducer,
    bids: bidsReducer,
    commissions: commissionsReducer,
    admin: adminReducer,
  },
});
```

---

## Phase 3: Testing After Migration

### Backend Testing Checklist

```bash
# Test authentication
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/logout

# Test users
GET  /api/v1/users/me
GET  /api/v1/users/leaderboard

# Test auctions
POST /api/v1/auctions/create
GET  /api/v1/auctions/allitems
GET  /api/v1/auctions/:id
GET  /api/v1/auctions/myitems
DELETE /api/v1/auctions/:id
PUT  /api/v1/auctions/republish/:id

# Test bids
POST /api/v1/bids/place/:id

# Test commissions
POST /api/v1/commissions/proof

# Test admin
GET  /api/v1/admin/paymentproofs
GET  /api/v1/admin/users
GET  /api/v1/admin/monthlyincome
```

### Frontend Testing Checklist

- [ ] Home page loads
- [ ] Login works
- [ ] Registration works
- [ ] View auctions
- [ ] Create auction
- [ ] Place bid
- [ ] Submit commission
- [ ] Admin dashboard
- [ ] User profile
- [ ] Leaderboard
- [ ] All navigation links work

---

## Phase 4: Cleanup

### Remove Old Directories

**Backend**:

```bash
rm -rf backend/controllers
rm -rf backend/models
rm -rf backend/router
rm -rf backend/middlewares
rm -rf backend/automation
rm -rf backend/utils
rm -rf backend/database
```

**Frontend**:

```bash
rm -rf frontend/src/pages
rm -rf frontend/src/store/slices
rm -rf frontend/src/layout
rm -rf frontend/src/custom-components
rm -rf frontend/src/lib
```

**Keep**:

- `config/` folders
- `assets/`
- `components/` (if has shadcn/ui)

---

## Migration Script (Optional)

Create a script to automate some moves:

```bash
#!/bin/bash
# migrate-backend.sh

echo "Creating feature directories..."
mkdir -p backend/features/{auth,users,auctions/jobs,bids,commissions/jobs,admin/analytics}
mkdir -p backend/shared/{middlewares,utils,constants}

echo "Moving files..."
# Move middlewares
mv backend/middlewares/auth.js backend/shared/middlewares/auth.middleware.js
mv backend/middlewares/error.js backend/shared/middlewares/error.middleware.js
mv backend/middlewares/catchAsyncErrors.js backend/shared/middlewares/async.middleware.js

# Move utils
mv backend/utils/jwtToken.js backend/shared/utils/jwt.util.js
mv backend/utils/sendEmail.js backend/shared/utils/email.util.js

# Move models
mv backend/models/userSchema.js backend/features/users/users.model.js
mv backend/models/auctionSchema.js backend/features/auctions/auctions.model.js
mv backend/models/bidSchema.js backend/features/bids/bids.model.js
mv backend/models/commissionSchema.js backend/features/commissions/commissions.model.js
mv backend/models/commissionProofSchema.js backend/features/commissions/proof.model.js

echo "Done! Now update imports manually."
```

---

## Common Issues & Solutions

### Issue 1: Import Path Errors

**Problem**: `Cannot find module '../models/userSchema.js'`
**Solution**: Update to `../users/users.model.js` or correct relative path

### Issue 2: Circular Dependencies

**Problem**: Feature A imports Feature B, Feature B imports Feature A
**Solution**: Create a shared service or use events

### Issue 3: Middleware Not Found

**Problem**: Auth middleware not found
**Solution**: Update path to `../../shared/middlewares/auth.middleware.js`

### Issue 4: Redux State Access

**Problem**: `state.user` is undefined
**Solution**: Update to `state.auth` or new slice name

---

## Documentation Updates Needed

After migration, update these files:

- [ ] README.md - Update structure section
- [ ] ARCHITECTURE.md - Mark as implemented
- [ ] HANDOFF.md - Update file paths
- [ ] FILE_STRUCTURE.txt - Update with new structure

---

## Benefits Achieved

After migration, you'll have:

✅ **Feature-based structure** - Industry standard
✅ **Better organization** - Easy to find code
✅ **Parallel development** - No conflicts
✅ **Clear boundaries** - Each feature isolated
✅ **Easier testing** - Test features independently
✅ **Better scalability** - Add features easily
✅ **Improved maintainability** - Clear code organization

---

## Timeline Estimate

- **Backend Migration**: 4-6 hours
- **Frontend Migration**: 4-6 hours
- **Testing**: 2-3 hours
- **Documentation**: 1-2 hours
- **Total**: 1-2 days

---

## Next Steps

1. **Backup everything**: Commit current state
2. **Create branches**: `feature/backend-restructure`, `feature/frontend-restructure`
3. **Start with backend**: Easier to test
4. **Then frontend**: Update imports
5. **Test thoroughly**: Check all features
6. **Merge to main**: Once everything works

---

**Ready to start? Let me know if you want me to implement this restructuring!**
