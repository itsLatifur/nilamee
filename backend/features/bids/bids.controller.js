import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { Auction } from "../auctions/auctions.model.js";
import { Bid } from "./bids.model.js";
import { User } from "../users/users.model.js";

export const placeBid = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction Item not found.", 404));
  }
  const { amount } = req.body;
  if (!amount) {
    return next(new ErrorHandler("Please place your bid.", 400));
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return next(new ErrorHandler("Please enter a valid bid amount.", 400));
  }

  // Get highest bid from all bids
  const highestBid =
    auctionItem.bids.length > 0
      ? Math.max(...auctionItem.bids.map((b) => b.amount))
      : auctionItem.currentBid || 0;

  const minimumBid = Math.max(highestBid, auctionItem.startingBid);

  if (numericAmount <= minimumBid) {
    return next(
      new ErrorHandler(
        `Bid must be greater than current highest bid of ${minimumBid} BDT.`,
        400
      )
    );
  }

  try {
    const existingBid = await Bid.findOne({
      "bidder.id": req.user._id,
      auctionItem: auctionItem._id,
    });
    const existingBidInAuction = auctionItem.bids.find(
      (bid) => bid.userId.toString() == req.user._id.toString()
    );
    if (existingBid && existingBidInAuction) {
      existingBidInAuction.amount = numericAmount;
      existingBid.amount = numericAmount;
      await existingBid.save();
    } else {
      const bidderDetail = await User.findById(req.user._id);
      const bid = await Bid.create({
        amount: numericAmount,
        bidder: {
          id: bidderDetail._id,
          userName: bidderDetail.userName,
          profileImage: bidderDetail.profileImage?.url,
        },
        auctionItem: auctionItem._id,
      });
      auctionItem.bids.push({
        userId: req.user._id,
        userName: bidderDetail.userName,
        profileImage: bidderDetail.profileImage?.url,
        amount: numericAmount,
      });
    }

    // Sort bids by amount (highest first)
    auctionItem.bids.sort((a, b) => b.amount - a.amount);

    // Update current bid to highest
    auctionItem.currentBid = Math.max(...auctionItem.bids.map((b) => b.amount));

    await auctionItem.save();

    res.status(201).json({
      success: true,
      message: "Bid placed successfully!",
      currentBid: auctionItem.currentBid,
      highestBidder: auctionItem.bids[0].userName,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Failed to place bid.", 500));
  }
});
