import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { Dispute } from "./dispute.model.js";
import { Auction } from "../auctions/auctions.model.js";
import { Escrow } from "../escrow/escrow.model.js";
import { User } from "../users/users.model.js";
import { sendEmail } from "../../utils/sendEmail.js";
import {
  calculateBadgeTier,
  calculateStarRating,
} from "../../shared/utils/trustScoreUtils.js";

// Raise a dispute (buyer action)
export const raiseDispute = catchAsyncErrors(async (req, res, next) => {
  const { auctionId, type, description } = req.body;

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
    return next(new ErrorHandler("Only the buyer can raise a dispute.", 403));
  }

  // Verify payment has been made
  if (auction.paymentStatus !== "Paid") {
    return next(
      new ErrorHandler("Cannot raise dispute - payment not completed.", 400)
    );
  }

  // Check if dispute already exists
  const existingDispute = await Dispute.findOne({
    auctionId: auction._id,
    status: { $in: ["Open", "Under Review"] },
  });

  if (existingDispute) {
    return next(
      new ErrorHandler("A dispute is already open for this auction.", 400)
    );
  }

  const dispute = await Dispute.create({
    auctionId: auction._id,
    raisedBy: req.user._id,
    type,
    description,
  });

  // Update auction status
  auction.overallStatus = "Disputed";
  await auction.save();

  // Notify seller
  const seller = auction.createdBy;
  if (seller && seller.email) {
    const subject = `Dispute Raised - ${auction.title}`;
    const message = `Dear ${
      seller.userName
    },\n\nA dispute has been raised by the buyer for your auction "${
      auction.title
    }".\n\n**Dispute Details:**\n- Type: ${type}\n- Description: ${description}\n- Raised On: ${new Date().toLocaleDateString(
      "en-BD"
    )}\n\n**Next Steps:**\nOur admin team will review the dispute and contact both parties. Payment is currently held in escrow pending resolution.\n\nPlease be prepared to provide any relevant information or evidence.\n\nDispute ID: ${
      dispute._id
    }\n\nBest regards,\nNilamee Auction Team`;

    await sendEmail({
      email: seller.email,
      subject,
      message,
    });
  }

  res.status(201).json({
    success: true,
    message: "Dispute raised successfully. Our team will review it shortly.",
    dispute,
  });
});

// Get all disputes (admin only)
export const getAllDisputes = catchAsyncErrors(async (req, res, next) => {
  const disputes = await Dispute.find()
    .populate("auctionId")
    .populate("raisedBy", "userName email")
    .populate("resolvedBy", "userName")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    disputes,
  });
});

// Get dispute details
export const getDisputeDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const dispute = await Dispute.findById(id)
    .populate("auctionId")
    .populate("raisedBy", "userName email phone")
    .populate("resolvedBy", "userName");

  if (!dispute) {
    return next(new ErrorHandler("Dispute not found.", 404));
  }

  res.status(200).json({
    success: true,
    dispute,
  });
});

// Resolve dispute (admin action)
export const resolveDispute = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { resolution, action } = req.body; // action: "Refund" or "Release"

  const dispute = await Dispute.findById(id).populate({
    path: "auctionId",
    populate: { path: "createdBy highestBidder" },
  });

  if (!dispute) {
    return next(new ErrorHandler("Dispute not found.", 404));
  }

  if (dispute.status === "Resolved") {
    return next(
      new ErrorHandler("This dispute has already been resolved.", 400)
    );
  }

  if (!["Refund", "Release", "Partial Refund"].includes(action)) {
    return next(
      new ErrorHandler(
        "Invalid action. Must be Refund, Release, or Partial Refund.",
        400
      )
    );
  }

  dispute.status = "Resolved";
  dispute.resolution = resolution;
  dispute.action = action;
  dispute.resolvedBy = req.user._id;
  dispute.resolvedAt = new Date();
  await dispute.save();

  const auction = dispute.auctionId;
  const escrow = await Escrow.findOne({ auctionId: auction._id });

  if (escrow && escrow.status === "Held") {
    if (action === "Refund") {
      escrow.status = "Refunded";
      escrow.refundedAt = new Date();
      auction.overallStatus = "Cancelled";
    } else if (action === "Release") {
      escrow.status = "Released";
      escrow.releasedAt = new Date();
      auction.overallStatus = "Completed";
    }
    await escrow.save();
    await auction.save();
  }

  // APPLY TRUST SCORE PENALTIES
  let buyerUser = await User.findById(auction.highestBidder._id);
  let sellerUser = await User.findById(auction.createdBy._id);

  if (action === "Refund") {
    // Buyer wins dispute - penalize seller
    if (sellerUser) {
      sellerUser.trustScore = Math.max(0, sellerUser.trustScore - 50);
      sellerUser.stats.disputesLost += 1;
      sellerUser.badgeTier = calculateBadgeTier(
        sellerUser.totalTransactionVolume
      );
      sellerUser.starRating = calculateStarRating(sellerUser.trustScore);
      await sellerUser.save();
    }
  } else if (action === "Release") {
    // Seller wins dispute - penalize buyer for frivolous dispute
    if (buyerUser) {
      buyerUser.trustScore = Math.max(0, buyerUser.trustScore - 10);
      buyerUser.stats.disputesLost += 1;
      buyerUser.badgeTier = calculateBadgeTier(
        buyerUser.totalTransactionVolume
      );
      buyerUser.starRating = calculateStarRating(buyerUser.trustScore);
      await buyerUser.save();
    }
  } else if (action === "Partial Refund") {
    // Both at fault - minor penalty for both
    if (sellerUser) {
      sellerUser.trustScore = Math.max(0, sellerUser.trustScore - 10);
      sellerUser.badgeTier = calculateBadgeTier(
        sellerUser.totalTransactionVolume
      );
      sellerUser.starRating = calculateStarRating(sellerUser.trustScore);
      await sellerUser.save();
    }
    if (buyerUser) {
      buyerUser.trustScore = Math.max(0, buyerUser.trustScore - 10);
      buyerUser.badgeTier = calculateBadgeTier(
        buyerUser.totalTransactionVolume
      );
      buyerUser.starRating = calculateStarRating(buyerUser.trustScore);
      await buyerUser.save();
    }
  }

  // Notify both parties
  const buyer = auction.highestBidder;
  const seller = auction.createdBy;

  if (buyer && buyer.email) {
    const buyerSubject = `Dispute Resolved - ${auction.title}`;
    const buyerMessage = `Dear ${buyer.userName},\n\nYour dispute for "${
      auction.title
    }" has been resolved.\n\n**Resolution:**\n${resolution}\n\n**Action Taken:**\n${
      action === "Refund"
        ? "You will receive a refund of BDT " + auction.currentBid
        : action === "Release"
        ? "Payment has been released to the seller"
        : "Partial refund will be processed"
    }\n\nIf you have any questions, please contact our support team.\n\nThank you,\nNilamee Auction Team`;

    await sendEmail({
      email: buyer.email,
      subject: buyerSubject,
      message: buyerMessage,
    });
  }

  if (seller && seller.email) {
    const sellerSubject = `Dispute Resolved - ${auction.title}`;
    const sellerMessage = `Dear ${seller.userName},\n\nThe dispute for "${
      auction.title
    }" has been resolved.\n\n**Resolution:**\n${resolution}\n\n**Action Taken:**\n${
      action === "Refund"
        ? "Buyer will receive a refund"
        : action === "Release"
        ? "Payment has been released to you (BDT " +
          (auction.currentBid * 0.93).toFixed(2) +
          ")"
        : "Partial refund will be processed"
    }\n\nThank you,\nNilamee Auction Team`;

    await sendEmail({
      email: seller.email,
      subject: sellerSubject,
      message: sellerMessage,
    });
  }

  res.status(200).json({
    success: true,
    message: "Dispute resolved successfully. Both parties have been notified.",
    dispute,
  });
});
