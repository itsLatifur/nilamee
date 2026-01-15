/**
 * Backend Application Configuration
 *
 * This file contains configurable application settings for the backend.
 * Change the values here to customize application-wide settings.
 */

export const appConfig = {
  // Application Name
  appName: "Nilamee",

  // Database Name
  databaseName: "NILAMEE_AUCTION_PLATFORM",

  // Email Configuration
  emailConfig: {
    fromName: "Nilamee Auctions",
    supportEmail: "support@nilamee.com",
    noReplyEmail: "noreply@nilamee.com",
  },

  // Application Settings
  settings: {
    commissionPercentage: 7, // Percentage fee charged to auctioneers
    defaultCurrency: "BDT",
    auctionMinDuration: 1, // Minimum auction duration in days
  },
};

export default appConfig;
