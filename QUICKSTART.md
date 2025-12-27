# 🚀 QUICK START GUIDE - NILAMEE AUCTION PLATFORM

## ⚡ Quick Commands Reference

### First Time Setup

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install

# 3. Start MongoDB (if not running as service)
mongod
```

### Daily Development Workflow

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev

# Open browser: http://localhost:5173
```

---

## 📝 MUST DO BEFORE RUNNING

### 1. Configure Backend Environment

**File:** `backend/config/config.env`

Replace these values:

```env
CLOUDINARY_CLOUD_NAME = GET_FROM_CLOUDINARY_DASHBOARD
CLOUDINARY_API_KEY = GET_FROM_CLOUDINARY_DASHBOARD
CLOUDINARY_API_SECRET = GET_FROM_CLOUDINARY_DASHBOARD
JWT_SECRET_KEY = CHANGE_TO_RANDOM_STRING
```

✅ Already configured:

- PORT = 5000
- FRONTEND_URL = http://localhost:5173 ✓ (Fixed!)
- MONGO_URI = mongodb://127.0.0.1:27017

---

## 🎨 Change App Name/Branding

**Edit:** `frontend/src/config/appConfig.js`

```javascript
appName: "YourAppName"; // Changes everywhere!
```

**Edit:** `backend/config/appConfig.js`

```javascript
appName: "YourAppName";
databaseName: "YOUR_DATABASE_NAME";
```

Then restart both servers. That's it!

---

## 🔍 Verify Setup Working

1. ✅ Backend starts: "Server listening on port 5000"
2. ✅ Database connects: "Connected to database."
3. ✅ Frontend opens: http://localhost:5173
4. ✅ Can see Nilamee homepage
5. ✅ Can click "Sign Up" button

---

## 🐛 Quick Troubleshooting

### MongoDB not connecting?

```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB manually
mongod
```

### Port 5000 already in use?

```bash
# Windows - Kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS errors?

- Check `FRONTEND_URL` in `backend/config/config.env` = http://localhost:5173
- Restart backend server

### Cloudinary upload not working?

- Get real credentials from https://cloudinary.com/console
- Update in `backend/config/config.env`

---

## 📚 Documentation Files

- **README.md** - Complete documentation
- **SETUP.md** - Detailed setup checklist
- **BRANDING.md** - How to customize app name/branding

---

## 🏗️ Project Structure

```
nilamee/
├── backend/              # Node.js + Express API
│   ├── config/
│   │   ├── appConfig.js  # ✨ Brand config
│   │   └── config.env    # ⚙️ Environment variables
│   ├── controllers/      # API logic
│   ├── models/          # MongoDB schemas
│   └── router/          # API routes
│
├── frontend/            # React + Vite app
│   └── src/
│       ├── config/
│       │   └── appConfig.js  # ✨ Brand config
│       ├── pages/       # Page components
│       └── store/       # Redux state
│
├── README.md           # 📖 Full documentation
├── SETUP.md            # ✅ Setup checklist
├── BRANDING.md         # 🎨 Branding guide
└── QUICKSTART.md       # ⚡ This file
```

---

## 👤 User Roles in the System

1. **Bidder** - Browse and bid on auctions
2. **Auctioneer** - Create and manage auctions
3. **Super Admin** - Dashboard and full access

---

## 📞 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Base:** http://localhost:5000/api/v1/

---

## 🎯 Next Steps for Intern

1. ✅ Get the app running locally
2. ✅ Test registration and login
3. ✅ Explore all pages and features
4. ✅ Understand the codebase structure
5. ⏳ Wait for client requirements
6. ⏳ Plan and implement new features

---

**Good luck! You've got this! 🚀**
