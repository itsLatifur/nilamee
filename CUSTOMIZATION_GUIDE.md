# 🎨 Quick Start: Customizing Your App

This guide shows you how to customize the Nilamee Auction Platform's branding and colors.

## ⚡ TL;DR - Change Everything From One File

**Open this file to customize your app:**

```
frontend/src/config/app.config.js
```

That's it! All branding, colors, and themes are controlled from this single file.

## 🏷️ Change App Name & Tagline

```javascript
// In: frontend/src/config/app.config.js

export const APP_CONFIG = {
  name: "Your App Name", // Change this
  tagline: "Your Awesome Tagline", // Change this
  description: "App description",
  version: "1.0.0",
};
```

✅ **Done!** The new name and tagline will appear everywhere in your app.

## 🎨 Change All Colors

### Method 1: Using Color Variables (Recommended ⭐)

The app now uses **reusable color variables**. Change a color once, and it updates everywhere!

```javascript
// In: frontend/src/config/app.config.js

// Define colors once
const COLORS = {
  brandPrimary: "280 70% 60%", // Your brand color
  brandAccent: "330 80% 60%", // Your accent color
  // ... more colors
};

// Use in themes - they'll auto-update when COLORS change!
export const THEMES = {
  default: {
    colors: {
      primary: COLORS.brandPrimary, // Uses your brand color
      accent: COLORS.brandAccent, // Uses your accent color
      ring: COLORS.brandPrimary, // Reuses brand color
    },
  },
};
```

**Want to learn more?** See [COLOR_VARIABLES_GUIDE.md](COLOR_VARIABLES_GUIDE.md)

### Method 2: Direct Color Values

You can also directly change colors in the THEMES object:

```javascript
export const THEMES = {
  default: {
    colors: {
      primary: "220 80% 50%", // Your main brand color (buttons, links)
      accent: "30 100% 60%", // Accent color (highlights, hover)
      background: "0 0% 100%", // Page background
      // ... more colors below
    },
  },
};
```

### 🌈 Quick Color Examples

Want to use specific brand colors? Here are common examples:

```javascript
// Blue Brand
const COLORS = { brandColor: "220 80% 50%" }; // Blue

// Purple Brand
const COLORS = { brandColor: "280 70% 60%" }; // Purple

// Green Brand
const COLORS = { brandColor: "150 60% 45%" }; // Green

// Orange Brand
const COLORS = { brandColor: "30 90% 55%" }; // Orange

// Red Brand
const COLORS = { brandColor: "0 80% 55%" }; // Red
```

**💡 Pro Tip:** Using `COLORS` variables means you can change one value and it updates everywhere that color is used! Learn more in [COLOR_VARIABLES_GUIDE.md](COLOR_VARIABLES_GUIDE.md)

## 🚀 Switch to Pre-Built Theme

Want to use a different look instantly? Change one line:

```javascript
// In: frontend/src/config/app.config.js

export const ACTIVE_THEME = "dark"; // Options: default, dark, ocean, sunset, forest
```

## 🔧 Available Pre-Built Themes

1. **default** - Professional navy blue (Nilamee brand)
2. **dark** - Modern dark mode
3. **ocean** - Blue and aqua tones
4. **sunset** - Warm orange and purple
5. **forest** - Natural green and earth tones

## 📋 Complete Customization Checklist

### Step 1: Change Branding

- [ ] Open `frontend/src/config/app.config.js`
- [ ] Update `APP_CONFIG.name` with your app name
- [ ] Update `APP_CONFIG.tagline` with your tagline

### Step 2: Change Colors

- [ ] Choose a theme or customize `THEMES.default.colors`
- [ ] Set `primary` color to your brand color
- [ ] Optionally customize other colors (accent, background, etc.)

### Step 3: Test

- [ ] Run `npm run dev` in frontend folder
- [ ] Check that colors look good everywhere
- [ ] Test buttons, cards, and hover states

### Step 4: Done! 🎉

- [ ] Your app is now fully customized

## 🎯 What Colors to Change?

### Essential Colors (Start Here)

```javascript
primary: "220 80% 50%",              // Main brand color - buttons, links
accent: "30 100% 60%",               // Highlights, hover effects
background: "0 0% 100%",             // Page background
```

### Supporting Colors (Optional)

```javascript
secondary: "210 40% 96%",            // Secondary buttons
destructive: "0 84% 60%",            // Error messages, delete buttons
border: "214 31% 91%",               // Borders around cards/inputs
card: "0 0% 100%",                   // Card backgrounds
```

### Chart Colors (For Dashboard)

```javascript
chart1: "12 76% 61%",                // Dashboard graph color 1
chart2: "173 58% 39%",               // Dashboard graph color 2
chart3: "197 37% 24%",               // Dashboard graph color 3
chart4: "43 74% 66%",                // Dashboard graph color 4
chart5: "27 87% 67%",                // Dashboard graph color 5
```

## 🎨 Understanding HSL Colors

HSL format: `"Hue Saturation% Lightness%"`

- **Hue (0-360)**: The color itself

  - 0 = Red
  - 120 = Green
  - 240 = Blue
  - 280 = Purple
  - 30 = Orange

- **Saturation (0-100%)**: Color intensity

  - 0% = Gray (no color)
  - 100% = Vivid color

- **Lightness (0-100%)**: Brightness
  - 0% = Black
  - 50% = True color
  - 100% = White

### Example: Creating Brand Colors

**Your brand color is #3B82F6 (blue)?**
Convert to HSL: `"217 91% 60%"`

**Use these tools:**

- https://hslpicker.com/
- https://www.w3schools.com/colors/colors_converter.asp

## 🔄 Enable Theme Switching for Users

Want users to choose their own theme?

### Add Theme Switcher to Your App

```jsx
// In any component (e.g., Settings page, Header)
import ThemeSwitcher from "@/shared/components/ThemeSwitcher";

function Settings() {
  return (
    <div>
      <h2>Choose Your Theme</h2>
      <ThemeSwitcher />
    </div>
  );
}
```

Users can now switch between all available themes!

## 📚 Need More Details?

**Complete Guides:**

- [THEME_SYSTEM.md](THEME_SYSTEM.md) - Full theme documentation
- [APP_CONFIG_USAGE.md](APP_CONFIG_USAGE.md) - Using config in components
- [ENV_SETUP.md](ENV_SETUP.md) - Environment setup

## ⚠️ Important Notes

### ✅ DO

- Customize colors in `frontend/src/config/app.config.js`
- Test your theme on all pages
- Check color contrast for accessibility

### ❌ DON'T

- Don't put branding in `.env` files
- Don't edit `index.css` for color changes
- Don't hardcode colors in components
- Don't modify `tailwind.config.js` colors

## 🎯 Common Use Cases

### Use Case 1: Match My Brand Colors

1. Get your brand's primary color in HSL
2. Open `app.config.js`
3. Change `primary` color in `THEMES.default.colors`
4. Refresh and see changes instantly

### Use Case 2: Create Custom Theme

1. Copy the `default` theme in `app.config.js`
2. Rename it (e.g., `myBrand`)
3. Change all colors to match your brand
4. Set `ACTIVE_THEME = "myBrand"`

### Use Case 3: Dark Mode

1. Set `ACTIVE_THEME = "dark"` in `app.config.js`
2. Or add `<ThemeSwitcher />` for user choice

## 🚀 Pro Tips

1. **Keep it Simple**: Start by just changing `primary` and `accent` colors
2. **Use Color Tools**: Let online tools convert your brand colors to HSL
3. **Test Everywhere**: Check how colors look on buttons, cards, charts
4. **Maintain Contrast**: Dark text on dark backgrounds = bad UX
5. **Save Often**: Make small changes and test frequently

## 💡 Examples in Action

### Example 1: E-commerce Store (Purple Brand)

```javascript
colors: {
  primary: "280 70% 60%",      // Purple
  accent: "330 75% 65%",       // Pink accent
  background: "280 20% 98%",   // Light purple tint
}
```

### Example 2: Environmental App (Green)

```javascript
colors: {
  primary: "150 60% 40%",      // Forest green
  accent: "80 55% 50%",        // Lime accent
  background: "120 25% 98%",   // Subtle green background
}
```

### Example 3: Finance App (Professional Blue)

```javascript
colors: {
  primary: "220 80% 45%",      // Deep blue
  accent: "210 70% 55%",       // Lighter blue
  background: "0 0% 98%",      // Clean white/gray
}
```

## 🎉 You're Ready!

That's all you need to know. Now go customize your app!

**Remember:** Everything is in `frontend/src/config/app.config.js`

Happy customizing! 🚀

---

**Quick Links:**

- [Color Variables Guide](COLOR_VARIABLES_GUIDE.md) ⭐ NEW!
- [Theme System Documentation](THEME_SYSTEM.md)
- [App Config Usage Examples](APP_CONFIG_USAGE.md)
- [Environment Setup Guide](ENV_SETUP.md)
