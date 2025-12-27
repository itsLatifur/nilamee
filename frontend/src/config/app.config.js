/**
 * Application Configuration
 *
 * This file contains all app-wide settings including:
 * - Branding (name, tagline, logo)
 * - Theme colors
 * - Feature flags
 *
 * IMPORTANT: This is the SINGLE SOURCE OF TRUTH for app configuration.
 * Change colors, branding, and themes here - not in CSS or Tailwind config.
 */

// ============================================================================
// APPLICATION BRANDING
// ============================================================================

export const APP_CONFIG = {
  name: "Nilamee",
  tagline: "Transparency Leads to Your Victories.",
  description: "A transparent and secure auction platform",
  version: "1.0.0",
};

// ============================================================================
// COLOR PALETTE VARIABLES
// ============================================================================

/**
 * Define your color palette here - Change these to update colors across all themes
 * Format: HSL - "H S% L%" (e.g., "222.2 47.4% 11.2%")
 *
 * These variables can be reused across multiple theme properties.
 * When you change a color here, it updates everywhere it's used.
 */

// Common Colors (used across multiple themes)
const COLORS = {
  // Neutral Colors
  white: "0 0% 100%",
  black: "0 0% 0%",

  // Luxurious Palace Gold Colors (Main Brand)
  premiumGold: "43 73% 52%", // #D4AF37 - Classic luxury gold
  premiumGoldLight: "44 73% 58%", // #E6BE44 - Warm bright gold
  premiumGoldBright: "45 88% 57%", // #F4C430 - Bright saffron gold
  premiumGoldDark: "43 72% 46%", // #C5A028 - Rich gold hover
  premiumGoldLighter: "45 100% 70%", // #FFD966 - Bright light gold
  premiumGoldDarker: "42 72% 42%", // #B8941F - Deep gold

  // Luxurious Burgundy/Red Colors
  burgundy: "349 85% 42%", // #C8102E - Deep crimson
  burgundyLight: "349 73% 35%", // #A01731 - Rich burgundy
  burgundyDark: "349 79% 31%", // #8B1538 - Deep burgundy
  burgundyBg: "349 75% 25%", // #6D1028 - Dark burgundy background
  premiumGoldBg: "45 100% 95%", // Light golden background

  // Accent Colors
  accentPeach: "30 85% 90%", // #DECCBE - Light peach
  accentPeachDark: "30 80% 75%", // Darker peach

  // Default Theme Colors
  navyBlue: "222.2 47.4% 11.2%", // Deep navy blue (brand)
  navyBlueDark: "222.2 84% 4.9%", // Very dark navy
  lightBlue: "210 40% 98%", // Very light blue
  lightGrayBlue: "210 40% 96.1%", // Light gray-blue
  mediumGray: "215.4 16.3% 46.9%", // Medium gray
  lightGrayBorder: "214.3 31.8% 91.4%", // Light gray for borders

  // Dark Theme Colors
  darkBg: "222.2 84% 4.9%", // Dark background
  darkCard: "217.2 32.6% 17.5%", // Dark card/secondary
  darkMuted: "215 20.2% 65.1%", // Dark muted text
  darkRing: "212.7 26.8% 83.9%", // Dark focus ring

  // Ocean Theme Colors
  oceanBlue: "200 90% 40%", // Ocean primary blue
  oceanBlueDark: "200 90% 10%", // Dark ocean blue
  oceanBlueLighter: "200 90% 20%", // Lighter dark blue
  oceanBgLight: "200 30% 98%", // Light ocean background
  oceanSecondary: "180 50% 92%", // Ocean secondary
  oceanAccent: "180 80% 45%", // Ocean accent (aqua)
  oceanMuted: "200 30% 90%", // Ocean muted
  oceanMutedText: "200 20% 45%", // Ocean muted text
  oceanBorder: "200 30% 85%", // Ocean borders

  // Sunset Theme Colors
  sunsetOrange: "50 80% 52%", // Sunset primary golden (true golden)
  sunsetOrangeDark: "50 80% 28%", // Dark golden
  sunsetPurple: "280 70% 15%", // Sunset purple text
  sunsetBg: "30 40% 98%", // Light warm background
  sunsetSecondary: "45 100% 95%", // Light yellow secondary
  sunsetAccent: "330 80% 60%", // Pink accent
  sunsetMuted: "30 30% 92%", // Sunset muted
  sunsetMutedText: "30 20% 50%", // Sunset muted text
  sunsetBorder: "30 30% 88%", // Sunset borders

  // Forest Theme Colors
  forestGreen: "150 60% 35%", // Forest primary green
  forestGreenDark: "150 60% 20%", // Dark green
  forestGreenText: "120 80% 10%", // Dark green text
  forestBg: "120 25% 98%", // Light green background
  forestSecondary: "120 35% 92%", // Light green secondary
  forestAccent: "80 60% 45%", // Lime accent
  forestMuted: "120 20% 90%", // Forest muted
  forestMutedText: "120 15% 45%", // Forest muted text
  forestBorder: "120 20% 85%", // Forest borders

  // Error/Destructive Colors
  red: "45 82% 58%", // Premium golden color for accent text and buttons
  redDark: "45 75% 35%", // Dark golden for dark theme

  // Chart Colors
  chartGolden: "48 75% 55%",
  chartTeal: "173 58% 39%",
  chartDarkBlue: "197 37% 24%",
  chartYellow: "43 74% 66%",
  chartCoral: "48 75% 60%",
  chartBlue: "220 70% 50%",
  chartGreen: "160 60% 45%",
  chartGold: "50 78% 58%",
  chartPurple: "280 65% 60%",
  chartPink: "340 75% 55%",
  chartForestGreen: "150 60% 40%",
  chartLimeGreen: "120 50% 45%",
  chartYellowGreen: "80 55% 50%",
  chartGoldenYellow: "50 75% 58%",
  chartGoldenAmber: "48 80% 56%",
  chartOceanBlue: "200 80% 50%",
  chartAqua: "180 70% 45%",
  chartCyan: "160 60% 40%",
  chartLightBlue: "220 75% 55%",
  chartPeriwinkle: "240 70% 60%",
  chartSunsetGolden: "50 78% 54%",
  chartSunsetPink: "330 80% 60%",
  chartSunsetPurple: "280 70% 50%",
  chartSunsetYellow: "45 90% 55%",
  chartSunsetRed: "15 85% 58%",
};

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

/**
 * Theme Definition Structure:
 * Each theme uses color variables from the COLORS palette above.
 * To change a color everywhere, modify the COLORS object.
 * To use a color in multiple places, reference the same variable.
 */

export const THEMES = {
  // Default Light Theme (Nilamee Brand Colors)
  default: {
    name: "Default",
    type: "light",
    colors: {
      // Main background and foreground
      background: COLORS.white,
      foreground: COLORS.navyBlueDark,

      // Primary brand color (main buttons, links, highlights)
      primary: COLORS.navyBlue,
      primaryForeground: COLORS.lightBlue,

      // Secondary color (alternative buttons, accents)
      secondary: COLORS.lightGrayBlue,
      secondaryForeground: COLORS.navyBlue,

      // Accent color (hover states, emphasis)
      accent: COLORS.lightGrayBlue,
      accentForeground: COLORS.navyBlue,

      // Muted colors (disabled states, subtle elements)
      muted: COLORS.lightGrayBlue,
      mutedForeground: COLORS.mediumGray,

      // Card/Panel colors
      card: COLORS.white,
      cardForeground: COLORS.navyBlueDark,

      // Popover/Dropdown colors
      popover: COLORS.white,
      popoverForeground: COLORS.navyBlueDark,

      // Destructive/Error colors
      destructive: COLORS.red,
      destructiveForeground: COLORS.lightBlue,

      // Border and input colors
      border: COLORS.lightGrayBorder,
      input: COLORS.lightGrayBorder,
      ring: COLORS.navyBlueDark,

      // Chart colors (for dashboard graphs)
      chart1: COLORS.chartGolden,
      chart2: COLORS.chartTeal,
      chart3: COLORS.chartDarkBlue,
      chart4: COLORS.chartYellow,
      chart5: COLORS.chartCoral,
    },
    gradients: {
      background: "linear-gradient(86deg, rgba(246, 244, 240), #f6f4f0)",
    },
    borderRadius: "0.5rem",
  },

  // Dark Theme
  dark: {
    name: "Dark",
    type: "dark",
    colors: {
      background: COLORS.darkBg,
      foreground: COLORS.lightBlue,

      primary: COLORS.lightBlue,
      primaryForeground: COLORS.navyBlue,

      secondary: COLORS.darkCard,
      secondaryForeground: COLORS.lightBlue,

      accent: COLORS.darkCard,
      accentForeground: COLORS.lightBlue,

      muted: COLORS.darkCard,
      mutedForeground: COLORS.darkMuted,

      card: COLORS.darkBg,
      cardForeground: COLORS.lightBlue,

      popover: COLORS.darkBg,
      popoverForeground: COLORS.lightBlue,

      destructive: COLORS.redDark,
      destructiveForeground: COLORS.lightBlue,

      border: COLORS.darkCard,
      input: COLORS.darkCard,
      ring: COLORS.darkRing,

      chart1: COLORS.chartBlue,
      chart2: COLORS.chartGreen,
      chart3: COLORS.chartGold,
      chart4: COLORS.chartPurple,
      chart5: COLORS.chartPink,
    },
    gradients: {
      background: "linear-gradient(86deg, rgba(17, 24, 39), #111827)",
    },
    borderRadius: "0.5rem",
  },

  // Ocean Theme (Blue/Aqua)
  ocean: {
    name: "Ocean",
    type: "light",
    colors: {
      background: COLORS.oceanBgLight,
      foreground: COLORS.oceanBlueDark,

      primary: COLORS.oceanBlue,
      primaryForeground: COLORS.white,

      secondary: COLORS.oceanSecondary,
      secondaryForeground: COLORS.oceanBlueLighter,

      accent: COLORS.oceanAccent,
      accentForeground: COLORS.white,

      muted: COLORS.oceanMuted,
      mutedForeground: COLORS.oceanMutedText,

      card: COLORS.white,
      cardForeground: COLORS.oceanBlueDark,

      popover: COLORS.white,
      popoverForeground: COLORS.oceanBlueDark,

      destructive: COLORS.red,
      destructiveForeground: COLORS.white,

      border: COLORS.oceanBorder,
      input: COLORS.oceanBorder,
      ring: COLORS.oceanBlue,

      chart1: COLORS.chartOceanBlue,
      chart2: COLORS.chartAqua,
      chart3: COLORS.chartCyan,
      chart4: COLORS.chartLightBlue,
      chart5: COLORS.chartPeriwinkle,
    },
    gradients: {
      background: "linear-gradient(86deg, rgba(224, 242, 254), #e0f2fe)",
    },
    borderRadius: "0.5rem",
  },

  // Sunset Theme (Warm Orange/Purple)
  sunset: {
    name: "Sunset",
    type: "light",
    colors: {
      background: COLORS.sunsetBg,
      foreground: COLORS.sunsetPurple,

      primary: COLORS.sunsetOrange,
      primaryForeground: COLORS.white,

      secondary: COLORS.sunsetSecondary,
      secondaryForeground: COLORS.sunsetOrangeDark,

      accent: COLORS.sunsetAccent,
      accentForeground: COLORS.white,

      muted: COLORS.sunsetMuted,
      mutedForeground: COLORS.sunsetMutedText,

      card: COLORS.white,
      cardForeground: COLORS.sunsetPurple,

      popover: COLORS.white,
      popoverForeground: COLORS.sunsetPurple,

      destructive: COLORS.red,
      destructiveForeground: COLORS.white,

      border: COLORS.sunsetBorder,
      input: COLORS.sunsetBorder,
      ring: COLORS.sunsetOrange,

      chart1: COLORS.chartSunsetGolden,
      chart2: COLORS.chartSunsetPink,
      chart3: COLORS.chartSunsetPurple,
      chart4: COLORS.chartSunsetYellow,
      chart5: COLORS.chartSunsetRed,
    },
    gradients: {
      background: "linear-gradient(86deg, rgba(254, 243, 199), #fef3c7)",
    },
    borderRadius: "0.5rem",
  },

  // Forest Theme (Green/Earth tones)
  forest: {
    name: "Forest",
    type: "light",
    colors: {
      background: COLORS.forestBg,
      foreground: COLORS.forestGreenText,

      primary: COLORS.forestGreen,
      primaryForeground: COLORS.white,

      secondary: COLORS.forestSecondary,
      secondaryForeground: COLORS.forestGreenDark,

      accent: COLORS.forestAccent,
      accentForeground: COLORS.white,

      muted: COLORS.forestMuted,
      mutedForeground: COLORS.forestMutedText,

      card: COLORS.white,
      cardForeground: COLORS.forestGreenText,

      popover: COLORS.white,
      popoverForeground: COLORS.forestGreenText,

      destructive: COLORS.red,
      destructiveForeground: COLORS.white,

      border: COLORS.forestBorder,
      input: COLORS.forestBorder,
      ring: COLORS.forestGreen,

      chart1: COLORS.chartForestGreen,
      chart2: COLORS.chartLimeGreen,
      chart3: COLORS.chartYellowGreen,
      chart4: COLORS.chartGoldenYellow,
      chart5: COLORS.chartOrangeRed,
    },
    gradients: {
      background: "linear-gradient(86deg, rgba(236, 253, 245), #ecfdf5)",
    },
    borderRadius: "0.5rem",
  },
};

// ============================================================================
// ACTIVE THEME SELECTION
// ============================================================================

/**
 * Change this to switch themes across the entire application
 * Options: 'default', 'dark', 'ocean', 'sunset', 'forest'
 *
 * For dynamic theme switching, you can:
 * 1. Store theme preference in localStorage
 * 2. Create a theme context/provider
 * 3. Allow users to select themes from settings
 */
export const ACTIVE_THEME = "default";

/**
 * Get the currently active theme configuration
 */
export const getActiveTheme = () => {
  // You can enhance this to read from localStorage or user preferences
  const savedTheme = localStorage.getItem("app-theme");
  return THEMES[savedTheme] || THEMES[ACTIVE_THEME];
};

/**
 * Set a new active theme
 */
export const setActiveTheme = (themeName) => {
  if (THEMES[themeName]) {
    localStorage.setItem("app-theme", themeName);
    applyTheme(THEMES[themeName]);
    return true;
  }
  return false;
};

/**
 * Apply theme colors to CSS variables
 */
export const applyTheme = (theme) => {
  const root = document.documentElement;

  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case (primaryForeground -> primary-foreground)
    const cssVar = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    root.style.setProperty(`--${cssVar}`, value);
  });

  // Apply border radius
  root.style.setProperty("--radius", theme.borderRadius);

  // Apply background gradient if exists
  if (theme.gradients?.background) {
    document.body.style.background = theme.gradients.background;
  }

  // Add dark class if needed
  if (theme.type === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

/**
 * Initialize theme on app load
 */
export const initializeTheme = () => {
  const theme = getActiveTheme();
  applyTheme(theme);
};

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  enableDarkMode: true,
  enableThemeSwitcher: true,
  enableUserProfiles: true,
  enableNotifications: true,
  enableAnalytics: false,
};

// ============================================================================
// EXPORTS
// ============================================================================

export { COLORS }; // Export color variables for advanced customization

export default {
  APP_CONFIG,
  COLORS,
  THEMES,
  ACTIVE_THEME,
  getActiveTheme,
  setActiveTheme,
  applyTheme,
  initializeTheme,
  FEATURES,
};





