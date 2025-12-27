# Nilamee Auction Platform - Frontend

A modern, themeable React application built with Vite, Redux Toolkit, and Tailwind CSS.

## 🎨 Theme & Configuration System

This application features a comprehensive theme system that allows you to customize all colors, branding, and appearance from a single location.

### Quick Links

- **[Theme System Documentation](../THEME_SYSTEM.md)** - Complete guide to customizing colors and themes
- **[App Config Usage Guide](../APP_CONFIG_USAGE.md)** - How to use app configuration in components
- **[Environment Setup](../ENV_SETUP.md)** - Environment variables and API configuration

### Change App Colors & Branding

**All customization is in:** `src/config/app.config.js`

```javascript
// Change app name and tagline
export const APP_CONFIG = {
  name: "Your App Name",
  tagline: "Your Tagline Here",
};

// Change colors (HSL format)
export const THEMES = {
  default: {
    colors: {
      primary: "220 80% 50%", // Your brand color
      accent: "30 100% 60%", // Accent color
      // ... more colors
    },
  },
};
```

**5 Pre-built Themes Available:**

- Default (Nilamee Brand)
- Dark Mode
- Ocean (Blue/Aqua)
- Sunset (Orange/Purple)
- Forest (Green/Earth tones)

See [THEME_SYSTEM.md](../THEME_SYSTEM.md) for complete documentation.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend server running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
copy .env.example .env    # Windows
# or
cp .env.example .env      # Linux/Mac

# Configure .env file (see ENV_SETUP.md)

# Start development server
npm run dev
```

Frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── config/
│   │   ├── app.config.js      # 🎨 THEME & BRANDING CONFIG (customize here!)
│   │   └── env.js             # API endpoints
│   ├── features/              # Feature-based architecture
│   │   ├── auth/             # Authentication
│   │   ├── auctions/         # Auction management
│   │   ├── bids/             # Bidding system
│   │   ├── commissions/      # Commission proofs
│   │   └── admin/            # Admin dashboard
│   ├── shared/               # Shared components
│   │   └── components/
│   │       └── ThemeSwitcher.jsx  # Theme switching component
│   ├── pages/                # Page components
│   ├── layout/               # Layout components
│   └── store/                # Redux store
├── public/                   # Static assets
└── .env                      # Environment variables (not in git)
```

## 🎨 Using Theme Colors

All theme colors are available as Tailwind classes:

```jsx
// Text colors
<p className="text-primary">Primary text</p>
<p className="text-muted-foreground">Muted text</p>

// Backgrounds
<div className="bg-primary text-primary-foreground">Primary button</div>
<div className="bg-card border border-border">Card</div>

// Import app config
import { APP_CONFIG } from "@/config/app.config";
<h1>{APP_CONFIG.name}</h1>
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔧 Configuration Files

- `src/config/app.config.js` - **App branding and theme colors**
- `src/config/env.js` - API endpoints and EmailJS config
- `.env` - Environment variables (API URLs, credentials)
- `tailwind.config.js` - Tailwind configuration (uses theme system)
- `vite.config.js` - Vite build configuration

## 📚 Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **UI Components:** Shadcn/ui
- **Forms:** EmailJS (contact form)
- **Charts:** Chart.js (dashboard)

## 🌈 Theme Features

- ✅ 5 pre-built themes (Default, Dark, Ocean, Sunset, Forest)
- ✅ Custom theme creation support
- ✅ HSL color format for easy customization
- ✅ Dynamic theme switching with localStorage
- ✅ Theme switcher component included
- ✅ Responsive design with all themes
- ✅ Chart colors integrated with themes

## 📖 Documentation

- **[THEME_SYSTEM.md](../THEME_SYSTEM.md)** - Complete theme customization guide
- **[APP_CONFIG_USAGE.md](../APP_CONFIG_USAGE.md)** - Using app config in components
- **[ENV_SETUP.md](../ENV_SETUP.md)** - Environment setup guide

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api/v1
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_PUBLIC_KEY=your-public-key
```

**Note:** App name, tagline, and colors are NOT in .env - they're in `src/config/app.config.js`

## 🚀 Deployment

### Build

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Deploy

Deploy the `dist/` folder to your hosting service:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting

### Production Environment

Update `.env` for production:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_API_URL=https://your-api-domain.com/api/v1
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Customize theme in `src/config/app.config.js` if needed
4. Commit your changes
5. Push to your branch
6. Open a Pull Request

## 📝 License

This project is part of the Nilamee Auction Platform.

---

**Need Help?**

- Theme customization: See [THEME_SYSTEM.md](../THEME_SYSTEM.md)
- Environment setup: See [ENV_SETUP.md](../ENV_SETUP.md)
- Component usage: See [APP_CONFIG_USAGE.md](../APP_CONFIG_USAGE.md)

---

Built with ❤️ using React + Vite
