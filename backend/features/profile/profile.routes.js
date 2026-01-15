import express from "express";
import {
  getUserProfile,
  getMyProfile,
  getTrustLeaderboard,
  getMyTrustStats,
} from "./profile.controller.js";
import { isAuthenticated } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.get("/user/:userId", isAuthenticated, getUserProfile);
router.get("/me", isAuthenticated, getMyProfile);
router.get("/leaderboard", isAuthenticated, getTrustLeaderboard);
router.get("/my-stats", isAuthenticated, getMyTrustStats);

export default router;
