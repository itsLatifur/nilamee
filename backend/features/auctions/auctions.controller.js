import { Auction } from "./auctions.model.js";
import { User } from "../users/users.model.js";
import { Bid } from "../bids/bids.model.js";
import { Escrow } from "../escrow/escrow.model.js";
import { TransactionHistory } from "../transactions/transactionHistory.model.js";
import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { sendEmail } from "../../utils/sendEmail.js";
import { Notification } from "../../models/notificationSchema.js";
import {
  calculateBadgeTier,
  calculateStarRating,
  calculateTrustPoints,
} from "../../shared/utils/trustScoreUtils.js";

export const addNewAuctionItem = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(
      new ErrorHandler("At least one auction item image required.", 400),
    );
  }

  // Handle multiple images
  const images = req.files.images;
  const imageArray = Array.isArray(images) ? images : [images];

  // Validate max 6 images
  if (imageArray.length > 6) {
    return next(new ErrorHandler("You can upload maximum 6 images.", 400));
  }

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  for (const img of imageArray) {
    if (!allowedFormats.includes(img.mimetype)) {
      return next(
        new ErrorHandler(
          "File format not supported. Use PNG, JPEG, or WEBP.",
          400,
        ),
      );
    }
  }

  const {
    title,
    description,
    category,
    condition,
    startingBid,
    startTime,
    endTime,
    location,
    address,
    authenticity,
    customFields,
  } = req.body;

  if (
    !title ||
    !description ||
    !category ||
    !condition ||
    !startingBid ||
    !startTime ||
    !endTime
  ) {
    return next(new ErrorHandler("Please provide all required details.", 400));
  }

  // Parse customFields if it's a string
  let parsedCustomFields = [];
  if (customFields) {
    try {
      parsedCustomFields =
        typeof customFields === "string"
          ? JSON.parse(customFields)
          : customFields;

      if (parsedCustomFields.length > 10) {
        return next(new ErrorHandler("Maximum 10 custom fields allowed.", 400));
      }
    } catch (error) {
      return next(new ErrorHandler("Invalid custom fields format.", 400));
    }
  }

  if (new Date(startTime) < Date.now()) {
    return next(
      new ErrorHandler(
        "Auction starting time must be greater than present time.",
        400,
      ),
    );
  }
  if (new Date(startTime) >= new Date(endTime)) {
    return next(
      new ErrorHandler(
        "Auction starting time must be less than ending time.",
        400,
      ),
    );
  }

  try {
    // Upload all images to cloudinary
    const uploadedImages = [];
    for (const img of imageArray) {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        img.tempFilePath,
        {
          folder: "MERN_AUCTION_PLATFORM_AUCTIONS",
        },
      );
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
          "Cloudinary error:",
          cloudinaryResponse.error || "Unknown cloudinary error.",
        );
        return next(
          new ErrorHandler(
            "Failed to upload auction image to cloudinary.",
            500,
          ),
        );
      }
      uploadedImages.push({
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      });
    }

    const auctionItem = await Auction.create({
      title,
      description,
      category,
      condition,
      startingBid,
      startTime,
      endTime,
      images: uploadedImages,
      location: location || "",
      address: address || "",
      authenticity: authenticity || "",
      customFields: parsedCustomFields,
      createdBy: req.user._id,
    });
    return res.status(201).json({
      success: true,
      message: `Auction item created successfully. It will be listed after admin approval.`,
      auctionItem,
    });
  } catch (error) {
    return next(
      new ErrorHandler(error.message || "Failed to created auction.", 500),
    );
  }
});

export const getAllItems = catchAsyncErrors(async (req, res, next) => {
  // Only show approved auctions that are not soft-deleted
  let items = await Auction.find({
    approvalStatus: "approved",
    isDeleted: false,
  });
  res.status(200).json({
    success: true,
    items,
  });
});

export const getAuctionDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }
  const bidders = auctionItem.bids.sort((a, b) => b.amount - a.amount);
  res.status(200).json({
    success: true,
    auctionItem,
    bidders,
  });
});

export const getMyAuctionItems = catchAsyncErrors(async (req, res, next) => {
  // Show all user's auctions including soft-deleted ones
  const items = await Auction.find({ createdBy: req.user._id });
  res.status(200).json({
    success: true,
    items,
  });
});

// Get auctions the current user won (highestBidder) and that have ended
export const getMyWonAuctions = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  // Find auctions where highestBidder matches current user.
  // Note: some auctions may store `endTime` as string; perform robust filtering in JS
  // Find auctions where highestBidder matches current user OR the user appears in bids (various shapes)
  // This makes the endpoint more forgiving if data was stored in different formats.
  const allWon = await Auction.find({
    $or: [
      { highestBidder: userId },
      { "bids.userId": userId },
      { "bids.bidder.id": userId },
    ],
  })
    .sort({ endTime: -1 })
    .populate("createdBy", "userName email");

  const now = new Date();
  const items = allWon.filter((auc) => {
    try {
      // Determine the resolved winner for this auction
      let winnerId = null;
      if (auc.highestBidder) winnerId = auc.highestBidder.toString();
      else if (Array.isArray(auc.bids) && auc.bids.length > 0) {
        const top = auc.bids.reduce(
          (prev, cur) => (cur.amount > (prev.amount || 0) ? cur : prev),
          {},
        );
        if (top) {
          if (top.userId) winnerId = top.userId.toString();
          else if (top.bidder && top.bidder.id)
            winnerId = top.bidder.id.toString();
        }
      }

      // Only include auctions where the resolved winner is the current user
      if (!winnerId || winnerId !== userId.toString()) return false;

      // Now apply the same ended/awaiting-payment checks
      const end = auc.endTime ? new Date(auc.endTime) : null;
      if (end && !isNaN(end.getTime())) {
        return end < now;
      }
      if (
        typeof auc.overallStatus === "string" &&
        auc.overallStatus.includes("Ended")
      ) {
        return true;
      }
      if (
        auc.paymentDeadline ||
        (auc.paymentStatus && auc.paymentStatus !== "Unpaid")
      ) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  });

  res.status(200).json({ success: true, items });
});

// Debug endpoint: returns diagnostic info about matched and filtered auctions for the current user
export const getMyWonAuctionsDebug = catchAsyncErrors(
  async (req, res, next) => {
    const userId = req.user._id;

    const allWon = await Auction.find({
      $or: [
        { highestBidder: userId },
        { "bids.userId": userId },
        { "bids.bidder.id": userId },
      ],
    })
      .sort({ endTime: -1 })
      .populate("createdBy", "userName email");

    const now = new Date();
    const items = [];
    const sampleAll = [];
    for (const auc of allWon) {
      // compute resolved winner
      let winnerId = null;
      if (auc.highestBidder) winnerId = auc.highestBidder.toString();
      else if (Array.isArray(auc.bids) && auc.bids.length > 0) {
        const top = auc.bids.reduce(
          (prev, cur) => (cur.amount > (prev.amount || 0) ? cur : prev),
          {},
        );
        if (top) {
          if (top.userId) winnerId = top.userId.toString();
          else if (top.bidder && top.bidder.id)
            winnerId = top.bidder.id.toString();
        }
      }

      const end = auc.endTime ? new Date(auc.endTime) : null;
      const isEnded =
        (end && !isNaN(end.getTime()) && end < now) ||
        (typeof auc.overallStatus === "string" &&
          auc.overallStatus.includes("Ended")) ||
        auc.paymentDeadline ||
        (auc.paymentStatus && auc.paymentStatus !== "Unpaid");

      sampleAll.push(
        Object.assign({}, auc.toObject ? auc.toObject() : auc, {
          resolvedWinner: winnerId,
          isEnded,
        }),
      );

      if (winnerId && winnerId === userId.toString() && isEnded) {
        items.push(
          Object.assign({}, auc.toObject ? auc.toObject() : auc, {
            resolvedWinner: winnerId,
          }),
        );
      }
    }

    res.status(200).json({
      success: true,
      totalMatches: allWon.length,
      matched: items.length,
      sampleAll: sampleAll.slice(0, 5),
      sampleMatched: items.slice(0, 5),
    });
  },
);

export const removeFromAuction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const auctionItem = await Auction.findById(id).setOptions({
    includeDeleted: true,
  });
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }

  // Soft delete
  auctionItem.isDeleted = true;
  auctionItem.deletedAt = new Date();
  auctionItem.deletedBy = req.user._id;
  auctionItem.deletionReason = "Deleted by auctioneer";
  await auctionItem.save();

  res.status(200).json({
    success: true,
    message: "Auction item deleted successfully.",
  });
});

export const republishItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  let auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }
  if (!req.body.startTime || !req.body.endTime) {
    return next(
      new ErrorHandler("Starttime and Endtime for republish is mandatory."),
    );
  }
  if (new Date(auctionItem.endTime) > Date.now()) {
    return next(
      new ErrorHandler("Auction is already active, cannot republish", 400),
    );
  }
  let data = {
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
  };
  if (data.startTime < Date.now()) {
    return next(
      new ErrorHandler(
        "Auction starting time must be greater than present time",
        400,
      ),
    );
  }
  if (data.startTime >= data.endTime) {
    return next(
      new ErrorHandler(
        "Auction starting time must be less than ending time.",
        400,
      ),
    );
  }

  if (auctionItem.highestBidder) {
    const highestBidder = await User.findById(auctionItem.highestBidder);
    highestBidder.moneySpent -= auctionItem.currentBid;
    highestBidder.auctionsWon -= 1;
    highestBidder.save();
  }

  data.bids = [];
  data.commissionCalculated = false;
  data.currentBid = 0;
  data.highestBidder = null;
  data.approvalStatus = "pending"; // Republished auctions require admin approval
  data.rejectionReason = ""; // Clear any previous rejection reason
  auctionItem = await Auction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  await Bid.deleteMany({ auctionItem: auctionItem._id });
  const createdBy = await User.findByIdAndUpdate(
    req.user._id,
    { unpaidCommission: 0 },
    {
      new: true,
      runValidators: false,
      useFindAndModify: false,
    },
  );
  res.status(200).json({
    success: true,
    auctionItem,
    message: `Auction republished successfully and is pending admin approval.`,
    createdBy,
  });
});

// Mark auction item as shipped (seller action)
export const markAsShipped = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { trackingNumber } = req.body;

  const auction = await Auction.findById(id).populate("highestBidder");

  if (!auction) {
    return next(new ErrorHandler("Auction not found.", 404));
  }

  // Verify user is the seller
  if (auction.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to update this auction.", 403),
    );
  }

  // Verify payment has been made
  if (auction.paymentStatus !== "Paid") {
    return next(new ErrorHandler("Payment has not been received yet.", 400));
  }

  // Verify not already shipped
  if (auction.deliveryStatus !== "Not Shipped") {
    return next(
      new ErrorHandler("This item has already been marked as shipped.", 400),
    );
  }

  auction.deliveryStatus = "Shipped";
  auction.shippedAt = new Date();
  auction.trackingNumber = trackingNumber || "";
  auction.overallStatus = "Shipped - In Transit";
  await auction.save();

  // Notify buyer
  const buyer = auction.highestBidder;
  if (buyer && buyer.email) {
    const subject = `Your Item Has Been Shipped - ${auction.title}`;
    const message = `Dear ${buyer.userName},\n\nGood news! Your auction item "${
      auction.title
    }" has been shipped!\n\n**Shipping Details:**\n- Item: ${
      auction.title
    }\n- Amount Paid: BDT ${auction.currentBid}\n- Tracking Number: ${
      trackingNumber || "Not provided"
    }\n- Shipped On: ${new Date().toLocaleDateString(
      "en-BD",
    )}\n\n**Next Steps:**\n1. Track your shipment using the tracking number${
      trackingNumber ? ` (${trackingNumber})` : ""
    }\n2. Once you receive the item, please confirm delivery on our platform\n3. Your confirmation will release the payment to the seller\n\n**Important:**\nYou have 48 hours after receiving the item to confirm delivery or report any issues.\n\nTrack your order: ${
      process.env.FRONTEND_URL
    }/auction/${
      auction._id
    }/payment\n\nThank you for your purchase!\n\nBest regards,\nNilamee Auction Team`;

    await sendEmail({
      email: buyer.email,
      subject,
      message,
    });
  }

  res.status(200).json({
    success: true,
    message: "Item marked as shipped successfully. Buyer has been notified.",
    auction,
  });
});

// Confirm delivery (buyer action)
export const confirmDelivery = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const auction = await Auction.findById(id).populate("createdBy");

  if (!auction) {
    return next(new ErrorHandler("Auction not found.", 404));
  }

  // Verify user is the buyer
  if (
    !auction.highestBidder ||
    auction.highestBidder.toString() !== req.user._id.toString()
  ) {
    return next(
      new ErrorHandler("You are not authorized to confirm this delivery.", 403),
    );
  }

  // Verify item has been shipped
  if (auction.deliveryStatus !== "Shipped") {
    return next(new ErrorHandler("This item has not been shipped yet.", 400));
  }

  // Verify not already delivered
  if (auction.deliveryStatus === "Delivered") {
    return next(new ErrorHandler("Delivery has already been confirmed.", 400));
  }

  auction.deliveryStatus = "Delivered";
  auction.deliveredAt = new Date();
  auction.overallStatus = "Completed";
  await auction.save();

  // Release escrow (mark as released - admin can manually process)
  const escrow = await Escrow.findOne({ auctionId: auction._id });
  if (escrow && escrow.status === "Held") {
    if (escrow.adminHold) {
      // If admin has placed a manual hold, do not auto-release. Notify parties and admin.
      auction.overallStatus = "On Hold - Awaiting Admin Action";
      await auction.save();

      // Notify buyer and seller that admin placed a hold
      try {
        if (auction.createdBy && auction.createdBy.email) {
          await sendEmail({
            email: auction.createdBy.email,
            subject: `Payout On Hold - ${auction.title}`,
            message: `Your payout for auction "${auction.title}" is currently on hold by the admin for review. Admin will review and process shortly.`,
          });
        }
      } catch (err) {
        console.error("Failed to email seller about hold:", err);
      }

      try {
        const buyer = auction.highestBidder;
        if (buyer && buyer.email) {
          await sendEmail({
            email: buyer.email,
            subject: `Delivery Confirmed - Payment On Hold`,
            message: `The buyer has confirmed delivery for "${auction.title}" but the payment is currently on hold by admin. We will notify you when the review is complete.`,
          });
        }
      } catch (err) {
        console.error("Failed to email buyer about hold:", err);
      }
    } else {
      escrow.status = "Released";
      escrow.releasedAt = new Date();
      await escrow.save();

      // UPDATE SELLER TRUST SCORE
      const seller = await User.findById(auction.createdBy._id);
      if (seller) {
        const deliveryTime = Date.now() - new Date(auction.shippedAt).getTime();
        const deliveryHours = deliveryTime / (1000 * 60 * 60);

        const trustPointsEarned = calculateTrustPoints({
          role: "Auctioneer",
          amount: auction.currentBid,
          timeHours: deliveryHours,
        });

        seller.trustScore += trustPointsEarned;
        seller.totalTransactionVolume += auction.currentBid;
        seller.completedAuctionsCount += 1;
        seller.stats.totalAuctionsCompleted += 1;
        seller.stats.averageDeliveryTime =
          (seller.stats.averageDeliveryTime *
            (seller.completedAuctionsCount - 1) +
            deliveryHours) /
          seller.completedAuctionsCount;

        // First delivery? Award verified badge
        if (!seller.isVerifiedSeller) {
          seller.isVerifiedSeller = true;
          if (!seller.firstSuccessfulAuctionDate) {
            seller.firstSuccessfulAuctionDate = new Date();
          }
        }

        // Recalculate badge tier and star rating
        seller.badgeTier = calculateBadgeTier(seller.totalTransactionVolume);
        seller.starRating = calculateStarRating(seller.trustScore);
        seller.lastActivityDate = new Date();
        await seller.save();

        // Log transaction history
        await TransactionHistory.create({
          userId: seller._id,
          auctionId: auction._id,
          role: "Auctioneer",
          amount: auction.currentBid,
          trustPointsEarned,
          deliveryTimeHours: deliveryHours,
          outcome: "Success",
          auctionTitle: auction.title,
        });

        // Notify seller
        const subject = `Delivery Confirmed - Payment Released for ${auction.title}`;
        const message = `Dear ${
          seller.userName
        },\n\nGreat news! The buyer has confirmed delivery of "${
          auction.title
        }".\n\n**Transaction Details:**\n- Item: ${
          auction.title
        }\n- Total Amount: BDT ${auction.currentBid}\n- Your Share (93%): BDT ${(
          auction.currentBid * 0.93
        ).toFixed(2)}\n- Platform Commission (7%): BDT ${(
          auction.currentBid * 0.07
        ).toFixed(
          2,
        )}\n- Status: Payment Released\n\n**Next Steps:**\nYour payment has been released from escrow. An admin will process the payout shortly.\n\nThe transaction is now complete!\n\nThank you for using Nilamee Auction Platform!\n\nBest regards,\nNilamee Auction Team`;

        await sendEmail({
          email: seller.email,
          subject,
          message,
        });
      }
    }
  }

  res.status(200).json({
    success: true,
    message:
      "Delivery confirmed successfully. Payment has been released to seller.",
    auction,
  });
});
