import ErrorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { generateToken } from "../utils/jwttoken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Image missing.", 400));
  }

  const { profileImage, nidImageFront, nidImageBack } = req.files;

  if (!profileImage) {
    return next(new ErrorHandler("Profile image is required.", 400));
  }
  if (!nidImageFront) {
    return next(new ErrorHandler("NID image front is required.", 400));
  }
  if (!nidImageBack) {
    return next(new ErrorHandler("NID image back is required.", 400));
  }

  const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(
      new ErrorHandler("Profile image format is not supported.", 400)
    );
  }

  if (!allowedFormats.includes(nidImageFront.mimetype)) {
    return next(
      new ErrorHandler("NID image front format is not supported.", 400)
    );
  }

  if (!allowedFormats.includes(nidImageBack.mimetype)) {
    return next(
      new ErrorHandler("NID image back format is not supported.", 400)
    );
  }

  const {
    username,
    phone,
    email,
    password,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    bkashNumber,
    nogodNumber,
    rocketNumber,
  } = req.body;

  if (!username || !phone || !email || !password || !address || !role) {
    return next(new ErrorHandler("Please fill all required fields.", 400));
  }

  const roleLower = role.toLowerCase();

  if (roleLower === "buyer" || roleLower === "seller") {
    const hasBankDetails = bankAccountNumber && bankAccountName && bankName;
    const hasBkash = bkashNumber;
    const hasNogod = nogodNumber;
    const hasRocket = rocketNumber;

    if (!hasBankDetails && !hasBkash && !hasNogod && !hasRocket) {
      return next(
        new ErrorHandler(
          "Please provide at least one payment method (bank transfer, bKash, Nogod, or Rocket).",
          400
        )
      );
    }
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered.", 400));
  }

  const profileImageResponse = await cloudinary.uploader.upload(
    profileImage.tempFilePath,
    {
      folder: "nilamee_profileImages",
      width: 150,
      crop: "scale",
    }
  );

  if (!profileImageResponse || profileImageResponse.error) {
    console.error(
      "Cloudinary error:",
      profileImageResponse.error || "Unknown cloudinary error."
    );
    return next(new ErrorHandler("Profile image upload failed.", 500));
  }

  const nidFrontResponse = await cloudinary.uploader.upload(
    nidImageFront.tempFilePath,
    {
      folder: "nilamee_nidImages",
      width: 1500,
    }
  );

  if (!nidFrontResponse || nidFrontResponse.error) {
    console.error(
      "Cloudinary error:",
      nidFrontResponse.error || "Unknown cloudinary error."
    );
    return next(new ErrorHandler("NID front image upload failed.", 500));
  }

  const nidBackResponse = await cloudinary.uploader.upload(
    nidImageBack.tempFilePath,
    {
      folder: "nilamee_nidImages",
      width: 1500,
    }
  );

  if (!nidBackResponse || nidBackResponse.error) {
    console.error(
      "Cloudinary error:",
      nidBackResponse.error || "Unknown cloudinary error."
    );
    return next(new ErrorHandler("NID back image upload failed.", 500));
  }

  const user = await User.create({
    username,
    phone,
    email,
    password,
    address,
    role,
    profileImage: {
      public_id: profileImageResponse.public_id,
      url: profileImageResponse.secure_url,
    },
    nidImageFront: {
      public_id: nidFrontResponse.public_id,
      url: nidFrontResponse.secure_url,
    },
    nidImageBack: {
      public_id: nidBackResponse.public_id,
      url: nidBackResponse.secure_url,
    },
    paymentMethodes: {
      bankTransfer: {
        bankAccountNumber,
        bankAccountName,
        bankName,
      },
      bkash: {
        bkashNumber,
      },
      nogod: {
        nogodNumber,
      },
      rocket: {
        rocketNumber,
      },
    },
  });
  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    user,
  });
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password.", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  generateToken(user, "Login successful.", 200, res);
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
      message: "Logged out successfully.",
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
