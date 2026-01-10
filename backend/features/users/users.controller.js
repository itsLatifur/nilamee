import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { User } from "./users.model.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../../shared/utils/jwt.util.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile Image Required.", 400));
  }

  const { profileImage } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  const { userName, email, password, phone, address, role } = req.body;

  if (!userName || !email || !phone || !password || !address || !role) {
    return next(new ErrorHandler("Please fill full form.", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered.", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    profileImage.tempFilePath,
    {
      folder: "MERN_AUCTION_PLATFORM_USERS",
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary error:",
      cloudinaryResponse.error || "Unknown cloudinary error."
    );
    return next(
      new ErrorHandler("Failed to upload profile image to cloudinary.", 500)
    );
  }
  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  generateToken(user, "User Registered.", 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please fill full form."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  generateToken(user, "Login successfully.", 200, res);
});

export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout Successfully.",
    });
});

export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ moneySpent: { $gt: 0 } });
  const leaderboard = users.sort((a, b) => b.moneySpent - a.moneySpent);
  res.status(200).json({
    success: true,
    leaderboard,
  });
});

export const switchRole = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.body;

  if (!role || (role !== "Auctioneer" && role !== "Bidder")) {
    return next(new ErrorHandler("Invalid role specified.", 400));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Update role in database for persistence
  user.role = role;
  await user.save();

  // Generate new token with updated role
  generateToken(user, `Switched to ${role} mode.`, 200, res);
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { userName, email, phone, address } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Update basic fields if provided
  if (userName) user.userName = userName;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (address) user.address = address;

  // Mark fields as modified to ensure they're saved
  if (userName) user.markModified("userName");
  if (email) user.markModified("email");
  if (phone) user.markModified("phone");
  if (address) user.markModified("address");

  // Handle profile image upload if provided
  if (req.files && req.files.profileImage) {
    const profileImage = req.files.profileImage;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedFormats.includes(profileImage.mimetype)) {
      return next(new ErrorHandler("File format not supported.", 400));
    }

    // Delete old image from cloudinary
    if (user.profileImage && user.profileImage.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }

    // Upload new image
    const cloudinaryResponse = await cloudinary.uploader.upload(
      profileImage.tempFilePath,
      { folder: "MERN_AUCTION_PLATFORM_USERS" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      return next(
        new ErrorHandler("Failed to upload profile image to cloudinary.", 500)
      );
    }

    user.profileImage = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  try {
    // Save user without running validators on unmodified fields
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return next(
      new ErrorHandler(error.message || "Failed to update profile.", 500)
    );
  }
});

export const updatePaymentInfo = catchAsyncErrors(async (req, res, next) => {
  const {
    bankName,
    bankAccountNumber,
    bankAccountName,
    mobileWallet,
    mobileWalletNumber,
    additionalInfo,
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  user.paymentInfo = {
    bankName: bankName || "",
    bankAccountNumber: bankAccountNumber || "",
    bankAccountName: bankAccountName || "",
    mobileWallet: mobileWallet || "",
    mobileWalletNumber: mobileWalletNumber || "",
    additionalInfo: additionalInfo || "",
    lastUpdated: new Date(),
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Payment information updated successfully.",
    paymentInfo: user.paymentInfo,
  });
});

export const getPaymentInfo = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({
    success: true,
    paymentInfo: user.paymentInfo || {},
  });
});

export const resetPaymentInfo = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  user.paymentInfo = {
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
    mobileWallet: "",
    mobileWalletNumber: "",
    additionalInfo: "",
    lastUpdated: new Date(),
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Payment information reset successfully.",
  });
});
