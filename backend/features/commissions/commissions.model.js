import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
  amount: Number,
  user: mongoose.Schema.Types.ObjectId,
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

// Query middleware to exclude soft-deleted commissions by default
commissionSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export const Commission = mongoose.model("Commission", commissionSchema);
