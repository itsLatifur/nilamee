/**
 * Centralized Color Management
 *
 * This file exports color values that can be used throughout the app.
 * All colors are based on metallic gradient gold theme.
 *
 * Import and use these constants instead of hardcoding hex values:
 * import { COLORS } from '@/lib/colors';
 */

// Luxurious Palace Gold & Burgundy Colors (Primary Brand)
export const COLORS = {
  // Main brand colors (luxurious bright gold)
  premiumGold: {
    main: "#D4AF37", // Classic luxury gold - Primary brand color
    light: "#E6BE44", // Warm bright gold - For accents
    bright: "#F4C430", // Bright saffron gold - For highlights
    dark: "#C5A028", // Rich gold - For hover states
    lighter: "#FFD966", // Bright light gold - For backgrounds
    darker: "#B8941F", // Deep gold - For strong emphasis
  },

  // Luxurious burgundy/red colors
  burgundy: {
    main: "#C8102E", // Deep crimson - Primary red
    light: "#A01731", // Rich burgundy
    dark: "#8B1538", // Deep burgundy - For backgrounds
    darker: "#6D1028", // Dark burgundy - For emphasis
    lightest: "#FFC7D1", // Soft pink accent
  },

  // Gradient backgrounds
  gradient: {
    gold: "linear-gradient(135deg, #F4C430 0%, #D4AF37 50%, #C5A028 100%)",
    luxury: "linear-gradient(180deg, #8B1538 0%, #A01731 50%, #C8102E 100%)",
    luxuryBg: "linear-gradient(135deg, #6D1028 0%, #8B1538 50%, #A01731 100%)",
  },

  // Accent colors
  accent: {
    peach: "#DECCBE", // Light peach - Secondary accent
    peachLight: "#fffefd", // Very light peach - Hover backgrounds
  },

  // Neutral colors
  neutral: {
    black: "#111",
    darkGray: "#161613",
    lightGray: "#f6f4f0",
    white: "#fff",
  },
};

// Tailwind class names (for use in className attributes)
export const GOLDEN_CLASSES = {
  bg: {
    main: "bg-golden-500",
    light: "bg-golden-300",
    dark: "bg-golden-600",
    lighter: "bg-golden-300",
    lightest: "bg-golden-100",
  },
  text: {
    main: "text-golden-500",
    light: "text-golden-300",
    dark: "text-golden-600",
    lighter: "text-golden-300",
  },
  border: {
    main: "border-golden-500",
    light: "border-golden-300 dark:border-golden-500",
    dark: "border-golden-600",
  },
  hover: {
    bg: "hover:shadow-xl hover:scale-105",
    text: "hover:text-golden-500",
  },
  focus: {
    ring: "focus:ring-golden-500",
  },
};

// Export individual colors for convenience
export const PREMIUM_GOLD = COLORS.premiumGold.main;
export const PREMIUM_GOLD_LIGHT = COLORS.premiumGold.light;
export const PREMIUM_GOLD_DARK = COLORS.premiumGold.dark;

// Default export for easy importing
export default COLORS;





