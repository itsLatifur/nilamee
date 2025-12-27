# Theme System Documentation

## Overview

The Nilamee Auction Platform uses a centralized theme configuration system that allows you to control all app colors, branding, and themes from a single location. This makes it easy to customize the look and feel of your application and support multiple themes.

## 📁 Configuration Location

**All theme and branding configuration is in:**

```
frontend/src/config/app.config.js
```

**DO NOT configure colors in:**

- ❌ `frontend/src/index.css` (only for structure, not colors)
- ❌ `frontend/tailwind.config.js` (uses CSS variables from app.config.js)
- ❌ `.env` files (only for API keys and environment-specific settings)

## 🎨 Changing App Colors

### Quick Start: Change the Default Theme

Open `frontend/src/config/app.config.js` and modify the `default` theme:

```javascript
export const THEMES = {
  default: {
    name: "Default",
    type: "light",
    colors: {
      // Change these HSL values to customize colors
      primary: "222.2 47.4% 11.2%", // Your brand color
      accent: "210 40% 96.1%", // Hover states, emphasis
      background: "0 0% 100%", // Page background
      // ... more colors
    },
    gradients: {
      background: "linear-gradient(86deg, rgba(246, 244, 240), #f6f4f0)",
    },
  },
};
```

### Color Format: HSL

Colors use the HSL format: `"H S% L%"`

- **H (Hue)**: 0-360 (color wheel position)
  - 0 = Red, 120 = Green, 240 = Blue
- **S (Saturation)**: 0-100% (color intensity)
  - 0% = Gray, 100% = Full color
- **L (Lightness)**: 0-100% (brightness)
  - 0% = Black, 50% = Pure color, 100% = White

**Example:**

```javascript
primary: "220 80% 50%",  // Vibrant blue
accent: "30 100% 60%",   // Bright orange
```

### Available Color Variables

Each theme has these customizable colors:

| Variable            | Usage                        | Example                   |
| ------------------- | ---------------------------- | ------------------------- |
| `background`        | Main page background         | `"0 0% 100%"` (white)     |
| `foreground`        | Main text color              | `"222.2 84% 4.9%"` (dark) |
| `primary`           | Brand color (buttons, links) | `"222.2 47.4% 11.2%"`     |
| `primaryForeground` | Text on primary color        | `"210 40% 98%"`           |
| `secondary`         | Secondary buttons            | `"210 40% 96.1%"`         |
| `accent`            | Hover states, highlights     | `"210 40% 96.1%"`         |
| `muted`             | Disabled states              | `"210 40% 96.1%"`         |
| `card`              | Card backgrounds             | `"0 0% 100%"`             |
| `destructive`       | Error/delete actions         | `"0 84.2% 60.2%"` (red)   |
| `border`            | Border colors                | `"214.3 31.8% 91.4%"`     |
| `input`             | Input field borders          | `"214.3 31.8% 91.4%"`     |
| `ring`              | Focus ring color             | `"222.2 84% 4.9%"`        |
| `chart1-5`          | Dashboard chart colors       | Various                   |

## 🌈 Creating a New Theme

### Step 1: Add Your Theme

Add a new theme object to the `THEMES` constant:

```javascript
export const THEMES = {
  // ... existing themes

  myCustomTheme: {
    name: "My Custom Theme",
    type: "light", // or "dark"
    colors: {
      background: "210 30% 98%",
      foreground: "210 90% 10%",
      primary: "280 80% 50%", // Purple
      primaryForeground: "0 0% 100%",
      accent: "320 70% 60%", // Pink
      accentForeground: "0 0% 100%",
      // ... copy other colors from default theme
    },
    gradients: {
      background: "linear-gradient(86deg, rgba(240, 230, 255), #f0e6ff)",
    },
    borderRadius: "0.5rem",
  },
};
```

### Step 2: Activate Your Theme

Change the `ACTIVE_THEME` constant:

```javascript
export const ACTIVE_THEME = "myCustomTheme";
```

### Step 3: Refresh

Restart your dev server or refresh the browser to see changes.

## 🔄 Dynamic Theme Switching

### Enable Theme Switching in Your App

1. **Import the Theme Switcher component:**

```jsx
import ThemeSwitcher from "@/shared/components/ThemeSwitcher";
```

2. **Add it to your settings/header:**

```jsx
<ThemeSwitcher />
```

3. **Users can now switch themes dynamically!**

### Theme Preview Component

Show all available themes with color previews:

```jsx
import { ThemePreview } from "@/shared/components/ThemeSwitcher";

function SettingsPage() {
  return (
    <div>
      <h1>Choose Your Theme</h1>
      <ThemePreview />
    </div>
  );
}
```

## 🏷️ Changing App Name & Tagline

### Update App Branding

In `frontend/src/config/app.config.js`:

```javascript
export const APP_CONFIG = {
  name: "Your App Name",
  tagline: "Your Awesome Tagline Here",
  description: "A brief description of your app",
  version: "1.0.0",
};
```

### Use in Components

```jsx
import { APP_CONFIG } from "@/config/app.config";

function Header() {
  return (
    <div>
      <h1>{APP_CONFIG.name}</h1>
      <p>{APP_CONFIG.tagline}</p>
    </div>
  );
}
```

## 🎯 Pre-Built Themes

The system comes with 5 pre-built themes:

### 1. Default (Nilamee Brand)

- **Primary:** Deep navy blue
- **Style:** Professional, clean
- **Use for:** Corporate, business

### 2. Dark

- **Primary:** Light colors on dark background
- **Style:** Modern, sleek
- **Use for:** Night mode, developer tools

### 3. Ocean

- **Primary:** Blues and aquas
- **Style:** Fresh, calm
- **Use for:** Marine, travel, health apps

### 4. Sunset

- **Primary:** Orange and purple
- **Style:** Warm, vibrant
- **Use for:** Creative, lifestyle apps

### 5. Forest

- **Primary:** Greens and earth tones
- **Style:** Natural, organic
- **Use for:** Environmental, wellness apps

## 🔧 Advanced Customization

### Customize Border Radius

```javascript
myTheme: {
  // ...
  borderRadius: "1rem",  // More rounded
  // or "0.25rem" for sharper corners
}
```

### Custom Gradients

```javascript
myTheme: {
  // ...
  gradients: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
}
```

### Add Custom Properties

```javascript
myTheme: {
  // ...
  customProperties: {
    headerHeight: "64px",
    sidebarWidth: "280px",
  },
}
```

## 🎨 Color Palette Tools

Need help choosing colors? Use these tools:

1. **HSL Color Picker:** https://hslpicker.com/
2. **Coolors:** https://coolors.co/ (generate palettes)
3. **Adobe Color:** https://color.adobe.com/
4. **HSL Converter:** https://www.w3schools.com/colors/colors_converter.asp

## 💡 Best Practices

### 1. Maintain Color Contrast

- Ensure text is readable on backgrounds
- Use tools like https://webaim.org/resources/contrastchecker/
- Minimum contrast ratio: 4.5:1 for normal text

### 2. Consistent Foreground Colors

- Always pair colors with appropriate foreground colors
- Example: Dark primary → Light primaryForeground

### 3. Test Your Theme

- Check all pages and components
- Test hover states and interactive elements
- Verify charts and graphs are visible

### 4. Keep Chart Colors Distinct

- Use different hues for chart colors
- Avoid similar shades that blend together

### 5. Document Your Changes

- Comment why you chose specific colors
- Note any accessibility considerations

## 🐛 Troubleshooting

### Theme Not Applying

**Problem:** Changed theme but colors aren't updating

**Solutions:**

1. Restart the Vite dev server
2. Clear browser cache (Ctrl+Shift+R)
3. Check browser console for errors
4. Ensure `initializeTheme()` is called in `main.jsx`

### Colors Look Wrong

**Problem:** Colors appear differently than expected

**Solutions:**

1. Verify HSL format: `"H S% L%"` (with spaces)
2. Check if you're using 0-360 for hue, 0-100 for saturation/lightness
3. Use browser DevTools to inspect CSS variables

### Theme Switching Not Working

**Problem:** Theme switcher doesn't change themes

**Solutions:**

1. Check localStorage is enabled in browser
2. Ensure `setActiveTheme()` is being called
3. Verify theme name matches a key in `THEMES` object

## 📊 Example: Creating a Brand Theme

Let's create a custom theme for a brand with:

- Brand color: Purple (#8B5CF6)
- Accent: Pink (#EC4899)
- Background: Light cream

```javascript
brandTheme: {
  name: "Brand Theme",
  type: "light",
  colors: {
    // Backgrounds
    background: "40 30% 98%",           // Light cream
    foreground: "280 70% 15%",          // Dark purple text

    // Brand Colors
    primary: "258 90% 66%",             // Purple #8B5CF6
    primaryForeground: "0 0% 100%",     // White text

    accent: "330 81% 60%",              // Pink #EC4899
    accentForeground: "0 0% 100%",      // White text

    // Supporting Colors
    secondary: "280 30% 95%",           // Light purple
    secondaryForeground: "280 70% 20%", // Dark purple

    muted: "40 20% 92%",
    mutedForeground: "40 10% 45%",

    card: "0 0% 100%",
    cardForeground: "280 70% 15%",

    destructive: "0 84% 60%",
    destructiveForeground: "0 0% 100%",

    border: "280 20% 88%",
    input: "280 20% 88%",
    ring: "258 90% 66%",

    // Chart colors with brand palette
    chart1: "258 90% 66%",  // Purple
    chart2: "330 81% 60%",  // Pink
    chart3: "280 70% 45%",  // Deep purple
    chart4: "340 75% 55%",  // Rose
    chart5: "300 65% 60%",  // Magenta
  },
  gradients: {
    background: "linear-gradient(86deg, rgba(250, 245, 255), #faf5ff)",
  },
  borderRadius: "0.75rem",
},
```

## 🚀 Production Deployment

### Before Deploying

1. ✅ Choose your default theme
2. ✅ Test all pages with your theme
3. ✅ Verify mobile responsiveness
4. ✅ Check accessibility (contrast ratios)
5. ✅ Test theme switching (if enabled)

### Performance

- Themes are applied via CSS variables (instant switching)
- No performance impact on app load
- Theme preference saved in localStorage (persists across sessions)

---

## 📞 Need Help?

If you need to:

- Create a custom color scheme
- Match specific brand colors
- Implement multi-theme support
- Add theme animations

Refer to this documentation or check the component examples in the codebase.

---

**Remember:** All theme changes go in `frontend/src/config/app.config.js` - this is your single source of truth! 🎨
