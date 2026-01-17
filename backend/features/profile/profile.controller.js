import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { User } from "../users/users.model.js";
import { TransactionHistory } from "../transactions/transactionHistory.model.js";
import { Escrow } from "../escrow/escrow.model.js";
import { Feedback } from "../feedback/feedback.model.js";

// Get user profile (basic or premium view based on viewer's subscription)
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select(
    "-password -paymentMethods -unpaidCommission -deletedAt -deletionReason -bannedReason -suspendedReason"
  );

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  if (user.status !== "active") {
    return next(new ErrorHandler("This user profile is not available.", 403));
  }

  const isPremiumViewer = req.user.isPremium;
  const isViewingOwnProfile = req.user._id.toString() === userId;

  // BASIC VIEW (Free users)
  const basicProfile = {
    _id: user._id,
    userName: user.userName,
    badgeTier: user.badgeTier,
    starRating: user.starRating,
    isVerifiedSeller: user.isVerifiedSeller,
    isVerifiedBuyer: user.isVerifiedBuyer,
    isPremium: user.isPremium,
    role: user.role,
  };

  // PREMIUM VIEW (Premium users or own profile)
  if (isPremiumViewer || isViewingOwnProfile) {
    const recentTransactions = await TransactionHistory.find({ userId })
      .sort({ completedAt: -1 })
      .limit(10)
      .select("auctionTitle amount role outcome completedAt trustPointsEarned");

    const recentFeedbacks = await Feedback.find({
      auctioneerUserId: userId,
    })
      .populate("bidderUserId", "userName badgeTier starRating")
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      viewType: "premium",
      profile: {
        ...basicProfile,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        trustScore: user.trustScore,
        totalTransactionVolume: user.totalTransactionVolume,
        completedAuctionsCount: user.completedAuctionsCount,
        firstSuccessfulAuctionDate: user.firstSuccessfulAuctionDate,
        stats: user.stats,
        createdAt: user.createdAt,
        recentTransactions,
        recentFeedbacks,
      },
    });
  }

  // Return basic view for non-premium users
  res.status(200).json({
    success: true,
    viewType: "basic",
    profile: basicProfile,
    message:
      "Upgrade to Premium to view full profile details, transaction history, and feedbacks.",
  });
});

// Get my own full profile
export const getMyProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");

  const recentTransactions = await TransactionHistory.find({
    userId: req.user._id,
  })
    .sort({ completedAt: -1 })
    .limit(10);

  const receivedFeedbacks = await Feedback.find({
    auctioneerUserId: req.user._id,
  })
    .populate("bidderUserId", "userName badgeTier starRating")
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    profile: {
      ...user.toObject(),
      recentTransactions,
      receivedFeedbacks,
    },
  });
});

// Get trust leaderboard
export const getTrustLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const { role, limit = 100 } = req.query;

  const query = { status: "active" };
  if (role && ["Auctioneer", "Bidder"].includes(role)) {
    query.role = role;
  }

  const topUsers = await User.find(query)
    .select(
      "userName badgeTier starRating trustScore totalTransactionVolume completedAuctionsCount isPremium isVerifiedSeller isVerifiedBuyer"
    )
    .sort({ trustScore: -1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    leaderboard: topUsers,
    total: topUsers.length,
  });
});

// Get my trust stats breakdown
export const getMyTrustStats = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const transactionHistory = await TransactionHistory.find({
    userId: req.user._id,
  }).sort({ completedAt: -1 });

  const totalPointsEarned = transactionHistory.reduce(
    (sum, t) => sum + (t.trustPointsEarned || 0),
    0
  );

  const feedbackCount = await Feedback.countDocuments({
    auctioneerUserId: req.user._id,
  });

  res.status(200).json({
    success: true,
    stats: {
      currentTrustScore: user.trustScore,
      badgeTier: user.badgeTier,
      starRating: user.starRating,
      totalTransactionVolume: user.totalTransactionVolume,
      completedAuctionsCount: user.completedAuctionsCount,
      totalPointsEarned,
      feedbacksReceived: feedbackCount,
      isVerifiedSeller: user.isVerifiedSeller,
      isVerifiedBuyer: user.isVerifiedBuyer,
      stats: user.stats,
      transactionHistory: transactionHistory.slice(0, 20), // Last 20
    },
  });
});

// Get receivable amount from escrows for current user (seller)
export const getMyReceivables = catchAsyncErrors(async (req, res, next) => {
  const sellerId = req.user._id;

  // Sum sellerAmount for escrows that are Pending or Held (not yet Released/Refunded)
  const agg = await Escrow.aggregate([
    { $match: { sellerId: sellerId, status: { $in: ["Pending", "Held"] } } },
    {
      $group: {
        _id: null,
        totalReceivable: { $sum: "$sellerAmount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalReceivable = agg && agg.length > 0 ? agg[0].totalReceivable : 0;

  res.status(200).json({ success: true, receivable: totalReceivable });
});
