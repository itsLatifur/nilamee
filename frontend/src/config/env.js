/**
 * Frontend Environment Configuration
 *
 * This file centralizes access to environment variables.
 * All API calls should use these constants instead of hardcoded URLs.
 */

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// EmailJS Configuration (for contact form)
export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
export const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

// API Endpoints
export const API_ENDPOINTS = {
  // User/Auth endpoints
  USER: {
    REGISTER: `${API_URL}/user/register`,
    LOGIN: `${API_URL}/user/login`,
    LOGOUT: `${API_URL}/user/logout`,
    ME: `${API_URL}/user/me`,
    LEADERBOARD: `${API_URL}/user/leaderboard`,
  },

  // Auction endpoints
  AUCTION: {
    ALL: `${API_URL}/auctionitem/allitems`,
    MY_ITEMS: `${API_URL}/auctionitem/myitems`,
    DETAILS: (id) => `${API_URL}/auctionitem/auction/${id}`,
    CREATE: `${API_URL}/auctionitem/create`,
    REPUBLISH: (id) => `${API_URL}/auctionitem/item/republish/${id}`,
    DELETE: (id) => `${API_URL}/auctionitem/delete/${id}`,
  },

  // Bid endpoints
  BID: {
    PLACE: (id) => `${API_URL}/bid/place/${id}`,
  },

  // Commission endpoints
  COMMISSION: {
    PROOF: `${API_URL}/commission/proof`,
  },

  // Super Admin endpoints
  ADMIN: {
    MONTHLY_REVENUE: `${API_URL}/superadmin/monthlyincome`,
    ALL_USERS: `${API_URL}/superadmin/users/getall`,
    PAYMENT_PROOFS: `${API_URL}/superadmin/paymentproofs/getall`,
    PAYMENT_PROOF_DETAIL: (id) => `${API_URL}/superadmin/paymentproof/${id}`,
    UPDATE_PROOF: (id) =>
      `${API_URL}/superadmin/paymentproof/status/update/${id}`,
    DELETE_PROOF: (id) => `${API_URL}/superadmin/paymentproof/delete/${id}`,
    DELETE_AUCTION: (id) => `${API_URL}/superadmin/auctionitem/delete/${id}`,
  },
};

export default {
  API_BASE_URL,
  API_URL,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  API_ENDPOINTS,
};











