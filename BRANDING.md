# Branding Customization Guide

## 🎨 How to Change the App Name and Branding

The application is designed so you can change the name from "Nilamee" to any name the client wants, and it will update throughout the entire application.

## Frontend Branding Configuration

**Location:** `frontend/src/config/appConfig.js`

```javascript
export const appConfig = {
  // ============================================
  // MAIN BRANDING - Change these values
  // ============================================

  // This is the main app name shown everywhere
  appName: "Nilamee",

  // Homepage tagline/slogan
  tagline: "Transparency Leads to Your Victory",

  // Main headings on the homepage
  mainHeading1: "Transparent Auctions",
  mainHeading2: "Be The Winner",

  // Company name for copyright footer
  companyName: "Nilamee, LLC.",

  // Developer credit in footer
  developerName: "LATIFUR",
  developerLink: "/",

  // ============================================
  // SOCIAL MEDIA LINKS
  // ============================================
  socialMedia: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },

  // ============================================
  // CONTACT INFORMATION
  // ============================================
  contactEmail: "info@nilamee.com",
  supportEmail: "support@nilamee.com",

  // ============================================
  // THEME COLORS (Optional - for future use)
  // ============================================
  colors: {
    primary: "#D6482B",
    primaryHover: "#b8381e",
    secondary: "#DECCBE",
  },

  // ============================================
  // SEO SETTINGS
  // ============================================
  seo: {
    title: "Nilamee - Transparent Auction Platform",
    description:
      "A transparent auction platform where transparency leads to your victory",
    keywords: "auction, bidding, transparent auction, online auction",
  },
};
```

## Backend Configuration

**Location:** `backend/config/appConfig.js`

```javascript
export const appConfig = {
  // App name used in emails and backend operations
  appName: "Nilamee",

  // Database name in MongoDB
  databaseName: "NILAMEE_AUCTION_PLATFORM",

  // Email configuration for automated emails
  emailConfig: {
    fromName: "Nilamee Auctions",
    supportEmail: "support@nilamee.com",
    noReplyEmail: "noreply@nilamee.com",
  },

  // Application business rules
  settings: {
    commissionPercentage: 5, // Fee charged to auctioneers (%)
    defaultCurrency: "USD",
    auctionMinDuration: 1, // Minimum auction duration in days
  },
};
```

## Where the App Name Appears

When you change `appName` in the config, it updates in these locations:

### Frontend:

- ✅ **Header/Logo** - Top left navigation (SideDrawer.jsx)
- ✅ **Page Title** - Browser tab title (index.html)
- ✅ **Homepage** - Main headings and taglines (Home.jsx)
- ✅ **Footer** - Copyright and company name (SideDrawer.jsx)
- ✅ **Meta Tags** - SEO description and title (index.html)

### Backend:

- ✅ **Database Name** - MongoDB collection name (connection.js)
- ✅ **Email Templates** - Automated email sender name (when emails are configured)
- ✅ **API Responses** - Any messages that include the app name

## Example: Changing to "AuctionPro"

### Step 1: Edit Frontend Config

`frontend/src/config/appConfig.js`:

```javascript
export const appConfig = {
  appName: "AuctionPro",
  tagline: "Where Every Bid Counts",
  mainHeading1: "Professional Auctions",
  mainHeading2: "Bid With Confidence",
  companyName: "AuctionPro, Inc.",
  developerName: "Your Name",

  socialMedia: {
    facebook: "https://facebook.com/auctionpro",
    instagram: "https://instagram.com/auctionpro",
  },

  contactEmail: "info@auctionpro.com",
  supportEmail: "support@auctionpro.com",

  seo: {
    title: "AuctionPro - Professional Auction Platform",
    description: "Professional auction platform with transparent bidding",
    keywords: "auction, bidding, professional auction, online auction",
  },
};
```

### Step 2: Edit Backend Config

`backend/config/appConfig.js`:

```javascript
export const appConfig = {
  appName: "AuctionPro",
  databaseName: "AUCTIONPRO_PLATFORM",

  emailConfig: {
    fromName: "AuctionPro Auctions",
    supportEmail: "support@auctionpro.com",
    noReplyEmail: "noreply@auctionpro.com",
  },

  settings: {
    commissionPercentage: 5,
    defaultCurrency: "USD",
    auctionMinDuration: 1,
  },
};
```

### Step 3: Restart Both Servers

```bash
# Stop both servers (Ctrl+C)

# Restart backend
cd backend
npm start

# Restart frontend (in new terminal)
cd frontend
npm run dev
```

### Step 4: Verify Changes

- Open `http://localhost:5173`
- Check the logo shows "AuctionPro"
- Check browser tab title
- Check footer copyright
- Check homepage headings

## Additional Customization Options

### Logo Image (Future Enhancement)

Currently the app name is text-based. To add a logo image:

1. Place logo in `frontend/public/`
2. Update `SideDrawer.jsx` to use `<img>` instead of text
3. Update `appConfig.js` to include `logoPath: "/logo.png"`

### Favicon

Replace `frontend/public/vite.svg` with your own favicon.

### Theme Colors

Colors are defined using Tailwind CSS classes in the components. The primary color `#D6482B` (red-orange) is used throughout. To change:

1. Find all instances of `#D6482B` in the codebase
2. Replace with your brand color
3. Or better: Create CSS variables in `index.css`

### Email Templates

When email functionality is fully configured:

- Update `emailConfig` in backend config
- Email templates will automatically use the configured names

## Testing Branding Changes

After making changes, test these areas:

- [ ] Homepage shows correct name and taglines
- [ ] Navigation header shows correct name
- [ ] Browser tab shows correct title
- [ ] Footer shows correct company name
- [ ] MongoDB creates database with correct name
- [ ] All pages load without errors

## Important Notes

⚠️ **Database Name Change:**
If you change `databaseName` in the backend config, it will create a NEW database. To migrate data:

1. Export from old database
2. Change the config
3. Import to new database

⚠️ **After Changes:**
Always restart BOTH backend and frontend servers to see changes take effect.

✅ **No Code Changes Required:**
You only need to edit the two config files. No need to search through multiple files or components!

---

**This makes it easy for clients to rebrand the application without touching the core code!**
