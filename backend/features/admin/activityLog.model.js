import mongoose from "mongoose";

const adminActivityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "CREATE_ADMIN",
        "UPDATE_USER_ROLE",
        "REMOVE_ADMIN",
        "BAN_USER",
        "SUSPEND_USER",
        "DELETE_USER",
        "RESTORE_USER",
        "PERMANENT_DELETE_USER",
        "APPROVE_AUCTION",
        "REJECT_AUCTION",
        "DELETE_AUCTION",
        "PERMANENT_DELETE_AUCTION",
        "UPDATE_PAYMENT_PROOF",
        "DELETE_PAYMENT_PROOF",
        "PERMANENT_DELETE_PAYMENT_PROOF",
        "CREATE_ROLE",
        "DELETE_ROLE",
      ],
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performedByName: {
      type: String,
      required: true,
    },
    performedByRole: {
      type: String,
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    targetUserName: {
      type: String,
    },
    targetResource: {
      resourceType: {
        type: String,
        enum: ["User", "Auction", "PaymentProof", "Role"],
      },
      resourceId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      resourceName: {
        type: String,
      },
    },
    changes: {
      type: Object,
      default: {},
    },
    reason: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for faster queries
adminActivityLogSchema.index({ performedBy: 1, createdAt: -1 });
adminActivityLogSchema.index({ targetUser: 1, createdAt: -1 });
adminActivityLogSchema.index({ action: 1, createdAt: -1 });

export const AdminActivityLog = mongoose.model(
  "AdminActivityLog",
  adminActivityLogSchema
);
