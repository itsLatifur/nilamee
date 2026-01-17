import {
  addNewAuctionItem,
  getAllItems,
  getAuctionDetails,
  getMyWonAuctions,
  getMyWonAuctionsDebug,
  getMyAuctionItems,
  removeFromAuction,
  republishItem,
  markAsShipped,
  confirmDelivery,
} from "./auctions.controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../shared/middlewares/auth.middleware.js";
import express from "express";
import { trackCommissionStatus } from "../commissions/commissions.middleware.js";
import { checkAuctionEndTime } from "./auctions.middleware.js";

const router = express.Router();

router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  trackCommissionStatus,
  addNewAuctionItem
);

router.get("/allitems", getAllItems);

router.get("/auction/:id", isAuthenticated, getAuctionDetails);

router.get(
  "/myitems",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  getMyAuctionItems
);

// Won auctions for buyers
router.get("/my-wins", isAuthenticated, getMyWonAuctions);
// Debug route for development: shows why auctions matched/filtered
router.get("/my-wins/debug", isAuthenticated, getMyWonAuctionsDebug);

router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  removeFromAuction
);

router.put(
  "/item/republish/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  republishItem
);

router.put(
  "/mark-shipped/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  markAsShipped
);

router.put("/confirm-delivery/:id", isAuthenticated, confirmDelivery);

export default router;
