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
// Allow GET fallback for SSLCommerz redirect (some gateways use GET)
router.get("/auction/success", auctionPaymentSuccess);

// Dev-only: trigger init as if the auction's highest bidder called it (bypasses auth)
if (process.env.NODE_ENV !== "production") {
  router.post("/auction/test-init/:auctionId", async (req, res, next) => {
    try {
      const { auctionId } = req.params;
      const { Auction } = await import("../auctions/auctions.model.js");
      const { User } = await import("../users/users.model.js");

      const auction = await Auction.findById(auctionId);
      if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });
      if (!auction.highestBidder) return res.status(400).json({ success: false, message: "Auction has no winner" });

      const buyer = await User.findById(auction.highestBidder);
      if (!buyer) return res.status(404).json({ success: false, message: "Buyer user not found" });

      // Mock req.user for controller
      req.user = { _id: buyer._id };

      // Call the real controller
      return initAuctionPayment(req, res, next);
    } catch (err) {
      return next(err);
    }
  });
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
