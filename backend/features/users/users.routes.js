import express from "express";
import {
  fetchLeaderboard,
  getProfile,
  login,
  logout,
  register,
  switchRole,
  updateProfile,
  updatePaymentInfo,
  getPaymentInfo,
  resetPaymentInfo,
} from "./users.controller.js";
import { isAuthenticated } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getProfile);
router.get("/logout", isAuthenticated, logout);
router.get("/leaderboard", fetchLeaderboard);
router.post("/switch-role", isAuthenticated, switchRole);
router.put("/update-profile", isAuthenticated, updateProfile);
router.put("/payment-info", isAuthenticated, updatePaymentInfo);
router.get("/payment-info", isAuthenticated, getPaymentInfo);
router.delete("/payment-info", isAuthenticated, resetPaymentInfo);

export default router;
