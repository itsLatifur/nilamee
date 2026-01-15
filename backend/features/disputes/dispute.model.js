import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["Not Received", "Damaged", "Not As Described", "Other"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "Under Review", "Resolved"],
    default: "Open",
  },
  resolution: {
    type: String,
    default: null,
  },
  action: {
    type: String,
    enum: ["Pending", "Refund", "Release", "Partial Refund"],
    default: "Pending",
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
});

export const Dispute = mongoose.model("Dispute", disputeSchema);
