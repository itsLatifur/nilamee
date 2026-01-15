import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },

  auctioneerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  bidderUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  feedbackText: {
    type: String,
    required: [true, "Feedback text is required"],
    maxlength: [500, "Feedback cannot exceed 500 characters"],
    minlength: [10, "Feedback must be at least 10 characters"],
  },

  // Denormalized fields for faster display without populating
  auctionTitle: {
    type: String,
    required: true,
  },

  auctionAmount: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient queries
feedbackSchema.index({ auctioneerUserId: 1, createdAt: -1 });
feedbackSchema.index({ auctionId: 1 }, { unique: true });
feedbackSchema.index({ bidderUserId: 1, createdAt: -1 });

export const Feedback = mongoose.model("Feedback", feedbackSchema);
