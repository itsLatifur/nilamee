// Legacy bid route commented out to prevent duplicate handler issues
// import express from "express";
// import { placeBid } from "../features/bids/bids.controller.js";
// import { isAuthenticated, isAuthorized } from "../shared/middlewares/auth.middleware.js";
// import { checkAuctionEndTime } from "../features/auctions/auctions.middleware.js";

// const router = express.Router();

// router.post(
//   "/place/:id",
//   isAuthenticated,
//   isAuthorized("Bidder"),
//   checkAuctionEndTime,
//   placeBid
// );

// export default router;
