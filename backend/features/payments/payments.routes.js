import express from "express";
import { isAuthenticated } from "../../shared/middlewares/auth.middleware.js";
import {
  initCommissionPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  validatePayment,
  initAuctionPayment,
  auctionPaymentSuccess,
  auctionPaymentFail,
  auctionPaymentCancel,
  auctionPaymentIPN,
  initPremiumPayment,
  handlePremiumSuccess,
  verifyPremiumPayment,
  premiumPaymentIPN,
  cancelPremiumSubscription,
} from "./payments.controller.js";

const router = express.Router();

// Commission payment routes
router.post("/commission/init", isAuthenticated, initCommissionPayment);
router.post("/commission/success", paymentSuccess);
router.post("/commission/fail", paymentFail);
router.post("/commission/cancel", paymentCancel);
router.post("/commission/ipn", paymentIPN);

// Auction payment routes (winner pays for won auction)
router.post("/auction/init/:auctionId", isAuthenticated, initAuctionPayment);
router.post("/auction/success", auctionPaymentSuccess);
router.post("/auction/fail", auctionPaymentFail);
router.post("/auction/cancel", auctionPaymentCancel);
router.post("/auction/ipn", auctionPaymentIPN);
// Dev/demo only: simulate auction payment without SSLCommerz
if (process.env.NODE_ENV !== "production") {
  router.post(
    "/auction/demo-pay/:auctionId",
    isAuthenticated,
    async (req, res, next) => {
      // Lazy import controller to avoid circular issues
      const { demoAuctionPay } = await import("./payments.controller.js");
      return demoAuctionPay(req, res, next);
    },
  );
}

// Validate transaction
router.get("/validate/:transactionId", isAuthenticated, validatePayment);

// Premium subscription routes
router.post("/premium/init", isAuthenticated, initPremiumPayment);
router.post("/premium/success", handlePremiumSuccess); // SSLCommerz POST callback
router.get("/premium/success", handlePremiumSuccess); // Fallback GET route
router.get("/premium/verify", verifyPremiumPayment);
router.post("/premium/ipn", premiumPaymentIPN);
router.delete("/premium/cancel", isAuthenticated, cancelPremiumSubscription);

export default router;
