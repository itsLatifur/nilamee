import express from "express";
import { placeBid } from "./bids.controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../shared/middlewares/auth.middleware.js";
import { checkAuctionEndTime } from "../auctions/auctions.middleware.js";

const router = express.Router();

router.post(
  "/place/:id",
  isAuthenticated,
  isAuthorized("Bidder"),
  checkAuctionEndTime,
  placeBid
);

export default router;
