# Color System Documentation

## Overview

This application uses a centralized color management system with **metallic gradient gold** as the primary brand color. The color scheme is inspired by a luxurious metallic gold gradient that gives the platform a premium, high-end appearance.

## 🎨 The Gradient

```css
background: radial-gradient(
    ellipse farthest-corner at right bottom,
    #fedb37 0%,
    #fdb931 8%,
    #9f7928 30%,
    #8a6e2f 40%,
    transparent 80%
  ), radial-gradient(ellipse farthest-corner at left top, #ffffff 0%, #ffffac 8%, #d1b464
      25%, #5d4a1f 62.5%, #5d4a1f 100%);
```

## Color Palette

### Metallic Gradient Gold Colors

- **#9f7928** (`golden-500`) - Main metallic gold (PRIMARY)
- **#D1B464** (`golden-300`) - Light metallic gold
- **#FDB931** (`golden-200`) - Bright gold highlights
- **#8A6E2F** (`golden-600`) - Dark gold (for hover states)
- **#FEDB37** (`golden-100`) - Very light gold
- **#5d4a1f** (`golden-800`) - Very dark gold

## Quick Start

### 1. Solid Colors (Most Common)

```jsx
// Backgrounds
<button className="bg-golden-500 hover:bg-golden-600">
  Click Me
</button>

// Text
<h1 className="text-golden-500">Premium Title</h1>

// Borders
<div className="border-2 border-golden-500">Content</div>
```

### 2. Gradient Backgrounds

```jsx
<div className="bg-gold-gradient p-8">
  Premium section with metallic gold gradient
</div>
```

### 3. Gradient Text Effect

```jsx
<h1 className="text-gold-gradient text-6xl font-bold">
  Stunning Gradient Text
</h1>
```

### 4. In JavaScript (Charts, etc.)

```javascript
import { PREMIUM_GOLD, COLORS } from "@/lib/colors";

// For solid colors
const chartConfig = {
  borderColor: PREMIUM_GOLD, // #9f7928
  backgroundColor: PREMIUM_GOLD,
};

// For gradient backgrounds
const gradientStyle = {
  background: COLORS.gradient.gold,
};
```

## File Locations

### Configuration Files

- **Tailwind Config**: `frontend/tailwind.config.js`

  - Golden color palette (50-950 shades)
  - `bg-gold-gradient` background image utility

- **App Config**: `frontend/src/config/app.config.js`

  - HSL color values for themes
  - `premiumGold`, `premiumGoldLight`, etc.

- **Color Constants**: `frontend/src/lib/colors.js`

  - JavaScript exports: `PREMIUM_GOLD`, `COLORS`
  - Gradient constant for use in inline styles

- **Custom Utilities**: `frontend/src/index.css`
  - `.bg-gold-gradient` - Full gradient background
  - `.text-gold-gradient` - Gradient text effect

## Available Tailwind Classes

### Background Colors

- `bg-golden-50` through `bg-golden-950`
- `bg-golden-500` (main gold) ⭐
- `bg-golden-600` (dark hover) ⭐
- `bg-gold-gradient` (full gradient) ⭐

### Text Colors

- `text-golden-50` through `text-golden-950`
- `text-golden-500` (main gold) ⭐
- `text-golden-300` (light gold) ⭐
- `text-gold-gradient` (gradient text) ⭐

### Border Colors

- `border-golden-500`, `border-golden-600`, etc.

### Hover States

- `hover:bg-golden-600`
- `hover:text-golden-500`

### Focus States

- `focus:ring-golden-500`

## Best Practices

### ✅ DO

- Use `bg-golden-500` for solid backgrounds
- Use `bg-gold-gradient` for premium sections/heroes
- Use `text-gold-gradient` for important headings
- Import `PREMIUM_GOLD` for JavaScript libraries
- Use hover states: `hover:bg-golden-600`

### ❌ DON'T

- Don't hardcode hex values like `#9f7928`
- Don't use inline styles with colors
- Don't create new color variations
- Don't mix old and new color systems

## Updating Colors

To change the entire color scheme, update these files in order:

1. **Tailwind** (`tailwind.config.js`):

   ```javascript
   golden: {
     500: "#NEW_COLOR",
   }
   ```

2. **Config** (`app.config.js`):

   ```javascript
   premiumGold: "H S% L%",
   ```

3. **Constants** (`lib/colors.js`):

   ```javascript
   main: '#NEW_COLOR',
   ```

4. **Gradient** (if needed, update in all three files above)

## Examples

### Premium Hero Section

```jsx
<section className="bg-gold-gradient p-16">
  <h1 className="text-white text-6xl font-bold">Luxury Auctions</h1>
  <p className="text-white/90">Premium platform</p>
</section>
```

### Call-to-Action Button

```jsx
<button className="bg-golden-500 hover:bg-golden-600 text-white px-8 py-3 rounded-lg transition-colors duration-300">
  Start Bidding
</button>
```

### Gradient Heading

```jsx
<h1 className="text-gold-gradient text-7xl font-extrabold">Be The Winner</h1>
```

## Migration Complete ✓

All colors have been updated to use the metallic gradient gold system:

- ✓ Tailwind golden palette with gradient colors
- ✓ HSL colors in app.config.js
- ✓ Color constants in lib/colors.js
- ✓ Custom gradient utilities in index.css
- ✓ All components using new metallic gold
- ✓ Chart libraries using new colors
- ✓ No old color values remaining
