import { Auction } from "./auctions.model.js";
import { User } from "../users/users.model.js";
import { Bid } from "../bids/bids.model.js";
import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const addNewAuctionItem = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(
      new ErrorHandler("At least one auction item image required.", 400)
    );
  }

  // Handle multiple images
  const images = req.files.images;
  const imageArray = Array.isArray(images) ? images : [images];

  // Validate max 6 images
  if (imageArray.length > 6) {
    return next(new ErrorHandler("You can upload maximum 6 images.", 400));
  }

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  for (const img of imageArray) {
    if (!allowedFormats.includes(img.mimetype)) {
      return next(
        new ErrorHandler(
          "File format not supported. Use PNG, JPEG, or WEBP.",
          400
        )
      );
    }
  }

  const {
    title,
    description,
    category,
    condition,
    startingBid,
    startTime,
    endTime,
    location,
    address,
    authenticity,
    customFields,
  } = req.body;

  if (
    !title ||
    !description ||
    !category ||
    !condition ||
    !startingBid ||
    !startTime ||
    !endTime
  ) {
    return next(new ErrorHandler("Please provide all required details.", 400));
  }

  // Parse customFields if it's a string
  let parsedCustomFields = [];
  if (customFields) {
    try {
      parsedCustomFields =
        typeof customFields === "string"
          ? JSON.parse(customFields)
          : customFields;

      if (parsedCustomFields.length > 10) {
        return next(new ErrorHandler("Maximum 10 custom fields allowed.", 400));
      }
    } catch (error) {
      return next(new ErrorHandler("Invalid custom fields format.", 400));
    }
  }

  if (new Date(startTime) < Date.now()) {
    return next(
      new ErrorHandler(
        "Auction starting time must be greater than present time.",
        400
      )
    );
  }
  if (new Date(startTime) >= new Date(endTime)) {
    return next(
      new ErrorHandler(
        "Auction starting time must be less than ending time.",
        400
      )
    );
  }

  try {
    // Upload all images to cloudinary
    const uploadedImages = [];
    for (const img of imageArray) {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        img.tempFilePath,
        {
          folder: "MERN_AUCTION_PLATFORM_AUCTIONS",
        }
      );
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
          "Cloudinary error:",
          cloudinaryResponse.error || "Unknown cloudinary error."
        );
        return next(
          new ErrorHandler("Failed to upload auction image to cloudinary.", 500)
        );
      }
      uploadedImages.push({
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      });
    }

    const auctionItem = await Auction.create({
      title,
      description,
      category,
      condition,
      startingBid,
      startTime,
      endTime,
      images: uploadedImages,
      location: location || "",
      address: address || "",
      authenticity: authenticity || "",
      customFields: parsedCustomFields,
      createdBy: req.user._id,
    });
    return res.status(201).json({
      success: true,
      message: `Auction item created successfully. It will be listed after admin approval.`,
      auctionItem,
    });
  } catch (error) {
    return next(
      new ErrorHandler(error.message || "Failed to created auction.", 500)
    );
  }
});

export const getAllItems = catchAsyncErrors(async (req, res, next) => {
  // Only show approved auctions that are not soft-deleted
  let items = await Auction.find({
    approvalStatus: "approved",
    isDeleted: false,
  });
  res.status(200).json({
    success: true,
    items,
  });
});

export const getAuctionDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }
  const bidders = auctionItem.bids.sort((a, b) => b.amount - a.amount);
  res.status(200).json({
    success: true,
    auctionItem,
    bidders,
  });
});

export const getMyAuctionItems = catchAsyncErrors(async (req, res, next) => {
  // Show all user's auctions including soft-deleted ones
  const items = await Auction.find({ createdBy: req.user._id });
  res.status(200).json({
    success: true,
    items,
  });
});

export const removeFromAuction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const auctionItem = await Auction.findById(id).setOptions({
    includeDeleted: true,
  });
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }

  // Soft delete
  auctionItem.isDeleted = true;
  auctionItem.deletedAt = new Date();
  auctionItem.deletedBy = req.user._id;
  auctionItem.deletionReason = "Deleted by auctioneer";
  await auctionItem.save();

  res.status(200).json({
    success: true,
    message: "Auction item deleted successfully.",
  });
});

export const republishItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  let auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }
  if (!req.body.startTime || !req.body.endTime) {
    return next(
      new ErrorHandler("Starttime and Endtime for republish is mandatory.")
    );
  }
  if (new Date(auctionItem.endTime) > Date.now()) {
    return next(
      new ErrorHandler("Auction is already active, cannot republish", 400)
    );
  }
  let data = {
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
  };
  if (data.startTime < Date.now()) {
    return next(
      new ErrorHandler(
        "Auction starting time must be greater than present time",
        400
      )
    );
  }
  if (data.startTime >= data.endTime) {
    return next(
      new ErrorHandler(
        "Auction starting time must be less than ending time.",
        400
      )
    );
  }

  if (auctionItem.highestBidder) {
    const highestBidder = await User.findById(auctionItem.highestBidder);
    highestBidder.moneySpent -= auctionItem.currentBid;
    highestBidder.auctionsWon -= 1;
    highestBidder.save();
  }

  data.bids = [];
  data.commissionCalculated = false;
  data.currentBid = 0;
  data.highestBidder = null;
  auctionItem = await Auction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  await Bid.deleteMany({ auctionItem: auctionItem._id });
  const createdBy = await User.findByIdAndUpdate(
    req.user._id,
    { unpaidCommission: 0 },
    {
      new: true,
      runValidators: false,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    auctionItem,
    message: `Auction republished and will be active on ${req.body.startTime}`,
    createdBy,
  });
});
