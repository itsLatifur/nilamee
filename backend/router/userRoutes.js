import express from "express";
import {
  fetchLeaderboard,
  getProfile,
  login,
  logout,
  register,
  switchRole,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getProfile);
router.get("/logout", isAuthenticated, logout);
router.get("/leaderboard", fetchLeaderboard);
router.post("/switch-role", isAuthenticated, switchRole);

export default router;
