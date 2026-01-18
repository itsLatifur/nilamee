import express from "express";
import {
  getUserProfile,
  getMyProfile,
  getTrustLeaderboard,
  getMyTrustStats,
  getMyReceivables,
  getMyEscrows,
  getMyBuyerEscrows,
  getMyEscrowDetail,
  shipEscrow,
  receiveEscrow,
} from "./profile.controller.js";
import { isAuthenticated } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.get("/user/:userId", isAuthenticated, getUserProfile);
router.get("/me", isAuthenticated, getMyProfile);
router.get("/leaderboard", isAuthenticated, getTrustLeaderboard);
router.get("/my-stats", isAuthenticated, getMyTrustStats);
router.get("/my-receivables", isAuthenticated, getMyReceivables);
router.get("/my-escrows", isAuthenticated, getMyEscrows);
router.get("/my-escrows/buyer", isAuthenticated, getMyBuyerEscrows);
router.get("/escrow/:id", isAuthenticated, getMyEscrowDetail);
router.put("/escrow/ship/:id", isAuthenticated, shipEscrow);
router.put("/escrow/receive/:id", isAuthenticated, receiveEscrow);

export default router;
