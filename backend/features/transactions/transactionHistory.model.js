import mongoose from "mongoose";

const transactionHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },

  role: {
    type: String,
    enum: ["Auctioneer", "Bidder"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  trustPointsEarned: {
    type: Number,
    default: 0,
  },

  completedAt: {
    type: Date,
    default: Date.now,
  },

  deliveryTimeHours: {
    type: Number,
    default: null, // For sellers only
  },

  paymentTimeHours: {
    type: Number,
    default: null, // For buyers only
  },

  outcome: {
    type: String,
    enum: ["Success", "Disputed", "Failed"],
    default: "Success",
  },

  // Denormalized auction title for quick display
  auctionTitle: {
    type: String,
    required: true,
  },
});

// Indexes for efficient queries
transactionHistorySchema.index({ userId: 1, completedAt: -1 });
transactionHistorySchema.index({ auctionId: 1 });

export const TransactionHistory = mongoose.model(
  "TransactionHistory",
  transactionHistorySchema
);
