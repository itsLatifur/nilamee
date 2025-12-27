# Testing Guide After Restructuring

## 🎯 Overview

The codebase has been successfully restructured from a **layer-based architecture** to a **feature-based architecture**. All files have been moved and import paths have been updated. Now you need to test that everything still works correctly.

## ⚠️ Current Status

✅ **Completed:**

- Backend feature reorganization
- Frontend feature reorganization
- Import path updates in main files (app.js, App.jsx, store.js)
- Shared utilities and middlewares centralized

⚠️ **Needs Attention:**

- Some component-level imports may still reference old paths
- Old files still exist (should be deleted after testing)
- Application functionality needs verification

## 🧪 Step-by-Step Testing Guide

### Step 1: Backend Testing

#### 1.1 Install Dependencies and Start Server

```bash
cd d:\Projects\nilamee\backend
npm install
npm start
```

**Expected Output:**

```
Server connected to database successfully.
Server is running on port: 4000
Cron for ended auction running...
Running Verify Commission Cron...
```

**If you see errors:**

- Check error message for missing imports
- Look for old import paths like `"../models/..."` or `"../middlewares/..."`
- Update to new paths: `"../features/{feature}/{file}"` or `"../../shared/..."`

#### 1.2 Test API Endpoints

Use Postman, Thunder Client, or curl to test these endpoints:

**Authentication:**

- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login
- `GET /api/v1/user/me` - Get current user (requires auth)
- `GET /api/v1/user/logout` - Logout

**Auctions:**

- `GET /api/v1/auctionitem/allitems` - Get all auctions
- `POST /api/v1/auctionitem/create` - Create auction (Auctioneer only)
- `GET /api/v1/auctionitem/auction/:id` - Get auction details
- `GET /api/v1/auctionitem/myitems` - Get my auctions (Auctioneer only)
- `DELETE /api/v1/auctionitem/delete/:id` - Delete auction (Auctioneer only)
- `PUT /api/v1/auctionitem/item/republish/:id` - Republish auction (Auctioneer only)

**Bids:**

- `POST /api/v1/bid/place/:id` - Place bid (Bidder only)

**Commissions:**

- `POST /api/v1/commission/proof` - Submit commission proof (Auctioneer only)

**Admin:**

- `GET /api/v1/superadmin/paymentproofs/getall` - Get all payment proofs
- `GET /api/v1/superadmin/users/getall` - Get user statistics
- `GET /api/v1/superadmin/monthlyincome` - Get monthly revenue
- `PUT /api/v1/superadmin/paymentproof/status/update/:id` - Update proof status
- `DELETE /api/v1/superadmin/auctionitem/delete/:id` - Delete auction
- `DELETE /api/v1/superadmin/paymentproof/delete/:id` - Delete payment proof

**Leaderboard:**

- `GET /api/v1/user/leaderboard` - Get top bidders

### Step 2: Frontend Testing

#### 2.1 Install Dependencies and Start Dev Server

```bash
cd d:\Projects\nilamee\frontend
npm install
npm run dev
```

**Expected Output:**

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**If you see errors:**

- Check browser console for import errors
- Look for 404 errors for missing component imports
- Check for old import paths in page/component files

#### 2.2 Test Each Page

Open `http://localhost:5173` and test all pages:

**Public Pages:**

- [ ] `/` - Home page loads
- [ ] `/about` - About page loads
- [ ] `/how-it-works-info` - How It Works page loads
- [ ] `/contact` - Contact page loads
- [ ] `/leaderboard` - Leaderboard displays

**Authentication:**

- [ ] `/sign-up` - Sign up form works
- [ ] `/login` - Login form works
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Can logout

**Auctions (Auctioneer):**

- [ ] `/auctions` - Browse auctions page
- [ ] `/create-auction` - Create auction form
- [ ] Can create a new auction
- [ ] `/view-my-auctions` - View own auctions
- [ ] `/auction/details/:id` - View auction details
- [ ] Can republish ended auction

**Auctions (Bidder):**

- [ ] `/auctions` - Browse auctions
- [ ] `/auction/item/:id` - View auction and place bid
- [ ] Can place a bid
- [ ] Bid updates in real-time

**Commissions (Auctioneer):**

- [ ] `/submit-commission` - Submit commission proof
- [ ] Can upload payment proof screenshot

**Profile:**

- [ ] `/me` - User profile displays correctly

**Admin (Super Admin):**

- [ ] `/dashboard` - Dashboard loads
- [ ] Payment proofs display
- [ ] User statistics graph displays
- [ ] Monthly revenue graph displays
- [ ] Can approve/reject payment proofs
- [ ] Can delete auctions

#### 2.3 Test Redux State Management

Open Redux DevTools in browser and verify:

- [ ] `user` slice updates on login/logout
- [ ] `auction` slice updates when fetching auctions
- [ ] `bid` slice updates when placing bids
- [ ] `commission` slice updates when submitting proof
- [ ] `superAdmin` slice updates on dashboard

### Step 3: Integration Testing

Test complete user workflows:

#### Workflow 1: Auctioneer Creates Auction

1. Register as Auctioneer
2. Login
3. Create a new auction with:
   - Title, description, category
   - Starting bid, start time, end time
   - Image upload
4. Verify auction appears in "My Auctions"
5. Verify auction appears in public auctions list

#### Workflow 2: Bidder Places Bid

1. Register as Bidder
2. Login
3. Browse auctions
4. Click on an active auction
5. Place a bid
6. Verify bid is recorded
7. Check if you appear in bidders list

#### Workflow 3: Commission Payment

1. Login as Auctioneer with ended auction
2. Go to Submit Commission
3. Upload payment proof
4. Login as Super Admin
5. Review and approve payment proof
6. Verify Auctioneer's unpaid commission decreases

#### Workflow 4: Admin Dashboard

1. Login as Super Admin
2. View dashboard
3. Check user statistics graph
4. Check monthly revenue graph
5. Review payment proofs
6. Approve/reject a proof

### Step 4: Cron Job Testing

#### Test Ended Auction Cron

1. Create an auction that ends in 2-3 minutes
2. Wait for auction to end
3. Wait for cron to run (every 1 minute)
4. Check console logs for "Cron for ended auction running..."
5. Verify:
   - Commission is calculated
   - Highest bidder is set
   - Winner receives email
   - Bidder's money spent and auctions won are updated

#### Test Commission Verification Cron

1. Submit a commission proof as Auctioneer
2. Approve it as Super Admin
3. Wait for cron to run (every 1 minute)
4. Check console logs for "Running Verify Commission Cron..."
5. Verify:
   - Unpaid commission decreases
   - Payment proof status changes to "Settled"
   - Auctioneer receives confirmation email

## 🐛 Common Issues and Fixes

### Issue 1: Import Error in Backend

**Error:** `Cannot find module '../models/userSchema.js'`

**Fix:** Update import path in the file:

```javascript
// Old
import { User } from "../models/userSchema.js";

// New
import { User } from "../features/users/users.model.js";
```

### Issue 2: Import Error in Frontend

**Error:** `Module not found: Can't resolve './store/slices/userSlice'`

**Fix:** Update import path:

```javascript
// Old
import { fetchUser } from "./store/slices/userSlice";

// New
import { fetchUser } from "./features/auth/store/userSlice";
```

### Issue 3: 404 on Frontend Page

**Error:** Page shows "Cannot GET /auctions"

**Fix:** Check that:

1. Route is defined in `App.jsx`
2. Component import path is correct
3. Component file exists in new location

### Issue 4: Redux Action Not Found

**Error:** `Cannot read property 'type' of undefined`

**Fix:**

1. Check that slice is registered in `store/store.js`
2. Verify import path to slice
3. Ensure action is exported from slice

### Issue 5: Backend Routes Not Working

**Error:** `Cannot POST /api/v1/user/register`

**Fix:**

1. Check that route is imported in `app.js`
2. Verify route file exports router correctly
3. Check middleware order in `app.js`

## 📋 Testing Checklist

### Backend

- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] All models are accessible
- [ ] All controllers execute properly
- [ ] All routes respond correctly
- [ ] Middleware functions work
- [ ] Cron jobs execute
- [ ] File uploads work (Cloudinary)
- [ ] Emails send successfully (Nodemailer)

### Frontend

- [ ] App loads without console errors
- [ ] All pages render
- [ ] Navigation works
- [ ] Forms submit successfully
- [ ] Redux state updates
- [ ] API calls work
- [ ] Image uploads work
- [ ] Redirects work after actions
- [ ] Toast notifications appear

### Integration

- [ ] User registration works end-to-end
- [ ] User login/logout works
- [ ] Auction creation works
- [ ] Bid placement works
- [ ] Commission submission works
- [ ] Admin approval workflow works
- [ ] Cron jobs process data correctly
- [ ] Email notifications sent

## 🔧 Debugging Tips

1. **Check Console Logs:**

   - Backend: Terminal where server is running
   - Frontend: Browser Developer Tools (F12) → Console tab

2. **Check Network Tab:**

   - Browser DevTools → Network tab
   - Look for failed API requests (red status codes)
   - Check request/response payloads

3. **Check Redux State:**

   - Install Redux DevTools browser extension
   - Inspect state changes after actions

4. **Check File Paths:**

   - Use VS Code's "Go to Definition" (F12) on imports
   - Verify files exist at imported paths

5. **Check Environment Variables:**
   - Ensure `backend/config/config.env` has all required variables
   - Check `FRONTEND_URL` is set correctly

## ✅ Success Criteria

The restructuring is successful when:

1. ✅ Backend server starts without errors
2. ✅ All API endpoints return expected responses
3. ✅ Frontend app loads without console errors
4. ✅ All pages render correctly
5. ✅ User can complete full workflows (register, login, create auction, place bid, etc.)
6. ✅ Cron jobs execute and process data
7. ✅ File uploads work
8. ✅ Emails are sent
9. ✅ No 404 or import errors

## 🚀 After Testing

Once everything works:

1. **Delete Old Files:**

   ```bash
   # Backend
   cd backend
   rm -rf controllers/ models/ router/ middlewares/ automation/

   # Frontend
   cd ../frontend/src
   rm -rf pages/ layout/ custom-components/ store/slices/
   ```

2. **Update Documentation:**

   - Update README.md with new structure
   - Add any lessons learned
   - Document any additional changes made

3. **Commit Changes:**

   ```bash
   git add .
   git commit -m "Restructure to feature-based architecture"
   git push
   ```

4. **Celebrate! 🎉**
   You now have a production-ready, maintainable, and scalable codebase!

---

**Need Help?**

- Check `RESTRUCTURING_COMPLETE.md` for detailed changes
- Check `QUICK_REFERENCE.md` for feature locations
- Check `ARCHITECTURE.md` for architectural explanations
