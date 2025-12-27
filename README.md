# Nilamee - Transparent Auction Platform

A full-stack MERN (MongoDB, Express, React, Node.js) auction platform with transparent bidding and automated commission tracking.

## 🎯 Features

- **User Authentication** - Secure registration and login with JWT
- **Multiple User Roles** - Bidder, Auctioneer, and Super Admin roles
- **Auction Management** - Create, view, and manage auctions
- **Real-time Bidding** - Place bids and track auction status
- **Commission System** - Automated commission tracking for auctioneers (5% fee)
- **Payment Proofs** - Upload and verify payment documentation
- **Leaderboard** - Track top bidders by spending
- **Dashboard** - Admin analytics with charts and graphs
- **Email Notifications** - Automated emails for auction events
- **File Uploads** - Cloudinary integration for image handling

## 🛠️ Tech Stack

**Frontend:**

- React 18 with Vite
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Chart.js for data visualization
- Axios for API calls
- React Toastify for notifications

**Backend:**

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary for file storage
- Node-cron for scheduled tasks
- Nodemailer for emails

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Cloudinary Account** (free) - [Sign up](https://cloudinary.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nilamee
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment variables (see Backend Configuration below)
```

**Backend Configuration:**

Edit `backend/config/config.env` with your settings:

```env
# Server Configuration
PORT = 5000

# Cloudinary Configuration (Get from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL = http://localhost:5173

# MongoDB Connection
MONGO_URI = mongodb://127.0.0.1:27017

# JWT Configuration
JWT_SECRET_KEY = your_secret_key_here_change_this
JWT_EXPIRE = 7d

# Cookie Configuration
COOKIE_EXPIRE = 7
```

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**

```bash
# MongoDB should start automatically if installed as a service
# Or run manually:
mongod
```

**macOS/Linux:**

```bash
sudo systemctl start mongodb
# or
mongod
```

### 5. Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🎨 Customization - Brand Configuration

The app name "Nilamee" and all branding elements are centrally configured and can be easily changed.

### Changing the App Name and Branding

**Frontend Configuration:**

Edit `frontend/src/config/appConfig.js`:

```javascript
export const appConfig = {
  appName: "YourAppName", // Changes throughout the app
  tagline: "Your Custom Tagline", // Homepage tagline
  mainHeading1: "Your Heading 1", // Homepage main heading
  mainHeading2: "Your Heading 2", // Homepage secondary heading
  companyName: "YourCompany, LLC.", // Footer copyright
  developerName: "YourName", // Developer credit

  // Social media links
  socialMedia: {
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourpage",
  },

  // Contact information
  contactEmail: "info@yourapp.com",
  supportEmail: "support@yourapp.com",

  // SEO settings
  seo: {
    title: "YourApp - Description",
    description: "Your app description",
    keywords: "your, keywords, here",
  },
};
```

**Backend Configuration:**

Edit `backend/config/appConfig.js`:

```javascript
export const appConfig = {
  appName: "YourAppName",
  databaseName: "YOUR_AUCTION_PLATFORM",

  emailConfig: {
    fromName: "YourApp Auctions",
    supportEmail: "support@yourapp.com",
    noReplyEmail: "noreply@yourapp.com",
  },

  settings: {
    commissionPercentage: 5, // Auctioneer fee percentage
    defaultCurrency: "USD",
    auctionMinDuration: 1,
  },
};
```

After changing the configuration, simply restart both servers. All changes will automatically reflect throughout the application!

## 📁 Project Structure

```
nilamee/
├── backend/
│   ├── automation/          # Cron jobs
│   ├── config/              # Configuration files
│   │   ├── appConfig.js     # ✨ App branding config
│   │   └── config.env       # Environment variables
│   ├── controllers/         # Route controllers
│   ├── database/            # Database connection
│   ├── middlewares/         # Express middlewares
│   ├── models/              # MongoDB schemas
│   ├── router/              # API routes
│   ├── utils/               # Utility functions
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/          # Images, icons
│   │   ├── components/      # Reusable UI components
│   │   ├── config/          # Configuration files
│   │   │   └── appConfig.js # ✨ App branding config
│   │   ├── custom-components/ # Custom components
│   │   ├── layout/          # Layout components
│   │   ├── lib/             # Utility libraries
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store & slices
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # React entry point
│   └── index.html           # HTML template
│
└── README.md                # This file
```

## 👥 User Roles

1. **Bidder** - Can browse auctions and place bids
2. **Auctioneer** - Can create auctions and manage listings
3. **Super Admin** - Full access to dashboard and admin features

## 🔧 Development Scripts

**Backend:**

```bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload)
```

**Frontend:**

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod --version`
- Check MongoDB is accessible at `mongodb://127.0.0.1:27017`
- Verify firewall settings

### Cloudinary Upload Issues

- Verify your Cloudinary credentials in `config.env`
- Check API key permissions in Cloudinary dashboard
- Ensure upload preset allows unsigned uploads (if used)

### CORS Errors

- Verify `FRONTEND_URL` in `backend/config/config.env` matches your frontend URL
- For production, update to your deployed frontend URL

### Port Already in Use

```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

## 📦 Production Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set all environment variables
2. Update `FRONTEND_URL` to your deployed frontend URL
3. Ensure MongoDB is accessible (use MongoDB Atlas for cloud)

### Frontend Deployment (Vercel/Netlify)

1. Update API URLs in Redux slices to point to deployed backend
2. Build the app: `npm run build`
3. Deploy the `dist` folder

## 🔐 Security Notes

⚠️ **Important for Production:**

- Change the `JWT_SECRET_KEY` to a strong, unique value
- Use environment-specific `.env` files
- Never commit sensitive credentials to Git
- Use MongoDB Atlas or secure MongoDB instance
- Enable rate limiting on API endpoints
- Implement proper input validation
- Use HTTPS in production

## 📝 API Endpoints

### User Routes (`/api/v1/user`)

- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile
- `GET /logout` - User logout
- `GET /leaderboard` - Fetch leaderboard

### Auction Routes (`/api/v1/auctionitem`)

- `POST /create` - Create auction (Auctioneer only)
- `GET /allitems` - Get all auctions
- `GET /auction/:id` - Get auction details
- `GET /myitems` - Get user's auctions
- `DELETE /delete/:id` - Delete auction

### Bid Routes (`/api/v1/bid`)

- `POST /place/:id` - Place bid on auction
- `GET /mybids` - Get user's bids

### Commission Routes (`/api/v1/commission`)

- `POST /proof` - Submit commission proof
- `GET /proofs` - Get all commission proofs

### Super Admin Routes (`/api/v1/superadmin`)

- Various admin management endpoints

## 🤝 Contributing

This is a base application provided for customization. Feel free to:

- Add new features as per client requirements
- Modify existing functionality
- Improve UI/UX
- Add tests
- Enhance security

## 📄 License

This project is provided as-is for educational and commercial use.

## 💬 Support

For issues or questions:

- Check the troubleshooting section
- Review the code comments
- Consult with your supervisor

---

**Built with ❤️ for transparency in auctions**
