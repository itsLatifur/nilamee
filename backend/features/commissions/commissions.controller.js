import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { PaymentProof } from "./proof.model.js";
import { User } from "../users/users.model.js";
import { Auction } from "../auctions/auctions.model.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const calculateCommission = async (auctionId) => {
  const auction = await Auction.findById(auctionId);
  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    return next(new ErrorHandler("Invalid Auction Id format.", 400));
  }
  const commissionRate = 0.05;
  const commission = auction.currentBid * commissionRate;
  return commission;
};

export const proofOfCommission = catchAsyncErrors(async (req, res, next) => {
  // Manual commission proof submission is deprecated — the platform collects and processes commission automatically.
  return res.status(410).json({
    success: false,
    message:
      "Manual commission payments/proofs are no longer required. The platform handles commission automatically.",
  });
});
