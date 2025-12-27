import express from "express";
import { proofOfCommission } from "./commissions.controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/proof",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  proofOfCommission
);

export default router;
