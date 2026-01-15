import express from "express";
import {
  submitFeedback,
  getFeedbacksForAuctioneer,
  getMyReceivedFeedbacks,
  getFeedbackByAuction,
} from "./feedback.controller.js";
import { isAuthenticated } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.post("/submit", isAuthenticated, submitFeedback);
router.get("/auctioneer/:userId", isAuthenticated, getFeedbacksForAuctioneer);
router.get("/my-received", isAuthenticated, getMyReceivedFeedbacks);
router.get("/auction/:auctionId", isAuthenticated, getFeedbackByAuction);

export default router;
