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
    BASE: `${API_URL}/superadmin`,
    MONTHLY_REVENUE: `${API_URL}/superadmin/monthlyincome`,
    ALL_USERS: `${API_URL}/superadmin/users/getall`,
    PAYMENT_PROOFS: `${API_URL}/superadmin/paymentproofs/getall`,
    PAYMENT_PROOF_DETAIL: (id) => `${API_URL}/superadmin/paymentproof/${id}`,
    UPDATE_PROOF: (id) =>
      `${API_URL}/superadmin/paymentproof/status/update/${id}`,
    DELETE_PROOF: (id) => `${API_URL}/superadmin/paymentproof/delete/${id}`,
    DELETE_AUCTION: (id) => `${API_URL}/superadmin/auctionitem/delete/${id}`,
    // User management
    USERS: `${API_URL}/superadmin/users`,
    CREATE_ADMIN: `${API_URL}/superadmin/admin/create`,
    BAN_USER: (id) => `${API_URL}/superadmin/user/ban/${id}`,
    SUSPEND_USER: (id) => `${API_URL}/superadmin/user/suspend/${id}`,
    DELETE_USER: (id) => `${API_URL}/superadmin/user/delete/${id}`,
    RESTORE_USER: (id) => `${API_URL}/superadmin/user/restore/${id}`,
    REMOVE_ADMIN: (id) => `${API_URL}/superadmin/admin/remove/${id}`,
    // Permanent delete (Super Admin only)
    PERMANENT_DELETE_USER: (id) => `${API_URL}/superadmin/permanent/user/${id}`,
    PERMANENT_DELETE_AUCTION: (id) =>
      `${API_URL}/superadmin/permanent/auction/${id}`,
    PERMANENT_DELETE_PROOF: (id) =>
      `${API_URL}/superadmin/permanent/paymentproof/${id}`,
    SOFT_DELETED: `${API_URL}/superadmin/soft-deleted`,
  },

  // Notification endpoints
  NOTIFICATION: {
    ALL: `${API_URL}/notification/getall`,
    READ: (id) => `${API_URL}/notification/read/${id}`,
    READ_ALL: `${API_URL}/notification/readall`,
    DELETE: (id) => `${API_URL}/notification/delete/${id}`,
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
