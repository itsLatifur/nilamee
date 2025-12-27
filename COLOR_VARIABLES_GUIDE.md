# 🎨 Color Variables System - Quick Guide

## Overview

The color system now uses **reusable variables**. This means you can define a color once and use it in multiple places. When you change the variable, it updates everywhere automatically!

## 📍 Location

All color variables are in:

```
frontend/src/config/app.config.js
```

## 🚀 How It Works

### Before (Hard to Change)

```javascript
// If you wanted navy blue in 5 places, you had to change it 5 times
default: {
  colors: {
    primary: "222.2 47.4% 11.2%",
    accentForeground: "222.2 47.4% 11.2%",
    secondaryForeground: "222.2 47.4% 11.2%",
    // ... repeating the same color value
  }
}
```

### After (Easy to Change)

```javascript
// Define once
const COLORS = {
  navyBlue: "222.2 47.4% 11.2%",
};

// Use everywhere
default: {
  colors: {
    primary: COLORS.navyBlue,
    accentForeground: COLORS.navyBlue,
    secondaryForeground: COLORS.navyBlue,
    // Now changing COLORS.navyBlue updates all 3!
  }
}
```

## 💡 Examples

### Example 1: Change Your Brand Color Everywhere

**Step 1:** Find your brand color in the COLORS object:

```javascript
const COLORS = {
  navyBlue: "222.2 47.4% 11.2%", // Your current brand color
};
```

**Step 2:** Change it once:

```javascript
const COLORS = {
  navyBlue: "280 70% 60%", // Changed to purple
};
```

**Step 3:** It automatically updates in ALL themes using `COLORS.navyBlue`:

- Default theme primary color
- Default theme accent foreground
- Default theme secondary foreground
- Dark theme primary foreground

### Example 2: Create a New Color and Use It

**Step 1:** Add a new color variable:

```javascript
const COLORS = {
  // ... existing colors
  myBrandColor: "180 80% 50%", // New teal color
};
```

**Step 2:** Use it in your theme:

```javascript
default: {
  colors: {
    primary: COLORS.myBrandColor,        // Use for primary
    accent: COLORS.myBrandColor,         // Reuse for accent
    ring: COLORS.myBrandColor,           // Reuse for focus ring
  }
}
```

**Step 3:** Now all three properties share the same color!

### Example 3: Swap Colors Between Properties

Want your accent color to become your primary?

**Before:**

```javascript
const COLORS = {
  navyBlue: "222.2 47.4% 11.2%",
  oceanAccent: "180 80% 45%",
};

default: {
  colors: {
    primary: COLORS.navyBlue,
    accent: COLORS.oceanAccent,
  }
}
```

**After:** Just swap the variables!

```javascript
default: {
  colors: {
    primary: COLORS.oceanAccent,    // Swapped!
    accent: COLORS.navyBlue,        // Swapped!
  }
}
```

### Example 4: Use the Same Color Across Multiple Themes

```javascript
const COLORS = {
  brandPrimary: "280 70% 60%", // Your consistent brand color
};

export const THEMES = {
  default: {
    colors: {
      primary: COLORS.brandPrimary, // Same brand color
    },
  },
  dark: {
    colors: {
      accent: COLORS.brandPrimary, // Same brand color in dark theme
    },
  },
  ocean: {
    colors: {
      ring: COLORS.brandPrimary, // Same brand color in ocean theme
    },
  },
};
```

Now changing `COLORS.brandPrimary` updates it in ALL THREE themes!

## 📋 Available Color Variables

### Common Colors

- `COLORS.white` - Pure white
- `COLORS.black` - Pure black

### Default Theme Colors

- `COLORS.navyBlue` - Brand navy blue
- `COLORS.navyBlueDark` - Dark navy
- `COLORS.lightBlue` - Light blue
- `COLORS.lightGrayBlue` - Gray-blue
- `COLORS.mediumGray` - Medium gray
- `COLORS.lightGrayBorder` - Border gray

### Dark Theme Colors

- `COLORS.darkBg` - Dark background
- `COLORS.darkCard` - Dark card
- `COLORS.darkMuted` - Dark muted text
- `COLORS.darkRing` - Dark focus ring

### Ocean Theme Colors

- `COLORS.oceanBlue` - Ocean primary
- `COLORS.oceanBlueDark` - Dark ocean
- `COLORS.oceanAccent` - Aqua accent
- `COLORS.oceanMuted` - Ocean muted
- `COLORS.oceanBorder` - Ocean borders

### Sunset Theme Colors

- `COLORS.sunsetOrange` - Sunset primary
- `COLORS.sunsetPurple` - Sunset purple
- `COLORS.sunsetAccent` - Pink accent
- `COLORS.sunsetMuted` - Sunset muted

### Forest Theme Colors

- `COLORS.forestGreen` - Forest primary
- `COLORS.forestAccent` - Lime accent
- `COLORS.forestMuted` - Forest muted

### Error Colors

- `COLORS.red` - Standard error red
- `COLORS.redDark` - Dark theme red

### Chart Colors

- `COLORS.chartOrange`, `chartTeal`, `chartDarkBlue`, etc.
- 25+ chart color variables available

## 🎯 Common Use Cases

### Use Case 1: Make All Borders the Same Color

```javascript
const COLORS = {
  universalBorder: "220 20% 85%",  // One border color
};

default: {
  colors: {
    border: COLORS.universalBorder,
    input: COLORS.universalBorder,
    card: COLORS.universalBorder,  // If you want card bg same as border
  }
}
```

### Use Case 2: Create Color Variations

```javascript
const COLORS = {
  // Define a base color and variations
  brandBlue: "220 80% 50%",
  brandBlueDark: "220 80% 40%",
  brandBlueLight: "220 80% 60%",
};

default: {
  colors: {
    primary: COLORS.brandBlue,
    ring: COLORS.brandBlueDark,      // Darker for focus
    accent: COLORS.brandBlueLight,   // Lighter for accent
  }
}
```

### Use Case 3: Consistent Error Colors

```javascript
const COLORS = {
  errorRed: "0 84% 60%",
};

// Use in ALL themes
default: {
  colors: {
    destructive: COLORS.errorRed,
  }
},
dark: {
  colors: {
    destructive: COLORS.errorRed,  // Same red in dark mode
  }
},
```

### Use Case 4: Match Chart Colors to Theme

```javascript
const COLORS = {
  brandPrimary: "280 70% 60%",
  brandAccent: "330 80% 60%",
};

default: {
  colors: {
    primary: COLORS.brandPrimary,
    accent: COLORS.brandAccent,

    // Use same colors in charts!
    chart1: COLORS.brandPrimary,
    chart2: COLORS.brandAccent,
  }
}
```

## ✨ Benefits

### 1. **Change Once, Update Everywhere**

```javascript
// Change this...
const COLORS = {
  brandColor: "280 70% 60%", // Changed from blue to purple
};

// ...and it updates in 10+ places automatically!
```

### 2. **Consistent Colors Across Themes**

```javascript
// Use the same accent color in all themes
const COLORS = {
  globalAccent: "330 80% 60%",
};

// All themes can use COLORS.globalAccent
```

### 3. **Easy Experimentation**

```javascript
// Quickly swap colors to try different looks
primary: COLORS.oceanBlue,    // Try this
primary: COLORS.sunsetOrange, // Or this
primary: COLORS.forestGreen,  // Or this
```

### 4. **No Duplicate Values**

```javascript
// Instead of repeating "222.2 47.4% 11.2%" 5 times,
// use COLORS.navyBlue and change once!
```

## 🔧 Advanced Tips

### Tip 1: Create Custom Color Groups

```javascript
const COLORS = {
  // Brand colors
  brandPrimary: "280 70% 60%",
  brandSecondary: "200 80% 50%",

  // UI colors
  uiBorder: "220 20% 85%",
  uiBackground: "220 20% 98%",

  // Status colors
  statusSuccess: "150 60% 50%",
  statusWarning: "45 90% 55%",
  statusError: "0 84% 60%",
};
```

### Tip 2: Document Your Color Decisions

```javascript
const COLORS = {
  // Primary brand color - used for CTAs and important elements
  brandPrimary: "280 70% 60%",

  // Accent color - used for hover states and highlights
  brandAccent: "330 80% 60%",

  // Muted for disabled states and subtle text
  uiMuted: "220 10% 60%",
};
```

### Tip 3: Quick Color Testing

```javascript
// Comment out to quickly test different colors
const COLORS = {
  testColor: "280 70% 60%",  // Purple - trying this
  // testColor: "150 60% 50%",  // Green - nope
  // testColor: "30 90% 55%",   // Orange - maybe
};

default: {
  colors: {
    primary: COLORS.testColor,
  }
}
```

## 🚀 Quick Start Checklist

- [ ] Open `frontend/src/config/app.config.js`
- [ ] Find the `COLORS` object at the top
- [ ] Change a color variable value
- [ ] All themes using that variable update automatically!
- [ ] Refresh browser to see changes

## 💡 Pro Tip

**Want to find where a color is used?**

Search for the variable name:

```
Search: "COLORS.navyBlue"
```

You'll see all themes/properties using that color!

## 📚 Related Documentation

- [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) - General customization
- [THEME_SYSTEM.md](THEME_SYSTEM.md) - Complete theme system
- [APP_CONFIG_USAGE.md](APP_CONFIG_USAGE.md) - Using config in components

---

**Remember:** Define colors once in `COLORS`, use them everywhere, change once to update all! 🎨
