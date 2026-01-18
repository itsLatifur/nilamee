import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { User } from "../users/users.model.js";
import { TransactionHistory } from "../transactions/transactionHistory.model.js";
import { Escrow } from "../escrow/escrow.model.js";
import { Auction } from "../auctions/auctions.model.js";
import { Commission } from "../commissions/commissions.model.js";
import { Notification } from "../../models/notificationSchema.js";
import { Feedback } from "../feedback/feedback.model.js";

// Get user profile (basic or premium view based on viewer's subscription)
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select(
    "-password -paymentMethods -unpaidCommission -deletedAt -deletionReason -bannedReason -suspendedReason",
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
      "userName badgeTier starRating trustScore totalTransactionVolume completedAuctionsCount isPremium isVerifiedSeller isVerifiedBuyer",
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
    0,
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

// Get escrows for current seller (for display in sell history)
export const getMyEscrows = catchAsyncErrors(async (req, res, next) => {
  const sellerId = req.user._id;

  const escrows = await Escrow.find({ sellerId })
    .sort({ createdAt: -1 })
    .populate("auctionId", "title")
    .populate("buyerId", "userName email");

  res.status(200).json({ success: true, escrows });
});

// Get escrows where the current user is the buyer
export const getMyBuyerEscrows = catchAsyncErrors(async (req, res, next) => {
  const buyerId = req.user._id;

  const escrows = await Escrow.find({ buyerId })
    .sort({ createdAt: -1 })
    .populate("auctionId", "title")
    .populate("sellerId", "userName email");

  res.status(200).json({ success: true, escrows });
});

// Get single escrow detail for seller (or admin)
export const getMyEscrowDetail = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new ErrorHandler("Escrow id required.", 400));

  const escrow = await Escrow.findById(id)
    .populate("auctionId", "title currentBid")
    .populate("buyerId", "userName email")
    .populate("sellerId", "userName email paymentInfo");

  if (!escrow) return next(new ErrorHandler("Escrow not found.", 404));

  // Allow seller (owner), buyer (winner) or admin user to view
  try {
    const sellerIdValue = escrow.sellerId
      ? escrow.sellerId._id
        ? escrow.sellerId._id.toString()
        : escrow.sellerId.toString()
      : null;
    const buyerIdValue = escrow.buyerId
      ? escrow.buyerId._id
        ? escrow.buyerId._id.toString()
        : escrow.buyerId.toString()
      : null;

    const sellerEmail = escrow.sellerId && escrow.sellerId.email;
    const buyerEmail = escrow.buyerId && escrow.buyerId.email;

    const isAdmin =
      req.user.role === "Admin" || req.user.role === "Super Admin";
    const isSeller = sellerIdValue && sellerIdValue === req.user._id.toString();
    const isBuyer = buyerIdValue && buyerIdValue === req.user._id.toString();
    const emailMatch =
      req.user.email &&
      (req.user.email === sellerEmail || req.user.email === buyerEmail);

    if (!isAdmin && !isSeller && !isBuyer && !emailMatch) {
      return next(new ErrorHandler("Not authorized to view this escrow.", 403));
    }
  } catch (err) {
    console.error("Escrow detail auth fallback failed:", err);
    return next(new ErrorHandler("Not authorized to view this escrow.", 403));
  }

  res.status(200).json({ success: true, escrow });
});

// Seller marks escrow as shipped. This will (if not on adminHold) process payout:
// - calculate 7% commission, create Commission record
// - create TransactionHistory for seller and update seller totals
// - set escrow.processedAt and escrow.status to 'Shipped' and mark auction Completed
export const shipEscrow = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new ErrorHandler("Escrow id required.", 400));

  const escrow = await Escrow.findById(id)
    .populate({
      path: "auctionId",
      populate: { path: "createdBy", select: "_id email" },
    })
    .populate("sellerId");
  if (!escrow) return next(new ErrorHandler("Escrow not found.", 404));

  // Only seller (owner) or admin can mark shipped
  // Only seller (owner) or admin can mark shipped
  const sellerIdValue = escrow.sellerId
    ? escrow.sellerId._id
      ? escrow.sellerId._id.toString()
      : escrow.sellerId.toString()
    : null;
  // Debug info to help diagnose authorization issues
  console.debug("shipEscrow - sellerIdValue:", sellerIdValue);
  console.debug(
    "shipEscrow - req.user._id:",
    req.user && req.user._id && req.user._id.toString(),
  );
  console.debug("shipEscrow - req.user.role:", req.user && req.user.role);

  // Authorization: allow if seller id matches or if user's email matches seller email, or if admin
  let authorizedToShip = false;
  if (sellerIdValue === req.user._id.toString()) authorizedToShip = true;
  if (req.user.role === "Admin" || req.user.role === "Super Admin")
    authorizedToShip = true;
  if (!authorizedToShip) {
    // Fallback: check auction.createdBy (legacy data might have createdBy as owner)
    try {
      const ownerId =
        escrow.auctionId && escrow.auctionId.createdBy
          ? escrow.auctionId.createdBy._id
            ? escrow.auctionId.createdBy._id.toString()
            : escrow.auctionId.createdBy.toString()
          : null;
      const ownerEmail =
        escrow.auctionId && escrow.auctionId.createdBy
          ? escrow.auctionId.createdBy.email
          : null;
      if (ownerId && ownerId === req.user._id.toString())
        authorizedToShip = true;
      if (
        !authorizedToShip &&
        ownerEmail &&
        req.user.email &&
        ownerEmail === req.user.email
      )
        authorizedToShip = true;
    } catch (err) {
      console.error(
        "Error during auction owner fallback for shipEscrow auth:",
        err,
      );
    }
    // Attempt email fallback (escrow.sellerId may be populated)
    try {
      const sellerEmail =
        escrow.sellerId && escrow.sellerId.email ? escrow.sellerId.email : null;
      if (sellerEmail && req.user.email && sellerEmail === req.user.email) {
        authorizedToShip = true;
      }
    } catch (err) {
      console.error("Error during email fallback for shipEscrow auth:", err);
    }
  }
  if (!authorizedToShip) {
    return next(new ErrorHandler("Not authorized to ship this escrow.", 403));
  }

  // Ensure auction was paid / escrow in a shippable state (Held/Released/Shipped)
  if (
    !(
      escrow.status === "Held" ||
      escrow.status === "Released" ||
      escrow.status === "Shipped"
    )
  ) {
    return next(new ErrorHandler("Escrow is not in a shippable state.", 400));
  }

  // mark shipped
  escrow.status = "Shipped";
  escrow.shippedAt = new Date();
  await escrow.save();

  // If admin hold present, note that payout will be deferred until admin release
  if (escrow.adminHold) {
    return res.status(200).json({
      success: true,
      message: "Escrow marked Shipped. Admin hold in place — payout deferred.",
      escrow,
    });
  }

  res
    .status(200)
    .json({ success: true, message: "Escrow marked Shipped.", escrow });
});

// Buyer (or admin) confirms receipt — process payout: commission 7%, create Commission & TransactionHistory, update seller totals and system revenue
export const receiveEscrow = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new ErrorHandler("Escrow id required.", 400));

  const escrow = await Escrow.findById(id)
    .populate("auctionId")
    .populate("sellerId")
    .populate("buyerId");
  if (!escrow) return next(new ErrorHandler("Escrow not found.", 404));

  // Only buyer (winner) or admin can confirm received
  // Only buyer (winner) or admin can confirm received
  let authorizedToConfirm = false;
  try {
    const buyerIdValue = escrow.buyerId
      ? escrow.buyerId._id
        ? escrow.buyerId._id.toString()
        : escrow.buyerId.toString()
      : null;
    if (buyerIdValue === req.user._id.toString()) authorizedToConfirm = true;
    if (req.user.role === "Admin" || req.user.role === "Super Admin")
      authorizedToConfirm = true;
    if (!authorizedToConfirm) {
      // email fallback
      const buyerEmail =
        escrow.buyerId && escrow.buyerId.email ? escrow.buyerId.email : null;
      if (buyerEmail && req.user.email && buyerEmail === req.user.email)
        authorizedToConfirm = true;
    }
  } catch (err) {
    console.error("Error during buyer auth fallback:", err);
  }
  if (!authorizedToConfirm) {
    return next(
      new ErrorHandler(
        "Not authorized to confirm receipt for this escrow.",
        403,
      ),
    );
  }

  if (escrow.status !== "Shipped") {
    return next(new ErrorHandler("Escrow is not marked shipped.", 400));
  }

  // If adminHold present, mark Received but defer payout
  if (escrow.adminHold) {
    escrow.status = "Received";
    escrow.receivedAt = new Date();
    await escrow.save();

    return res.status(200).json({
      success: true,
      message: "Escrow marked Received. Admin hold in place — payout deferred.",
      escrow,
    });
  }

  // Compute amounts
  const total = Number(escrow.totalAmount || 0);
  const commissionAmount = Math.round(total * 0.07 * 100) / 100;
  const sellerAmount = Math.round((total - commissionAmount) * 100) / 100;

  // Attempt atomic update: set processedAt only when not already set
  let updated = await Escrow.findOneAndUpdate(
    { _id: escrow._id, processedAt: null },
    {
      $set: {
        status: "Received",
        receivedAt: new Date(),
        commissionAmount,
        sellerAmount,
        processedAt: new Date(),
      },
    },
    { new: true },
  );

  // If updated is null, it means processedAt was already set — avoid double-processing
  if (!updated) {
    const refreshed = await Escrow.findById(escrow._id).populate("auctionId");
    return res.status(200).json({
      success: true,
      message: "Escrow already processed.",
      escrow: refreshed,
    });
  }

  // Ensure auctionId is populated for downstream snapshot/tx creation
  if (!updated.auctionId || !updated.auctionId.title) {
    updated = await Escrow.findById(updated._id).populate("auctionId");
  }

  // create commission record (platform revenue) only if not exists for this escrow
  try {
    const existingComm = await Commission.findOne({ escrowId: updated._id });
    if (!existingComm) {
      await Commission.create({
        amount: commissionAmount,
        user: updated.sellerId,
        escrowId: updated._id,
        source: "auction",
      });
    }
  } catch (err) {
    console.error("Commission create failed:", err);
  }

  // snapshot seller and update totals; create TransactionHistory only if absent
  try {
    const seller = await User.findById(updated.sellerId).select(
      "paymentInfo userName email totalTransactionVolume completedAuctionsCount stats",
    );
    if (seller) {
      // Update seller totals
      seller.totalTransactionVolume =
        (seller.totalTransactionVolume || 0) + sellerAmount;
      seller.completedAuctionsCount = (seller.completedAuctionsCount || 0) + 1;
      seller.stats = seller.stats || {};
      seller.stats.totalAuctionsCompleted =
        (seller.stats.totalAuctionsCompleted || 0) + 1;
      seller.lastActivityDate = new Date();
      await seller.save();

      const existingTx = await TransactionHistory.findOne({
        escrowId: updated._id,
        role: "Auctioneer",
      });
      if (!existingTx) {
        await TransactionHistory.create({
          userId: seller._id,
          auctionId: updated.auctionId._id,
          escrowId: updated._id,
          role: "Auctioneer",
          amount: sellerAmount,
          auctionTitle: updated.auctionId.title || "",
          outcome: "Success",
          completedAt: new Date(),
        });
      }
    }
  } catch (err) {
    console.error("Snapshot seller info failed:", err);
  }

  // mark auction as completed/sold
  try {
    if (escrow.auctionId && escrow.auctionId._id) {
      await Auction.findByIdAndUpdate(escrow.auctionId._id, {
        overallStatus: "Completed",
        deliveryStatus: "Received",
        receivedAt: new Date(),
      });
    }
  } catch (err) {
    console.error("Failed updating auction status after receive:", err);
  }

  // notification to seller
  try {
    await Notification.create({
      userId: escrow.sellerId,
      title: "Buyer Confirmed Receipt",
      message: `Buyer ${escrow.buyerId?.userName || ""} confirmed receipt for auction ${escrow.auctionId.title}. Seller payout: BDT ${sellerAmount.toFixed(2)}. Commission: BDT ${commissionAmount.toFixed(2)}.`,
      type: "info",
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }

  // Return the refreshed escrow document with populated refs
  try {
    const refreshed = await Escrow.findById(updated._id)
      .populate("auctionId")
      .populate("buyerId")
      .populate("sellerId");

    return res.status(200).json({
      success: true,
      message: "Receipt confirmed and payout processed.",
      escrow: refreshed,
    });
  } catch (err) {
    console.error("Failed to reload escrow after processing:", err);
    return res.status(200).json({
      success: true,
      message: "Receipt confirmed and payout processed.",
      escrow: updated,
    });
  }
});
