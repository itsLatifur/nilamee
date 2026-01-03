import mongoose from "mongoose";
import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { Commission } from "../commissions/commissions.model.js";
import { User } from "../users/users.model.js";
import { Auction } from "../auctions/auctions.model.js";
import { PaymentProof } from "../commissions/proof.model.js";
import { Notification } from "../../models/notificationSchema.js";
import bcrypt from "bcrypt";

export const deleteAuctionItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

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
  auctionItem.deletionReason = reason || "Deleted by admin";
  await auctionItem.save();

  res.status(200).json({
    success: true,
    message: "Auction item soft-deleted successfully.",
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
  }
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
    }
  );
  res.status(200).json({
    success: true,
    message: "Payment proof amount and status updated.",
    proof,
  });
});

export const deletePaymentProof = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  const proof = await PaymentProof.findById(id).setOptions({
    includeDeleted: true,
  });
  if (!proof) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }

  // Soft delete
  proof.isDeleted = true;
  proof.deletedAt = new Date();
  proof.deletedBy = req.user._id;
  proof.deletionReason = reason || "Deleted by admin";
  await proof.save();

  res.status(200).json({
    success: true,
    message: "Payment proof soft-deleted.",
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
  const payments = await Commission.aggregate([
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

export const getPendingAuctions = catchAsyncErrors(async (req, res, next) => {
  const pendingAuctions = await Auction.find({
    approvalStatus: "pending",
    isDeleted: false,
  })
    .populate("createdBy", "userName email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    pendingAuctions,
  });
});

export const approveAuction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }

  const auction = await Auction.findById(id);
  if (!auction) {
    return next(new ErrorHandler("Auction not found.", 404));
  }

  auction.approvalStatus = "approved";
  await auction.save();

  res.status(200).json({
    success: true,
    message: "Auction approved successfully.",
    auction,
  });
});

export const rejectAuction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }

  const auction = await Auction.findById(id);
  if (!auction) {
    return next(new ErrorHandler("Auction not found.", 404));
  }

  auction.approvalStatus = "rejected";
  auction.rejectionReason = reason || "Does not meet platform guidelines";
  await auction.save();

  res.status(200).json({
    success: true,
    message: "Auction rejected.",
    auction,
  });
});

// User Management Functions

// Create Admin (Super Admin and Admin can create admins)
export const createAdmin = catchAsyncErrors(async (req, res, next) => {
  const { userName, email, password, phone, address } = req.body;

  // Check if requester is Super Admin or Admin
  if (req.user.role !== "Super Admin" && req.user.role !== "Admin") {
    return next(
      new ErrorHandler(
        "Only Super Admin or Admin can create admin accounts.",
        403
      )
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email }).setOptions({
    includeDeleted: true,
  });
  if (existingUser) {
    return next(new ErrorHandler("User with this email already exists.", 400));
  }

  // Create admin user
  const admin = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role: "Admin",
    profileImage: {
      public_id: "",
      url: "",
    },
  });

  res.status(201).json({
    success: true,
    message: "Admin account created successfully.",
    admin: {
      _id: admin._id,
      userName: admin.userName,
      email: admin.email,
      role: admin.role,
    },
  });
});

// Get all users with search and filter
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const { search, role, status, page = 1, limit = 10 } = req.query;

  const query = {};

  // Search by username or email
  if (search) {
    query.$or = [
      { userName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by role
  if (role && role !== "all") {
    query.role = role;
  }

  // Filter by status
  if (status && status !== "all") {
    query.status = status;
  } else {
    // By default, include all statuses including deleted
    query.status = { $exists: true };
  }

  const options = { includeDeleted: true };
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const users = await User.find(query, null, options)
    .select("-password")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalUsers = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    users,
    totalUsers,
    totalPages: Math.ceil(totalUsers / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// Ban user
export const banUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }

  const user = await User.findById(id).setOptions({ includeDeleted: true });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Prevent banning Super Admin
  if (user.role === "Super Admin") {
    return next(new ErrorHandler("Cannot ban Super Admin.", 403));
  }

  // Admin cannot ban another Admin or Super Admin
  if (
    req.user.role === "Admin" &&
    (user.role === "Admin" || user.role === "Super Admin")
  ) {
    return next(new ErrorHandler("Admins cannot ban other admins.", 403));
  }

  user.status = "banned";
  user.bannedReason = reason || "Violated platform policies";
  await user.save();

  // Send notification to user
  await Notification.create({
    userId: user._id,
    title: "Account Banned",
    message: `Your account has been banned. Reason: ${user.bannedReason}`,
    type: "error",
  });

  res.status(200).json({
    success: true,
    message: "User banned successfully.",
  });
});

// Suspend user
export const suspendUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { reason, days } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }

  const user = await User.findById(id).setOptions({ includeDeleted: true });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Prevent suspending Super Admin
  if (user.role === "Super Admin") {
    return next(new ErrorHandler("Cannot suspend Super Admin.", 403));
  }

  // Admin cannot suspend another Admin or Super Admin
  if (
    req.user.role === "Admin" &&
    (user.role === "Admin" || user.role === "Super Admin")
  ) {
    return next(new ErrorHandler("Admins cannot suspend other admins.", 403));
  }

  const suspendDays = days || 7;
  const suspendUntil = new Date();
  suspendUntil.setDate(suspendUntil.getDate() + parseInt(suspendDays));

  user.status = "suspended";
  user.suspendedReason =
    reason || "Temporary suspension due to policy violation";
  user.suspendedUntil = suspendUntil;
  await user.save();

  // Send notification to user
  await Notification.create({
    userId: user._id,
    title: "Account Suspended",
    message: `Your account has been suspended until ${suspendUntil.toDateString()}. Reason: ${
      user.suspendedReason
    }`,
    type: "warning",
  });

  res.status(200).json({
    success: true,
    message: `User suspended for ${suspendDays} days.`,
  });
});

// Soft delete user
export const softDeleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }

  const user = await User.findById(id).setOptions({ includeDeleted: true });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Prevent deleting Super Admin
  if (user.role === "Super Admin") {
    return next(new ErrorHandler("Cannot delete Super Admin.", 403));
  }

  // Admin cannot delete another Admin or Super Admin
  if (
    req.user.role === "Admin" &&
    (user.role === "Admin" || user.role === "Super Admin")
  ) {
    return next(new ErrorHandler("Admins cannot delete other admins.", 403));
  }

  user.status = "deleted";
  user.deletedAt = new Date();
  user.deletionReason = reason || "Account deleted by administrator";
  await user.save();

  // Send notification to user
  await Notification.create({
    userId: user._id,
    title: "Account Deleted",
    message: `Your account has been deleted. Reason: ${user.deletionReason}. Contact support if you believe this is an error.`,
    type: "error",
  });

  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
  });
});

// Restore user (reactivate)
export const restoreUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }

  const user = await User.findById(id).setOptions({ includeDeleted: true });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  user.status = "active";
  user.deletedAt = null;
  user.deletionReason = null;
  user.bannedReason = null;
  user.suspendedReason = null;
  user.suspendedUntil = null;
  await user.save();

  // Send notification to user
  await Notification.create({
    userId: user._id,
    title: "Account Restored",
    message: "Your account has been restored and is now active.",
    type: "success",
  });

  res.status(200).json({
    success: true,
    message: "User restored successfully.",
  });
});

// Remove admin (Super Admin only)
export const removeAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Check if requester is Super Admin
  if (req.user.role !== "Super Admin") {
    return next(
      new ErrorHandler("Only Super Admin can remove admin accounts.", 403)
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }

  const user = await User.findById(id).setOptions({ includeDeleted: true });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Can only remove Admin role users
  if (user.role !== "Admin") {
    return next(new ErrorHandler("This user is not an admin.", 400));
  }

  // Soft delete the admin
  user.status = "deleted";
  user.deletedAt = new Date();
  user.deletionReason = "Admin role removed by Super Admin";
  await user.save();

  // Send notification to admin
  await Notification.create({
    userId: user._id,
    title: "Admin Role Removed",
    message: "Your admin privileges have been revoked by Super Admin.",
    type: "warning",
  });

  res.status(200).json({
    success: true,
    message: "Admin removed successfully.",
  });
});

// Permanent Delete Functions (Super Admin Only)

// Permanently delete user from database
export const permanentDeleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Only Super Admin can permanently delete
  if (req.user.role !== "Super Admin") {
    return next(
      new ErrorHandler("Only Super Admin can permanently delete data.", 403)
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }

  const user = await User.findById(id).setOptions({ includeDeleted: true });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Cannot permanently delete Super Admin
  if (user.role === "Super Admin") {
    return next(
      new ErrorHandler("Cannot permanently delete Super Admin.", 403)
    );
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User permanently deleted from database.",
  });
});

// Permanently delete auction from database
export const permanentDeleteAuction = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    if (req.user.role !== "Super Admin") {
      return next(
        new ErrorHandler("Only Super Admin can permanently delete data.", 403)
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid ID format.", 400));
    }

    const auction = await Auction.findById(id).setOptions({
      includeDeleted: true,
    });
    if (!auction) {
      return next(new ErrorHandler("Auction not found.", 404));
    }

    await auction.deleteOne();

    res.status(200).json({
      success: true,
      message: "Auction permanently deleted from database.",
    });
  }
);

// Permanently delete payment proof from database
export const permanentDeletePaymentProof = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    if (req.user.role !== "Super Admin") {
      return next(
        new ErrorHandler("Only Super Admin can permanently delete data.", 403)
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid ID format.", 400));
    }

    const proof = await PaymentProof.findById(id).setOptions({
      includeDeleted: true,
    });
    if (!proof) {
      return next(new ErrorHandler("Payment proof not found.", 404));
    }

    await proof.deleteOne();

    res.status(200).json({
      success: true,
      message: "Payment proof permanently deleted from database.",
    });
  }
);

// Get all soft-deleted items (for filtering)
export const getSoftDeletedItems = catchAsyncErrors(async (req, res, next) => {
  const { type } = req.query; // 'users', 'auctions', 'paymentproofs'

  let items;
  switch (type) {
    case "users":
      items = await User.find({ status: "deleted" }).setOptions({
        includeDeleted: true,
      });
      break;
    case "auctions":
      items = await Auction.find({ isDeleted: true }).setOptions({
        includeDeleted: true,
      });
      break;
    case "paymentproofs":
      items = await PaymentProof.find({ isDeleted: true }).setOptions({
        includeDeleted: true,
      });
      break;
    default:
      return next(new ErrorHandler("Invalid type parameter.", 400));
  }

  res.status(200).json({
    success: true,
    items,
  });
});
