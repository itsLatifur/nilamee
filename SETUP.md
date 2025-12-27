# Quick Setup Checklist

## ✅ Pre-Setup Checklist

- [ ] Node.js installed (v16+) - Check with: `node --version`
- [ ] MongoDB installed and running - Check with: `mongod --version`
- [ ] Git installed - Check with: `git --version`
- [ ] Cloudinary account created - [Sign up here](https://cloudinary.com/)

## 🔧 Configuration Required

### 1. Backend Environment Variables

**File:** `backend/config/config.env`

**Must Change:**

- [ ] `CLOUDINARY_CLOUD_NAME` - Get from Cloudinary dashboard
- [ ] `CLOUDINARY_API_KEY` - Get from Cloudinary dashboard
- [ ] `CLOUDINARY_API_SECRET` - Get from Cloudinary dashboard
- [ ] `JWT_SECRET_KEY` - Change to a strong random string

**Already Configured:**

- [x] `PORT = 5000`
- [x] `FRONTEND_URL = http://localhost:5173`
- [x] `MONGO_URI = mongodb://127.0.0.1:27017`
- [x] `JWT_EXPIRE = 7d`
- [x] `COOKIE_EXPIRE = 7`

### 2. Branding Configuration

**File:** `frontend/src/config/appConfig.js`

Current settings:

- [x] App Name: "Nilamee"
- [x] Tagline: "Transparency Leads to Your Victory"
- [x] Company: "Nilamee, LLC."

**To customize:** Simply edit the values in this file and restart the app!

### 3. Backend App Configuration

**File:** `backend/config/appConfig.js`

Current settings:

- [x] Database Name: "NILAMEE_AUCTION_PLATFORM"
- [x] Commission Rate: 5%

## 📦 Installation Steps

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### 1. Start MongoDB

Make sure MongoDB is running on your system.

### 2. Start Backend (Terminal 1)

```bash
cd backend
npm start
```

Should see: "Server listening on port 5000" and "Connected to database."

### 3. Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Should see: "Local: http://localhost:5173/"

## 🧪 Testing the Setup

1. **Open Browser:** Navigate to `http://localhost:5173`
2. **Check Frontend:** You should see the Nilamee homepage
3. **Test Registration:** Try creating a new user account
4. **Check Backend Logs:** Should see API requests in backend terminal
5. **Check MongoDB:** Database "NILAMEE_AUCTION_PLATFORM" should be created

## ⚠️ Common Issues and Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:**

- Ensure MongoDB is running: `mongod`
- Check if port 27017 is available

### Issue: "Cloudinary upload fails"

**Solution:**

- Update Cloudinary credentials in `config.env`
- Verify credentials are correct in Cloudinary dashboard

### Issue: "CORS error"

**Solution:**

- Verify `FRONTEND_URL` in `backend/config/config.env` is `http://localhost:5173`
- Restart backend server after changes

### Issue: "Port 5000 already in use"

**Solution:**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: "Module not found"

**Solution:**

- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

## 📊 Verify Setup

After starting both servers, verify:

- [ ] Frontend loads at http://localhost:5173
- [ ] Backend responds at http://localhost:5000
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can view auctions page
- [ ] No console errors in browser
- [ ] No errors in terminal logs

## 🎯 Next Steps

Once setup is complete:

1. Test all features (registration, login, auction creation, bidding)
2. Create test users with different roles
3. Familiarize yourself with the codebase
4. Wait for client requirements
5. Plan feature additions

## 📝 Notes for Development

- Keep both backend and frontend running during development
- Changes to backend require server restart (unless using nodemon)
- Frontend has hot-reload enabled (changes apply automatically)
- Check browser console for frontend errors
- Check terminal for backend errors
- Use Redux DevTools extension for state debugging

---

**Need Help?** Refer to README.md for detailed documentation.
