import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../../shared/middlewares/auth.middleware.js";
import {
  deleteAuctionItem,
  deletePaymentProof,
  fetchAllUsers,
  getAllPaymentProofs,
  getPaymentProofDetail,
  monthlyRevenue,
  updateProofStatus,
  getPendingAuctions,
  getPendingPayments,
  approveAuction,
  rejectAuction,
  holdAuction,
  unholdAuction,
  cancelAuction,
  approvePendingPayment,
  holdPendingPayment,
  unholdPendingPayment,
  addEscrowNote,
  createAdmin,
  getAllUsers,
  banUser,
  suspendUser,
  softDeleteUser,
  restoreUser,
  removeAdmin,
  permanentDeleteUser,
  permanentDeleteAuction,
  permanentDeletePaymentProof,
  getSoftDeletedItems,
  getAllRoles,
  createRole,
  deleteRole,
  updateUserRole,
  getActivityLogs,
  // Backfill endpoint
  runBackfillAddedByName,
} from "./admin.controller.js";

const router = express.Router();

router.delete(
  "/auctionitem/delete/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  deleteAuctionItem,
);

router.get(
  "/paymentproofs/getall",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  getAllPaymentProofs,
);

router.get(
  "/paymentproof/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  getPaymentProofDetail,
);

router.put(
  "/paymentproof/status/update/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  updateProofStatus,
);

router.delete(
  "/paymentproof/delete/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  deletePaymentProof,
);

router.get(
  "/users/getall",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  fetchAllUsers,
);

router.get(
  "/monthlyincome",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  monthlyRevenue,
);

router.get(
  "/auctions/pending",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  getPendingAuctions,
);

// Pending escrow payouts awaiting admin approval
router.get(
  "/payments/pending",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  getPendingPayments,
);

router.post(
  "/payments/approve/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  approvePendingPayment,
);

router.post(
  "/payments/hold/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  holdPendingPayment,
);

router.post(
  "/payments/unhold/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  unholdPendingPayment,
);

router.post(
  "/escrow/note/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  addEscrowNote,
);

router.put(
  "/auction/approve/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  approveAuction,
);

router.put(
  "/auction/reject/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  rejectAuction,
);

router.post(
  "/auction/hold/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  holdAuction,
);

router.post(
  "/auction/unhold/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  unholdAuction,
);

router.post(
  "/auction/cancel/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  cancelAuction,
);

// User Management Routes
router.post(
  "/admin/create",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  createAdmin,
);

router.get(
  "/users",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  getAllUsers,
);

router.put(
  "/user/ban/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  banUser,
);

router.put(
  "/user/suspend/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  suspendUser,
);

router.delete(
  "/user/delete/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  softDeleteUser,
);

router.put(
  "/user/restore/:id",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  restoreUser,
);

router.delete(
  "/admin/remove/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  removeAdmin,
);

// Permanent Delete Routes (Super Admin Only)
router.delete(
  "/permanent/user/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  permanentDeleteUser,
);

router.delete(
  "/permanent/auction/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  permanentDeleteAuction,
);

router.delete(
  "/permanent/paymentproof/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  permanentDeletePaymentProof,
);

// Get soft-deleted items
router.get(
  "/soft-deleted",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  getSoftDeletedItems,
);

// Role Management Routes
router.get(
  "/roles",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  getAllRoles,
);

router.post(
  "/role/create",
  isAuthenticated,
  isAuthorized("Super Admin"),
  createRole,
);

router.delete(
  "/role/delete/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  deleteRole,
);

router.put(
  "/user/role/:userId",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  updateUserRole,
);

// Activity Logs (Super Admin Only)
router.get(
  "/activity-logs",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  getActivityLogs,
);

// One-off admin endpoint to trigger backfill of addedByName
router.post(
  "/backfill/addedByName",
  isAuthenticated,
  isAuthorized("Super Admin", "Admin"),
  runBackfillAddedByName,
);

export default router;
