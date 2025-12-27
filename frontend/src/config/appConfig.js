/**
 * Application Configuration
 *
 * This file contains all the configurable branding and application settings.
 * Change the values here to customize the entire application.
 *
 * For color configuration, see app.config.js and lib/colors.js
 */

// Import centralized colors
import { PREMIUM_GOLD, PREMIUM_GOLD_DARK } from "@/lib/colors";

export const appConfig = {
  // Application Name (used throughout the app)
  appName: "Nilamee",

  // Application Tagline/Slogan
  tagline: "Transparency Leads to Your Victory",

  // Main Heading on Homepage
  mainHeading1: "Transparent Auctions",
  mainHeading2: "Be The Winner",

  // Company/Copyright Information
  companyName: "Nilamee, LLC.",

  // Developer/Designer Credit
  developerName: "LATIFUR",
  developerLink: "https://latifur.dev",

  // Social Media Links
  socialMedia: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },

  // Contact Information
  contactEmail: "info@nilamee.com",
  supportEmail: "support@nilamee.com",

  // Theme Colors (centralized - imported from lib/colors.js)
  colors: {
    primary: PREMIUM_GOLD,
    primaryHover: PREMIUM_GOLD_DARK,
  },

  // SEO Meta Information
  seo: {
    title: "Nilamee",
    description:
      "A transparent auction platform where transparency leads to your victory",
    keywords: "auction, bidding, transparent auction, online auction",
  },
};

export default appConfig;








