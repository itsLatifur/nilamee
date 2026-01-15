import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../../shared/middlewares/auth.middleware.js";
import {
  raiseDispute,
  getAllDisputes,
  getDisputeDetails,
  resolveDispute,
} from "./dispute.controller.js";

const router = express.Router();

// Raise a dispute (buyer only)
router.post("/raise", isAuthenticated, raiseDispute);

// Get all disputes (admin only)
router.get(
  "/all",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getAllDisputes
);

// Get dispute details
router.get("/:id", isAuthenticated, getDisputeDetails);

// Resolve dispute (admin only)
router.put(
  "/resolve/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  resolveDispute
);

export default router;
