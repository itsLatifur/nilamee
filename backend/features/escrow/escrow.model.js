import mongoose from "mongoose";

const escrowSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
    unique: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  commissionAmount: {
    type: Number,
    required: true,
  },
  sellerAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Held", "Released", "Refunded", "Shipped", "Received"],
    default: "Pending",
  },
  transactionId: {
    type: String,
    required: true,
  },
  releasedAt: {
    type: Date,
    default: null,
  },
  refundedAt: {
    type: Date,
    default: null,
  },
  shippedAt: {
    type: Date,
    default: null,
  },
  receivedAt: {
    type: Date,
    default: null,
  },
  // Payout information recorded when admin approves the payout
  payoutInfo: {
    method: String,
    account: String,
    name: String,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  processedAt: {
    type: Date,
    default: null,
  },
  // If admin has placed a manual hold, automatic release/payout should be blocked
  adminHold: {
    type: Boolean,
    default: false,
  },
  // Admin notes for audits and investigations
  adminNotes: [
    {
      note: { type: String },
      addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      addedByName: { type: String, default: null },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  shippingAddress: {
    type: String,
    default: null,
  },
});

export const Escrow = mongoose.model("Escrow", escrowSchema);
