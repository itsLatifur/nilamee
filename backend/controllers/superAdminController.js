import mongoose from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Commission } from "../models/commissionSchema.js";
import { Escrow } from "../features/escrow/escrow.model.js";
import { User } from "../features/users/users.model.js";
import { Auction } from "../models/auctionSchema.js";
import { PaymentProof } from "../models/commissionProofSchema.js";

export const deleteAuctionItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }
  await auctionItem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Auction item deleted successfully.",
  });
});

export const getAllPaymentProofs = catchAsyncErrors(async (req, res, next) => {
  let paymentProofs = await PaymentProof.find();
  res.status(200).json({
    success: true,
    paymentProofs,
  });
});

export const getPaymentProofDetail = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const paymentProofDetail = await PaymentProof.findById(id);
    res.status(200).json({
      success: true,
      paymentProofDetail,
    });
  },
);

export const updateProofStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { amount, status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }
  let proof = await PaymentProof.findById(id);
  if (!proof) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }
  proof = await PaymentProof.findByIdAndUpdate(
    id,
    { status, amount },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    },
  );
  res.status(200).json({
    success: true,
    message: "Payment proof amount and status updated.",
    proof,
  });
});

export const deletePaymentProof = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const proof = await PaymentProof.findById(id);
  if (!proof) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }
  await proof.deleteOne();
  res.status(200).json({
    success: true,
    message: "Payment proof deleted.",
  });
});

export const fetchAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $month: "$createdAt" },
          role: "$role",
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        month: "$_id.month",
        year: "$_id.year",
        role: "$_id.role",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);

  const bidders = users.filter((user) => user.role === "Bidder");
  const auctioneers = users.filter((user) => user.role === "Auctioneer");

  const tranformDataToMonthlyArray = (data, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);

    data.forEach((item) => {
      result[item.month - 1] = item.count;
    });

    return result;
  };

  const biddersArray = tranformDataToMonthlyArray(bidders);
  const auctioneersArray = tranformDataToMonthlyArray(auctioneers);

  res.status(200).json({
    success: true,
    biddersArray,
    auctioneersArray,
  });
});

export const monthlyRevenue = catchAsyncErrors(async (req, res, next) => {
  // Try Commission collection first (primary source)
  let payments = await Commission.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  // Fallback: if Commission collection is empty or amounts are all zero, aggregate from Escrow.commissionAmount (processed escrows)
  const paymentsSum = (payments || []).reduce(
    (s, p) => s + (p.totalAmount || 0),
    0,
  );
  if (!payments || payments.length === 0 || paymentsSum === 0) {
    try {
      const escrowAgg = await Escrow.aggregate([
        { $match: { processedAt: { $ne: null } } },
        {
          $group: {
            _id: {
              month: { $month: "$processedAt" },
              year: { $year: "$processedAt" },
            },
            totalAmount: { $sum: "$commissionAmount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
      if (escrowAgg && escrowAgg.length > 0) payments = escrowAgg;
    } catch (err) {
      console.error("Fallback escrow commission aggregation failed:", err);
    }
  }

  const tranformDataToMonthlyArray = (payments, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);

    payments.forEach((payment) => {
      result[payment._id.month - 1] = payment.totalAmount;
    });

    return result;
  };

  const totalMonthlyRevenue = tranformDataToMonthlyArray(payments);
  res.status(200).json({
    success: true,
    totalMonthlyRevenue,
  });
});

// Return recent processed escrows with commission and seller amounts for admin overview
export const recentCommissions = catchAsyncErrors(async (req, res, next) => {
  try {
    const recent = await Escrow.find({ processedAt: { $ne: null } })
      .sort({ processedAt: -1 })
      .limit(20)
      .populate("auctionId", "title")
      .populate("sellerId", "userName email")
      .populate("buyerId", "userName email");

    const items = (recent || []).map((r) => ({
      escrowId: r._id,
      auctionTitle: r.auctionId?.title || "(auction)",
      commissionAmount: r.commissionAmount || 0,
      sellerAmount: r.sellerAmount || 0,
      totalAmount: r.totalAmount || 0,
      processedAt: r.processedAt || r.receivedAt || null,
      seller: r.sellerId
        ? { id: r.sellerId._id, userName: r.sellerId.userName }
        : null,
      buyer: r.buyerId
        ? { id: r.buyerId._id, userName: r.buyerId.userName }
        : null,
    }));

    res.status(200).json({ success: true, items });
  } catch (err) {
    console.error("recentCommissions failed:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch recent commissions" });
  }
});

// Debug endpoint: show counts, sums and sample docs for quick admin verification
export const debugCommissions = catchAsyncErrors(async (req, res, next) => {
  try {
    const commissionCount = await Commission.countDocuments();
    const commissionSumAgg = await Commission.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const commissionTotal =
      commissionSumAgg && commissionSumAgg[0] ? commissionSumAgg[0].total : 0;
    const commissionSample = await Commission.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const escrowCount = await Escrow.countDocuments({
      processedAt: { $ne: null },
    });
    const escrowSample = await Escrow.find({ processedAt: { $ne: null } })
      .sort({ processedAt: -1 })
      .limit(10)
      .populate("auctionId", "title")
      .populate("sellerId", "userName email")
      .populate("buyerId", "userName email");

    res.status(200).json({
      success: true,
      commission: {
        count: commissionCount,
        total: commissionTotal,
        sample: commissionSample,
      },
      escrow: {
        count: escrowCount,
        sample: escrowSample,
      },
    });
  } catch (err) {
    console.error("debugCommissions failed:", err);
    res.status(500).json({ success: false, message: "Debug query failed" });
  }
});
