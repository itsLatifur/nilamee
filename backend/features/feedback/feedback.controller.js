import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { Feedback } from "./feedback.model.js";
import { Auction } from "../auctions/auctions.model.js";
import { User } from "../users/users.model.js";

// Submit feedback (buyer action)
export const submitFeedback = catchAsyncErrors(async (req, res, next) => {
  const { auctionId, feedbackText } = req.body;

  // Validate feedback text length
  if (!feedbackText || feedbackText.length < 10) {
    return next(
      new ErrorHandler("Feedback must be at least 10 characters long.", 400)
    );
  }

  if (feedbackText.length > 500) {
    return next(
      new ErrorHandler("Feedback cannot exceed 500 characters.", 400)
    );
  }

  const auction = await Auction.findById(auctionId).populate(
    "createdBy highestBidder"
  );

  if (!auction) {
    return next(new ErrorHandler("Auction not found.", 404));
  }

  // Verify user is the buyer
  if (
    !auction.highestBidder ||
    auction.highestBidder._id.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorHandler("Only the buyer can leave feedback.", 403));
  }

  // Verify auction is completed
  if (auction.overallStatus !== "Completed") {
    return next(
      new ErrorHandler(
        "Feedback can only be submitted after delivery is confirmed.",
        400
      )
    );
  }

  // Check if feedback already exists
  const existingFeedback = await Feedback.findOne({ auctionId: auction._id });

  if (existingFeedback) {
    return next(
      new ErrorHandler("You have already left feedback for this auction.", 400)
    );
  }

  const feedback = await Feedback.create({
    auctionId: auction._id,
    auctioneerUserId: auction.createdBy._id,
    bidderUserId: req.user._id,
    feedbackText,
    auctionTitle: auction.title,
    auctionAmount: auction.currentBid,
  });

  res.status(201).json({
    success: true,
    message: "Feedback submitted successfully!",
    feedback,
  });
});

// Get feedbacks for an auctioneer (Premium users or auctioneer themselves)
export const getFeedbacksForAuctioneer = catchAsyncErrors(
  async (req, res, next) => {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const auctioneer = await User.findById(userId);
    if (!auctioneer) {
      return next(new ErrorHandler("User not found.", 404));
    }

    // Check if viewer has permission
    const isViewingOwnProfile = req.user._id.toString() === userId;
    const isPremiumViewer = req.user.isPremium;

    if (!isViewingOwnProfile && !isPremiumViewer) {
      return next(
        new ErrorHandler(
          "Premium subscription required to view user feedbacks.",
          403
        )
      );
    }

    const feedbacks = await Feedback.find({ auctioneerUserId: userId })
      .populate("bidderUserId", "userName badgeTier starRating isPremium")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const totalFeedbacks = await Feedback.countDocuments({
      auctioneerUserId: userId,
    });

    res.status(200).json({
      success: true,
      feedbacks,
      total: totalFeedbacks,
      hasMore: parseInt(offset) + feedbacks.length < totalFeedbacks,
    });
  }
);

// Get my received feedbacks (auctioneer viewing their own)
export const getMyReceivedFeedbacks = catchAsyncErrors(
  async (req, res, next) => {
    const { limit = 10, offset = 0 } = req.query;

    const feedbacks = await Feedback.find({ auctioneerUserId: req.user._id })
      .populate("bidderUserId", "userName badgeTier starRating isPremium")
      .populate("auctionId", "title")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const totalFeedbacks = await Feedback.countDocuments({
      auctioneerUserId: req.user._id,
    });

    res.status(200).json({
      success: true,
      feedbacks,
      total: totalFeedbacks,
      hasMore: parseInt(offset) + feedbacks.length < totalFeedbacks,
    });
  }
);

// Get feedback for specific auction
export const getFeedbackByAuction = catchAsyncErrors(async (req, res, next) => {
  const { auctionId } = req.params;

  const feedback = await Feedback.findOne({ auctionId })
    .populate("bidderUserId", "userName badgeTier starRating isPremium")
    .populate("auctioneerUserId", "userName");

  if (!feedback) {
    return res.status(200).json({
      success: true,
      feedback: null,
      message: "No feedback submitted yet.",
    });
  }

  res.status(200).json({
    success: true,
    feedback,
  });
});
