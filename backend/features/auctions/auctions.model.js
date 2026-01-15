import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  startingBid: Number,
  category: String,
  condition: {
    type: String,
    enum: ["New", "Used"],
  },
  currentBid: { type: Number, default: 0 },
  startTime: String,
  endTime: String,
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  // Item Details (optional fields for flexibility)
  location: String,
  address: String,
  authenticity: {
    type: String,
    enum: ["Verified", "Warranty", "Certificate", "Unverified", ""],
  },
  // Custom fields - up to 10 dynamic fields
  customFields: [
    {
      label: String,
      value: String,
    },
  ],
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bids: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
      userName: String,
      profileImage: String,
      amount: Number,
    },
  ],
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  commissionCalculated: {
    type: Boolean,
    default: false,
  },
  // Payment tracking fields
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Pending", "Paid", "Failed"],
    default: "Unpaid",
  },
  paymentDeadline: {
    type: Date,
    default: null,
  },
  paidAt: {
    type: Date,
    default: null,
  },
  transactionId: {
    type: String,
    default: null,
  },
  // Delivery tracking fields
  deliveryStatus: {
    type: String,
    enum: ["Not Shipped", "Shipped", "Delivered"],
    default: "Not Shipped",
  },
  shippedAt: {
    type: Date,
    default: null,
  },
  deliveredAt: {
    type: Date,
    default: null,
  },
  trackingNumber: {
    type: String,
    default: null,
  },
  // Overall status for easy tracking
  overallStatus: {
    type: String,
    enum: [
      "Pending Approval",
      "Live",
      "Ended - Awaiting Payment",
      "Paid - Awaiting Shipment",
      "Shipped - In Transit",
      "Completed",
      "Cancelled",
    ],
    default: "Pending Approval",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  deletionReason: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Auction = mongoose.model("Auction", auctionSchema);
