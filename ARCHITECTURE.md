# 🏗️ Architecture Documentation - Feature-Based Structure

## Overview

This application follows **Feature-Based Architecture** (also called Domain-Driven Design or Vertical Slice Architecture), which is an industry-standard practice for building scalable, maintainable applications.

## Why Feature-Based Architecture?

### Benefits:

1. **High Cohesion**: Related code is grouped together
2. **Easy to Find**: All code for a feature is in one place
3. **Parallel Development**: Multiple devs can work on different features without conflicts
4. **Easy to Scale**: Add new features without affecting existing ones
5. **Clear Boundaries**: Each feature is self-contained
6. **Better Testing**: Test entire features in isolation
7. **Easier Onboarding**: New developers can understand one feature at a time

### Before vs After:

**❌ Old (Layer-Based):**

```
backend/
  controllers/
    userController.js
    auctionController.js
    bidController.js
  models/
    userModel.js
    auctionModel.js
    bidModel.js
  routes/
    userRoutes.js
    auctionRoutes.js
    bidRoutes.js
```

_Problem: To work on "auctions", you touch 3+ different folders_

**✅ New (Feature-Based):**

```
backend/
  features/
    auctions/
      auctions.controller.js
      auctions.model.js
      auctions.routes.js
      auctions.service.js
      auctions.validation.js
```

_Solution: All auction code in one place!_

---

## Backend Structure

```
backend/
├── server.js                    # Server entry point
├── app.js                       # Express app setup
│
├── config/                      # Global configuration
│   ├── database.config.js       # Database connection
│   ├── cloudinary.config.js     # Cloudinary setup
│   ├── app.config.js            # App-level settings
│   └── env.config.js            # Environment variables
│
├── shared/                      # Shared utilities (used by all features)
│   ├── middlewares/
│   │   ├── auth.middleware.js   # Authentication
│   │   ├── error.middleware.js  # Error handling
│   │   └── async.middleware.js  # Async wrapper
│   ├── utils/
│   │   ├── email.util.js        # Email sender
│   │   ├── jwt.util.js          # JWT helper
│   │   └── response.util.js     # Standard responses
│   └── constants/
│       └── app.constants.js     # Global constants
│
└── features/                    # Feature modules
    ├── auth/                    # Authentication feature
    │   ├── auth.controller.js
    │   ├── auth.routes.js
    │   ├── auth.service.js
    │   └── auth.validation.js
    │
    ├── users/                   # User management
    │   ├── users.controller.js
    │   ├── users.model.js
    │   ├── users.routes.js
    │   ├── users.service.js
    │   └── users.validation.js
    │
    ├── auctions/                # Auction management
    │   ├── auctions.controller.js
    │   ├── auctions.model.js
    │   ├── auctions.routes.js
    │   ├── auctions.service.js
    │   ├── auctions.validation.js
    │   └── jobs/
    │       └── endedAuction.job.js
    │
    ├── bids/                    # Bidding system
    │   ├── bids.controller.js
    │   ├── bids.model.js
    │   ├── bids.routes.js
    │   ├── bids.service.js
    │   └── bids.validation.js
    │
    ├── commissions/             # Commission management
    │   ├── commissions.controller.js
    │   ├── commissions.model.js
    │   ├── commissions.routes.js
    │   ├── commissions.service.js
    │   ├── commissions.validation.js
    │   └── jobs/
    │       └── verifyCommission.job.js
    │
    └── admin/                   # Admin features
        ├── admin.controller.js
        ├── admin.routes.js
        ├── admin.service.js
        └── analytics/
            ├── users.analytics.js
            └── revenue.analytics.js
```

### Feature Folder Structure:

Each feature folder contains:

- **`.controller.js`** - Request handlers (thin layer)
- **`.service.js`** - Business logic (thick layer)
- **`.model.js`** - Database schema
- **`.routes.js`** - API endpoints
- **`.validation.js`** - Input validation
- **`.test.js`** - Tests (future)
- **`/jobs/`** - Cron jobs specific to feature
- **`/utils/`** - Feature-specific utilities

---

## Frontend Structure

```
frontend/src/
├── main.jsx                     # React entry point
├── App.jsx                      # Main app component
│
├── config/                      # Global configuration
│   └── app.config.js            # Branding & settings
│
├── shared/                      # Shared across all features
│   ├── components/              # Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── Spinner/
│   ├── layouts/
│   │   ├── MainLayout/
│   │   ├── SideDrawer/
│   │   └── DashboardLayout/
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   └── useToast.js
│   ├── utils/
│   │   ├── api.util.js          # Axios setup
│   │   ├── format.util.js       # Formatters
│   │   └── validation.util.js   # Validators
│   └── constants/
│       └── routes.constants.js  # Route paths
│
└── features/                    # Feature modules
    ├── auth/                    # Authentication
    │   ├── components/
    │   │   ├── LoginForm/
    │   │   └── SignUpForm/
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   └── SignUpPage.jsx
    │   ├── store/
    │   │   └── auth.slice.js
    │   ├── hooks/
    │   │   └── useAuth.js
    │   └── services/
    │       └── auth.service.js
    │
    ├── auctions/                # Auction management
    │   ├── components/
    │   │   ├── AuctionCard/
    │   │   ├── AuctionForm/
    │   │   ├── AuctionList/
    │   │   └── AuctionFilters/
    │   ├── pages/
    │   │   ├── AuctionsPage.jsx
    │   │   ├── AuctionDetailsPage.jsx
    │   │   ├── CreateAuctionPage.jsx
    │   │   └── MyAuctionsPage.jsx
    │   ├── store/
    │   │   └── auctions.slice.js
    │   ├── hooks/
    │   │   ├── useAuctions.js
    │   │   └── useAuctionDetails.js
    │   └── services/
    │       └── auctions.service.js
    │
    ├── bids/                    # Bidding system
    │   ├── components/
    │   │   ├── BidForm/
    │   │   ├── BidHistory/
    │   │   └── BidCard/
    │   ├── store/
    │   │   └── bids.slice.js
    │   ├── hooks/
    │   │   └── useBid.js
    │   └── services/
    │       └── bids.service.js
    │
    ├── commissions/             # Commission management
    │   ├── components/
    │   │   └── CommissionForm/
    │   ├── pages/
    │   │   └── SubmitCommissionPage.jsx
    │   ├── store/
    │   │   └── commissions.slice.js
    │   └── services/
    │       └── commissions.service.js
    │
    ├── admin/                   # Admin dashboard
    │   ├── components/
    │   │   ├── AnalyticsChart/
    │   │   ├── PaymentProofCard/
    │   │   └── UserStats/
    │   ├── pages/
    │   │   └── DashboardPage.jsx
    │   ├── store/
    │   │   └── admin.slice.js
    │   └── services/
    │       └── admin.service.js
    │
    ├── profile/                 # User profile
    │   ├── components/
    │   │   └── ProfileForm/
    │   ├── pages/
    │   │   └── ProfilePage.jsx
    │   └── services/
    │       └── profile.service.js
    │
    └── leaderboard/             # Leaderboard
        ├── components/
        │   └── LeaderboardCard/
        ├── pages/
        │   └── LeaderboardPage.jsx
        └── services/
            └── leaderboard.service.js
```

### Feature Folder Structure:

Each feature folder contains:

- **`/components/`** - Feature-specific React components
- **`/pages/`** - Feature pages/screens
- **`/store/`** - Redux slice for the feature
- **`/hooks/`** - Custom hooks for the feature
- **`/services/`** - API calls for the feature
- **`/utils/`** - Feature-specific utilities
- **`/types/`** - TypeScript types (if using TS)
- **`/constants/`** - Feature constants

---

## Key Principles

### 1. **Feature Independence**

Each feature should be as independent as possible:

- Has its own routes, controllers, models
- Can be developed/tested/deployed independently
- Minimal dependencies on other features

### 2. **Shared Resources**

Common code goes in `shared/`:

- Authentication middleware
- Error handling
- Utilities used by multiple features
- Global constants

### 3. **Clear Boundaries**

- Features communicate through well-defined interfaces
- No direct imports between features
- Use events or shared services for cross-feature communication

### 4. **Single Responsibility**

- Each feature handles ONE domain concept
- Controller = HTTP handling
- Service = Business logic
- Model = Data structure

### 5. **Dependency Direction**

```
Features → Shared → Core
```

- Features can use Shared
- Shared can use Core config
- Features CANNOT depend on other Features directly

---

## File Naming Conventions

### Backend:

- **Controllers**: `feature.controller.js`
- **Services**: `feature.service.js`
- **Models**: `feature.model.js`
- **Routes**: `feature.routes.js`
- **Validation**: `feature.validation.js`
- **Tests**: `feature.test.js`
- **Jobs**: `featureName.job.js`

### Frontend:

- **Components**: `ComponentName/index.jsx` + `ComponentName.module.css`
- **Pages**: `PageName.jsx`
- **Slices**: `feature.slice.js`
- **Services**: `feature.service.js`
- **Hooks**: `useFeatureName.js`
- **Utils**: `feature.util.js`

---

## Migration Strategy

### Phase 1: Backend Restructuring ✅

1. Create `features/` and `shared/` directories
2. Move and reorganize existing code
3. Update imports and references
4. Test all endpoints

### Phase 2: Frontend Restructuring ✅

1. Create `features/` and `shared/` directories
2. Move pages, components, and store slices
3. Update imports in App.jsx
4. Test all routes

### Phase 3: Documentation ✅

1. Update README with new structure
2. Create this ARCHITECTURE.md
3. Document each feature's purpose

### Phase 4: Future Enhancements

1. Add feature-specific tests
2. Implement service layer pattern
3. Add API documentation per feature
4. Add feature flags

---

## Adding a New Feature

### Backend:

```bash
# 1. Create feature directory
mkdir backend/features/newfeature

# 2. Create feature files
touch backend/features/newfeature/newfeature.controller.js
touch backend/features/newfeature/newfeature.service.js
touch backend/features/newfeature/newfeature.model.js
touch backend/features/newfeature/newfeature.routes.js
touch backend/features/newfeature/newfeature.validation.js

# 3. Register routes in app.js
# Import and use the routes
```

### Frontend:

```bash
# 1. Create feature directory
mkdir frontend/src/features/newfeature

# 2. Create structure
mkdir frontend/src/features/newfeature/components
mkdir frontend/src/features/newfeature/pages
mkdir frontend/src/features/newfeature/store
mkdir frontend/src/features/newfeature/services

# 3. Create files
touch frontend/src/features/newfeature/pages/NewFeaturePage.jsx
touch frontend/src/features/newfeature/store/newfeature.slice.js
touch frontend/src/features/newfeature/services/newfeature.service.js

# 4. Add route in App.jsx
```

---

## Benefits in Practice

### Scenario 1: New Developer

**Old Way**: "Find all user-related code"

- controllers/userController.js
- models/userSchema.js
- router/userRoutes.js
- utils/jwtToken.js (maybe?)
- middlewares/auth.js (maybe?)

**New Way**: "Find all user-related code"

- Look in `features/users/` ✓

### Scenario 2: Feature Team

**Old Way**: 3 devs working on auctions, bids, commissions

- Constant merge conflicts in controllers/, models/, routes/

**New Way**: 3 devs working on different features

- Dev 1: features/auctions/
- Dev 2: features/bids/
- Dev 3: features/commissions/
- No conflicts! ✓

### Scenario 3: Bug in Bidding

**Old Way**: Search across entire codebase

**New Way**: Check `features/bids/` first, then `shared/` if needed ✓

### Scenario 4: Remove a Feature

**Old Way**: Find and delete code from 10+ different folders

**New Way**: Delete `features/featureName/` folder ✓

---

## Testing Strategy

### Unit Tests

Each feature has its own test file:

```
features/auctions/
  auctions.test.js      # Unit tests
  auctions.integration.test.js  # Integration tests
```

### Integration Tests

Test feature interactions:

```
tests/integration/
  auctions-bids.test.js  # Test auction + bidding flow
```

### E2E Tests

Test complete user flows:

```
tests/e2e/
  create-auction-and-bid.test.js
```

---

## Performance Considerations

### Code Splitting (Frontend)

Features can be lazy-loaded:

```jsx
const AuctionsPage = lazy(() =>
  import("./features/auctions/pages/AuctionsPage")
);
```

### Caching

Feature-level caching strategies:

```javascript
// features/auctions/auctions.service.js
const cache = new Map();
export const getCachedAuctions = () => {
  // Feature-specific cache
};
```

---

## Monorepo Considerations (Future)

This structure scales well to monorepo:

```
packages/
  backend/
    features/
      auctions/
      bids/
  frontend/
    features/
      auctions/
      bids/
  shared/
    types/      # Shared TypeScript types
    constants/  # Shared constants
```

---

## References

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Vertical Slice Architecture](https://jimmybogard.com/vertical-slice-architecture/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

## Summary

**Feature-Based Architecture = Industry Standard**

✅ Scalable
✅ Maintainable
✅ Team-friendly
✅ Easy to understand
✅ Production-ready

This structure will serve you well as the application grows!
