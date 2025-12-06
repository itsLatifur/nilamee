import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: [3, "Username must be at least 3 characters long"],
    maxLength: [40, "Username cannot exceed 40 characters"],
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    select: false,
    required: [true, "Password is required"],
    minLength: [6, "Password must be at least 6 characters long"],
    maxLength: [100, "Password cannot exceed 100 characters"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"],
  },
  email: {
    type: String,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
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
  nidImageFront: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  nidImageBack: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  paymentMethodes: {
    bankTransfer: {
      bankAccountNumber: String,
      bankAccountName: String,
      bankName: String,
    },
    bkash: {
      bkashNumber: String,
    },
    nogod: {
      nogodNumber: String,
    },
    rocket: {
      rocketNumber: String,
    },
  },
  role: {
    type: String,
    enum: [
      "Buyer",
      "Seller",
      "Account handler",
      "User handler",
      "Payment handler",
      "Admin",
    ],
  },
  unpaidCommission: {
    type: Number,
    default: 0,
  },
  auctionWon: {
    type: Number,
    default: 0,
  },
  moneySpent: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
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

export const User = mongoose.model("User", userSchema);
