import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    minLength: [3, "Username must caontain at least 3 characters."],
    maxLength: [40, "Username cannot exceed 40 characters."],
  },
  password: {
    type: String,
    selected: false,
    minLength: [8, "Password must caontain at least 8 characters."],
  },
  email: String,
  address: String,
  phone: {
    type: String,
    minLength: [11, "Phone Number must caontain exact 11 digits."],
    maxLength: [11, "Phone Number must caontain exact 11 digits."],
  },
  profileImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  paymentMethods: {
    bankTransfer: {
      bankAccountNumber: String,
      bankAccountName: String,
      bankName: String,
    },
    easypaisa: {
      easypaisaAccountNumber: Number,
    },
    paypal: {
      paypalEmail: String,
    },
  },
  role: {
    type: String,
    enum: ["Auctioneer", "Bidder", "Super Admin", "Admin"],
  },
  status: {
    type: String,
    enum: ["active", "banned", "suspended", "deleted"],
    default: "active",
  },
  unpaidCommission: {
    type: Number,
    default: 0,
  },
  auctionsWon: {
    type: Number,
    default: 0,
  },
  moneySpent: {
    type: Number,
    default: 0,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  deletionReason: {
    type: String,
    default: null,
  },
  bannedReason: {
    type: String,
    default: null,
  },
  suspendedReason: {
    type: String,
    default: null,
  },
  suspendedUntil: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // TRUST & RATING SYSTEM FIELDS
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
  },

  totalTransactionVolume: {
    type: Number,
    default: 0,
    comment: "Sum of all completed auction amounts (BDT)",
  },

  completedAuctionsCount: {
    type: Number,
    default: 0,
  },

  badgeTier: {
    type: String,
    enum: [
      "Bronze-I",
      "Bronze-II",
      "Bronze-III",
      "Silver-I",
      "Silver-II",
      "Silver-III",
      "Gold-I",
      "Gold-II",
      "Gold-III",
      "Platinum-I",
      "Platinum-II",
      "Platinum-III",
      "Diamond-I",
      "Diamond-II",
      "Diamond-III",
      "Royal",
    ],
    default: "Bronze-I",
  },

  isVerifiedSeller: {
    type: Boolean,
    default: false,
  },

  isVerifiedBuyer: {
    type: Boolean,
    default: false,
  },

  starRating: {
    type: Number,
    default: 1,
    min: 1,
    max: 5,
  },

  isPremium: {
    type: Boolean,
    default: false,
  },

  premiumExpiresAt: {
    type: Date,
    default: null,
  },

  firstSuccessfulAuctionDate: {
    type: Date,
    default: null,
  },

  lastActivityDate: {
    type: Date,
    default: null,
  },

  stats: {
    totalAuctionsCreated: { type: Number, default: 0 },
    totalAuctionsWon: { type: Number, default: 0 },
    totalAuctionsCompleted: { type: Number, default: 0 },
    disputesRaised: { type: Number, default: 0 },
    disputesLost: { type: Number, default: 0 },
    averageDeliveryTime: { type: Number, default: 0 }, // in hours
    averagePaymentTime: { type: Number, default: 0 }, // in hours
  },
});

// Query middleware to exclude soft-deleted users
userSchema.pre(/^find/, function (next) {
  // Don't exclude deleted users if explicitly querying for them
  if (!this.getOptions().includeDeleted) {
    this.where({ status: { $ne: "deleted" } });
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
