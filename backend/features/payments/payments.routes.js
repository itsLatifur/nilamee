import express from "express";
import { isAuthenticated } from "../../shared/middlewares/auth.middleware.js";
import {
  initCommissionPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  validatePayment,
} from "./payments.controller.js";

const router = express.Router();

// Initialize commission payment
router.post("/commission/init", isAuthenticated, initCommissionPayment);

// SSLCommerz callbacks
router.post("/commission/success", paymentSuccess);
router.post("/commission/fail", paymentFail);
router.post("/commission/cancel", paymentCancel);
router.post("/commission/ipn", paymentIPN);

// Validate transaction
router.get("/validate/:transactionId", isAuthenticated, validatePayment);

export default router;
