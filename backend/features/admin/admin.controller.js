import mongoose from "mongoose";
import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { Commission } from "../commissions/commissions.model.js";
import { User } from "../users/users.model.js";
import { Auction } from "../auctions/auctions.model.js";
import { PaymentProof } from "../commissions/proof.model.js";
import { Notification } from "../../models/notificationSchema.js";
import { Role } from "./admin.model.js";
import { AdminActivityLog } from "./activityLog.model.js";
import bcrypt from "bcrypt";

// Helper function to log admin activities
const logActivity = async ({
  action,
  performedBy,
  performedByName,
  performedByRole,
  targetUser = null,
  targetUserName = null,
  targetResource = null,
  changes = {},
  reason = null,
  ipAddress = null,
}) => {
  try {
    await AdminActivityLog.create({
      action,
      performedBy,
      performedByName,
      performedByRole,
      targetUser,
      targetUserName,
      targetResource,
      changes,
      reason,
      ipAddress,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

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

  // Log activity
  await logActivity({
    action: "APPROVE_AUCTION",
    performedBy: req.user._id,
    performedByName: req.user.userName,
    performedByRole: req.user.role,
    targetResource: {
      resourceType: "Auction",
      resourceId: auction._id,
      resourceName: auction.title,
    },
    ipAddress: req.ip,
  });

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

  // Log activity
  await logActivity({
    action: "REJECT_AUCTION",
    performedBy: req.user._id,
    performedByName: req.user.userName,
    performedByRole: req.user.role,
    targetResource: {
      resourceType: "Auction",
      resourceId: auction._id,
      resourceName: auction.title,
    },
    reason: auction.rejectionReason,
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: "Auction rejected.",
    auction,
  });
});

// User Management Functions

// Create Admin (Super Admin and Admin can create admins)
export const createAdmin = catchAsyncErrors(async (req, res, next) => {
  const { userName, email, password, phone, address, role } = req.body;

  // Check if requester is Super Admin or Admin
  if (req.user.role !== "Super Admin" && req.user.role !== "Admin") {
    return next(
      new ErrorHandler(
        "Only Super Admin or Admin can create admin accounts.",
        403
      )
    );
  }

  // Validate role assignment based on requester permissions
  if (req.user.role === "Admin") {
    // Admin can only create Admin role or custom roles
    if (role === "Super Admin") {
      return next(
        new ErrorHandler("Admins cannot create Super Admin accounts.", 403)
      );
    }
    if (["Bidder", "Auctioneer"].includes(role)) {
      return next(
        new ErrorHandler("Cannot create Bidder or Auctioneer accounts.", 400)
      );
    }
  } else if (req.user.role === "Super Admin") {
    // Super Admin can create any admin role except Bidder/Auctioneer
    if (["Bidder", "Auctioneer"].includes(role)) {
      return next(
        new ErrorHandler("Cannot create Bidder or Auctioneer accounts.", 400)
      );
    }
  }

  // Validate role exists (either system role or custom role)
  const systemRoles = ["Super Admin", "Admin", "Bidder", "Auctioneer"];
  const assignedRole = role || "Admin"; // Default to Admin if no role specified

  if (!systemRoles.includes(assignedRole)) {
    const customRole = await Role.findOne({ name: assignedRole });
    if (!customRole) {
      return next(new ErrorHandler("Invalid role. Role does not exist.", 400));
    }
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
    role: assignedRole,
    // profileImage will use default values from schema
  });

  // Log activity
  await logActivity({
    action: "CREATE_ADMIN",
    performedBy: req.user._id,
    performedByName: req.user.userName,
    performedByRole: req.user.role,
    targetUser: admin._id,
    targetUserName: admin.userName,
    changes: {
      role: assignedRole,
      email: admin.email,
    },
    ipAddress: req.ip,
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
    if (role === "admin-only") {
      // Only return admin-level roles (exclude Bidder and Auctioneer)
      query.role = { $nin: ["Bidder", "Auctioneer"] };
    } else {
      query.role = role;
    }
  }

  // Filter by status
  if (status && status !== "all") {
    query.status = status;
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

  // Log activity
  await logActivity({
    action: "BAN_USER",
    performedBy: req.user._id,
    performedByName: req.user.userName,
    performedByRole: req.user.role,
    targetUser: user._id,
    targetUserName: user.userName,
    reason: user.bannedReason,
    ipAddress: req.ip,
  });

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

  // Log activity
  await logActivity({
    action: "SUSPEND_USER",
    performedBy: req.user._id,
    performedByName: req.user.userName,
    performedByRole: req.user.role,
    targetUser: user._id,
    targetUserName: user.userName,
    changes: {
      suspendedUntil: suspendUntil,
      days: suspendDays,
    },
    reason: user.suspendedReason,
    ipAddress: req.ip,
  });

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

  // Log activity
  await logActivity({
    action: "DELETE_USER",
    performedBy: req.user._id,
    performedByName: req.user.userName,
    performedByRole: req.user.role,
    targetUser: user._id,
    targetUserName: user.userName,
    reason: user.deletionReason,
    ipAddress: req.ip,
  });

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

  // Cannot remove yourself
  if (user._id.toString() === req.user._id.toString()) {
    return next(new ErrorHandler("You cannot remove your own account.", 400));
  }

  // Cannot remove Bidders or Auctioneers (they're not admin users)
  if (user.role === "Bidder" || user.role === "Auctioneer") {
    return next(new ErrorHandler("This user is not an admin.", 400));
  }

  // Soft delete the admin
  user.status = "deleted";
  user.deletedAt = new Date();
  user.deletionReason = "Admin role removed by Super Admin";
  await user.save();

  // Log activity
  await logActivity({
    action: "REMOVE_ADMIN",
    performedBy: req.user._id,
    performedByName: req.user.userName,
    performedByRole: req.user.role,
    targetUser: user._id,
    targetUserName: user.userName,
    changes: {
      previousRole: user.role,
      status: "deleted",
    },
    reason: "Admin role removed by Super Admin",
    ipAddress: req.ip,
  });

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

// Role Management Functions
export const getAllRoles = catchAsyncErrors(async (req, res, next) => {
  // System roles
  const systemRoles = [
    {
      name: "Super Admin",
      isSystemRole: true,
      permissions: {
        canManageAuctions: true,
        canManageUsers: true,
        canManagePayments: true,
        canViewReports: true,
        canManageRoles: true,
        canApproveSuspensions: true,
        canDeleteContent: true,
      },
    },
    {
      name: "Admin",
      isSystemRole: true,
      permissions: {
        canManageAuctions: true,
        canManageUsers: true,
        canManagePayments: true,
        canViewReports: true,
        canManageRoles: false,
        canApproveSuspensions: true,
        canDeleteContent: false,
      },
    },
  ];

  // Fetch custom roles from database
  const customRoles = await Role.find();

  // Combine system and custom roles
  const allRoles = [...systemRoles, ...customRoles];

  res.status(200).json({
    success: true,
    roles: allRoles,
  });
});

export const createRole = catchAsyncErrors(async (req, res, next) => {
  const { name, description, permissions } = req.body;

  if (!name || !permissions) {
    return next(
      new ErrorHandler("Role name and permissions are required.", 400)
    );
  }

  // Only Super Admin can create roles
  if (req.user.role !== "Super Admin") {
    return next(
      new ErrorHandler("Only Super Admin can create custom roles.", 403)
    );
  }

  // Prevent creating system role names
  if (["Super Admin", "Admin", "Bidder", "Auctioneer"].includes(name)) {
    return next(new ErrorHandler("Cannot create system role.", 400));
  }

  // Check if role already exists
  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    return next(new ErrorHandler("Role with this name already exists.", 400));
  }

  // Create new role
  const role = await Role.create({
    name,
    description,
    permissions,
    createdBy: req.user._id,
  });

  // Log activity
  await logActivity({
    action: "CREATE_ROLE",
    performedBy: req.user._id,
    performedByName: req.user.userName,
    performedByRole: req.user.role,
    targetResource: {
      resourceType: "Role",
      resourceId: role._id,
      resourceName: role.name,
    },
    changes: {
      permissions,
    },
    ipAddress: req.ip,
  });

  res.status(201).json({
    success: true,
    message: "Role created successfully.",
    role,
  });
});

export const deleteRole = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Only Super Admin can delete roles
  if (req.user.role !== "Super Admin") {
    return next(
      new ErrorHandler("Only Super Admin can delete custom roles.", 403)
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid role ID.", 400));
  }

  const role = await Role.findById(id);
  if (!role) {
    return next(new ErrorHandler("Role not found.", 404));
  }

  // Check if any users have this role
  const usersWithRole = await User.countDocuments({ role: role.name });
  if (usersWithRole > 0) {
    return next(
      new ErrorHandler(
        `Cannot delete role. ${usersWithRole} user(s) are assigned this role.`,
        400
      )
    );
  }

  await Role.findByIdAndDelete(id);

  // Log activity
  await logActivity({
    action: "DELETE_ROLE",
    performedBy: req.user._id,
    performedByName: req.user.userName,
    performedByRole: req.user.role,
    targetResource: {
      resourceType: "Role",
      resourceId: role._id,
      resourceName: role.name,
    },
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: "Role deleted successfully.",
  });
});

export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!role) {
    return next(new ErrorHandler("Role is required.", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ErrorHandler("Invalid user ID.", 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Prevent changing system user roles (Bidder, Auctioneer)
  if (["Bidder", "Auctioneer"].includes(user.role)) {
    return next(
      new ErrorHandler("Cannot change role of Bidders or Auctioneers.", 400)
    );
  }

  // Check permissions based on requester role
  if (req.user.role === "Admin") {
    // Admin can only assign Admin role or custom roles
    if (role === "Super Admin") {
      return next(
        new ErrorHandler("Admins cannot assign Super Admin role.", 403)
      );
    }
  } else if (req.user.role !== "Super Admin") {
    return next(
      new ErrorHandler("Only Admin or Super Admin can update user roles.", 403)
    );
  }

  // Validate role exists (either system role or custom role)
  const systemRoles = ["Super Admin", "Admin", "Bidder", "Auctioneer"];
  if (!systemRoles.includes(role)) {
    const customRole = await Role.findOne({ name: role });
    if (!customRole) {
      return next(new ErrorHandler("Invalid role. Role does not exist.", 400));
    }
  }

  const previousRole = user.role;
  user.role = role;
  await user.save();

  // Log activity
  await logActivity({
    action: "UPDATE_USER_ROLE",
    performedBy: req.user._id,
    performedByName: req.user.userName,
    performedByRole: req.user.role,
    targetUser: user._id,
    targetUserName: user.userName,
    changes: {
      previousRole,
      newRole: role,
    },
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: "User role updated successfully.",
    user: {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
  });
});

// Get Activity Logs (Super Admin Only)
export const getActivityLogs = catchAsyncErrors(async (req, res, next) => {
  // Only Super Admin can view activity logs
  if (req.user.role !== "Super Admin") {
    return next(
      new ErrorHandler("Only Super Admin can view activity logs.", 403)
    );
  }

  const {
    page = 1,
    limit = 50,
    action,
    performedBy,
    startDate,
    endDate,
  } = req.query;

  const query = {};

  // Filter by action type
  if (action) {
    query.action = action;
  }

  // Filter by performer
  if (performedBy) {
    query.performedBy = performedBy;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const logs = await AdminActivityLog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("performedBy", "userName email role")
    .populate("targetUser", "userName email role");

  const totalLogs = await AdminActivityLog.countDocuments(query);

  res.status(200).json({
    success: true,
    logs,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalLogs / parseInt(limit)),
      totalLogs,
      logsPerPage: parseInt(limit),
    },
  });
});
