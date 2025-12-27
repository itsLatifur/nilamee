import mongoose from "mongoose";
import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { Auction } from "./auctions.model.js";

export const checkAuctionEndTime = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalud ID format.", 400));
  }
  const auction = await Auction.findById(id);
  if (!auction) {
    return next(new ErrorHandler("Auction not found.", 404));
  }
  const now = new Date();
  if (new Date(auction.startTime) > now) {
    return next(new ErrorHandler("Auction has not started yet.", 400));
  }
  if (new Date(auction.endTime) < now) {
    return next(new ErrorHandler("Auction is ended.", 400));
  }
  next();
});
