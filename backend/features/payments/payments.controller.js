import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { User } from "../users/users.model.js";
import { PaymentProof } from "../commissions/proof.model.js";
import { Auction } from "../auctions/auctions.model.js";
import { Escrow } from "../escrow/escrow.model.js";
import { incrementMetric } from "../public/metrics.model.js";
import { TransactionHistory } from "../transactions/transactionHistory.model.js";
import SSLCommerzPayment from "sslcommerz-lts";
import { sendEmail } from "../../utils/sendEmail.js";
import {
  calculateBadgeTier,
  calculateStarRating,
  calculateTrustPoints,
} from "../../shared/utils/trustScoreUtils.js";

// Initialize SSLCommerz payment
export const initCommissionPayment = catchAsyncErrors(
  async (req, res, next) => {
    // Manual commission payments have been deprecated.
    // The platform now handles commission collection automatically.
    return res.status(410).json({
      success: false,
      message:
        "Manual commission payments are disabled. The platform handles commissions automatically.",
    });
  },
);

// Payment success callback
export const paymentSuccess = catchAsyncErrors(async (req, res, next) => {
  // Deprecated: manual commission payment callbacks are no longer processed.
  return res.redirect(`${process.env.FRONTEND_URL}/payment-deprecated`);
});

// Payment failure callback
export const paymentFail = catchAsyncErrors(async (req, res, next) => {
  // Deprecated
  return res.redirect(`${process.env.FRONTEND_URL}/payment-deprecated`);
});

// Payment cancellation callback
export const paymentCancel = catchAsyncErrors(async (req, res, next) => {
  // Deprecated
  return res.redirect(`${process.env.FRONTEND_URL}/payment-deprecated`);
});

// IPN (Instant Payment Notification) - for webhook
export const paymentIPN = catchAsyncErrors(async (req, res, next) => {
  // Manual commission IPN processing is deprecated. Do not modify user unpaid balances.
  res.status(200).send("Commission IPN deprecated");
});

// Validate payment transaction
export const validatePayment = catchAsyncErrors(async (req, res, next) => {
  const { transactionId } = req.params;
  // Validation for manual commission payments is deprecated.
  return res.status(410).json({
    success: false,
    message:
      "Commission payment validation is deprecated. Commissions are handled automatically by the platform.",
  });
});

// ==================== AUCTION PAYMENT CONTROLLERS ====================

// Initialize auction payment (winner pays for auction item)
export const initAuctionPayment = catchAsyncErrors(async (req, res, next) => {
  const { auctionId } = req.params;
  const user = await User.findById(req.user._id);
  const { shippingAddress } = req.body || {};
  const auction = await Auction.findById(auctionId).populate("createdBy");

  if (!auction) {
    return next(new ErrorHandler("Auction not found.", 404));
  }

  // Verify user is the winner
  if (
    !auction.highestBidder ||
    auction.highestBidder.toString() !== user._id.toString()
  ) {
    return next(
      new ErrorHandler("You are not the winner of this auction.", 403),
    );
  }

  // Check if already paid
  if (auction.paymentStatus === "Paid") {
    return next(new ErrorHandler("This auction has already been paid.", 400));
  }

  // Check payment deadline
  if (auction.paymentDeadline && new Date() > auction.paymentDeadline) {
    return next(new ErrorHandler("Payment deadline has passed.", 400));
  }

  // Read SSLCommerz config inside function (after dotenv loads)
  const store_id = process.env.SSLCOMMERZ_STORE_ID;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";

  const amount = auction.currentBid;
  const transactionId = `AUCTION_${auction._id}_${Date.now()}`;

  const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const paymentData = {
    total_amount: amount,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${process.env.BACKEND_URL}/api/v1/payment/auction/success`,
    fail_url: `${process.env.BACKEND_URL}/api/v1/payment/auction/fail`,
    cancel_url: `${process.env.BACKEND_URL}/api/v1/payment/auction/cancel`,
    ipn_url: `${process.env.BACKEND_URL}/api/v1/payment/auction/ipn`,
    product_name: auction.title,
    product_category: auction.category || "Auction Item",
    product_profile: "physical-goods",
    cus_name: user.userName,
    cus_email: user.email,
    cus_add1: user.address || "N/A",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: user.phone || "N/A",
    shipping_method: "YES",
    value_a: user._id.toString(), // Buyer ID
    value_b: auction._id.toString(), // Auction ID
    value_c: auction.createdBy._id.toString(), // Seller ID
  };

  try {
    // Persist shipping address provided at checkout (if any) to buyer profile
    if (shippingAddress && shippingAddress.trim().length > 0) {
      try {
        user.address = shippingAddress.trim();
        await user.save();
      } catch (err) {
        console.error("Failed to save shipping address to user profile:", err);
      }
    }
    const apiResponse = await sslcommerz.init(paymentData);

    if (apiResponse.status === "SUCCESS") {
      // Update auction payment status to pending
      auction.paymentStatus = "Pending";
      auction.transactionId = transactionId;
      await auction.save();

      res.status(200).json({
        success: true,
        gatewayUrl: apiResponse.GatewayPageURL,
        transactionId,
      });
    } else {
      return next(
        new ErrorHandler("Failed to initialize payment gateway.", 500),
      );
    }
  } catch (error) {
    return next(
      new ErrorHandler(error.message || "Payment initialization failed.", 500),
    );
  }
});

// Auction payment success callback
export const auctionPaymentSuccess = catchAsyncErrors(
  async (req, res, next) => {
    const { tran_id, amount, value_a, value_b, value_c } = req.body;
    // value_a = buyer ID, value_b = auction ID, value_c = seller ID

    const auction = await Auction.findById(value_b).populate("createdBy");
    const buyer = await User.findById(value_a);
    const seller = await User.findById(value_c);

    if (!auction || !buyer || !seller) {
      return next(new ErrorHandler("Payment record not found.", 404));
    }

    // Update auction payment status
    auction.paymentStatus = "Paid";
    auction.paidAt = new Date();
    auction.overallStatus = "Paid - Awaiting Shipment";
    await auction.save();

    // Calculate commission (7%)
    const commissionAmount = parseFloat(amount) * 0.07;
    const sellerAmount = parseFloat(amount) * 0.93;

    // Create escrow record if not exists
    // Use an atomic upsert to ensure only one escrow exists per auction
    const escrow = await Escrow.findOneAndUpdate(
      { auctionId: auction._id },
      {
        $setOnInsert: {
          auctionId: auction._id,
          buyerId: buyer._id,
          sellerId: seller._id,
          totalAmount: parseFloat(amount),
          commissionAmount,
          sellerAmount,
          status: "Held",
          transactionId: tran_id,
          shippingAddress: buyer.address || null,
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    // Increment transaction count (one successful auction payment)
    try {
      await incrementMetric("totalTransactionsCount", 1);
    } catch (err) {
      console.error("Failed to increment totalTransactionsCount:", err);
    }

    // UPDATE BUYER TRUST SCORE
    const paymentTime = Date.now() - new Date(auction.endTime).getTime();
    const paymentHours = paymentTime / (1000 * 60 * 60);

    const trustPointsEarned = calculateTrustPoints({
      role: "Bidder",
      amount: parseFloat(amount),
      timeHours: paymentHours,
    });

    buyer.trustScore += trustPointsEarned;
    buyer.totalTransactionVolume += parseFloat(amount);
    buyer.stats.totalAuctionsWon += 1;
    buyer.stats.averagePaymentTime =
      (buyer.stats.averagePaymentTime * (buyer.stats.totalAuctionsWon - 1) +
        paymentHours) /
      buyer.stats.totalAuctionsWon;

    // First payment? Award verified badge
    if (!buyer.isVerifiedBuyer) {
      buyer.isVerifiedBuyer = true;
      buyer.firstSuccessfulAuctionDate = new Date();
    }

    // Recalculate badge tier and star rating
    buyer.badgeTier = calculateBadgeTier(buyer.totalTransactionVolume);
    buyer.starRating = calculateStarRating(buyer.trustScore);
    buyer.lastActivityDate = new Date();
    await buyer.save();

    // Log transaction history (attach escrowId if present)
    await TransactionHistory.create({
      userId: buyer._id,
      auctionId: auction._id,
      escrowId: escrow?._id || null,
      role: "Bidder",
      amount: parseFloat(amount),
      trustPointsEarned,
      paymentTimeHours: paymentHours,
      outcome: "Success",
      auctionTitle: auction.title,
    });

    // Send email to seller
    try {
      await sendEmail({
        email: seller.email,
        subject: "Payment Received - Ship Your Item",
        message: `Good news! The buyer has paid BDT ${amount} for your auction "${
          auction.title
        }".
      
Payment Details:

Next Steps:
1. Ship the item to the buyer
2. Enter the tracking number on the platform
3. Funds will be released to you after buyer confirms delivery

Buyer Contact:

Log in to mark the item as shipped: ${
          process.env.FRONTEND_URL
        }/seller/auctions/${auction._id}`,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    // Send email to buyer
    try {
      await sendEmail({
        email: buyer.email,
        subject: "Payment Successful - Awaiting Shipment",
        message: `Your payment of BDT ${amount} for "${
          auction.title
        }" has been received successfully!

Payment Details:

What's Next:
1. The seller will ship the item soon
2. You'll receive tracking information
3. Confirm delivery when you receive the item
4. Funds will be released to seller after your confirmation

Seller Contact:

Track your purchase: ${process.env.FRONTEND_URL}/buyer/purchases/${
          auction._id
        }`,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    res.redirect(
      `${process.env.FRONTEND_URL}/payment-success?type=auction&tran_id=${tran_id}&auction_id=${auction._id}`,
    );
  },
);

// Auction payment failure callback
export const auctionPaymentFail = catchAsyncErrors(async (req, res, next) => {
  const { tran_id, value_b } = req.body; // value_b = auction ID

  const auction = await Auction.findById(value_b);
  if (auction) {
    auction.paymentStatus = "Failed";
    auction.transactionId = tran_id;
    await auction.save();
  }

  res.redirect(
    `${process.env.FRONTEND_URL}/payment-failed?type=auction&tran_id=${tran_id}`,
  );
});

// Auction payment cancellation callback
export const auctionPaymentCancel = catchAsyncErrors(async (req, res, next) => {
  const { tran_id, value_b } = req.body; // value_b = auction ID

  const auction = await Auction.findById(value_b);
  if (auction) {
    auction.paymentStatus = "Unpaid";
    auction.transactionId = null;
    await auction.save();
  }

  res.redirect(
    `${process.env.FRONTEND_URL}/payment-cancelled?type=auction&tran_id=${tran_id}`,
  );
});

// Auction payment IPN
export const auctionPaymentIPN = catchAsyncErrors(async (req, res, next) => {
  const { tran_id, status, amount, value_a, value_b, value_c } = req.body;

  if (status === "VALID" || status === "VALIDATED") {
    const auction = await Auction.findById(value_b);
    const buyer = await User.findById(value_a);
    const seller = await User.findById(value_c);

    if (auction && buyer && seller && auction.paymentStatus !== "Paid") {
      auction.paymentStatus = "Paid";
      auction.paidAt = new Date();
      auction.overallStatus = "Paid - Awaiting Shipment";
      await auction.save();

      const commissionAmount = parseFloat(amount) * 0.07;
      const sellerAmount = parseFloat(amount) * 0.93;

      // Create escrow if not exists
      // Create escrow if not exists (atomic upsert)
      const now2 = new Date();
      await Escrow.findOneAndUpdate(
        { auctionId: auction._id },
        {
          $setOnInsert: {
            auctionId: auction._id,
            buyerId: buyer._id,
            sellerId: seller._id,
            totalAmount: parseFloat(amount),
            commissionAmount,
            sellerAmount,
            status: "Held",
            transactionId: tran_id,
            shippingAddress: buyer.address || null,
            createdAt: now2,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      // Increment transaction count for IPN-created escrow (best-effort)
      try {
        await incrementMetric("totalTransactionsCount", 1);
      } catch (err) {
        console.error("Failed to increment totalTransactionsCount:", err);
      }
    }
  }

  res.status(200).send("IPN received");
});

// Dev/demo helper: mark auction as paid without calling SSLCommerz (development only)
export const demoAuctionPay = catchAsyncErrors(async (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    return next(new ErrorHandler("Not allowed in production", 403));
  }

  const { auctionId } = req.params;
  const auction = await Auction.findById(auctionId).populate("createdBy");
  const buyer = await User.findById(req.user._id);
  if (!auction) return next(new ErrorHandler("Auction not found", 404));
  if (!buyer) return next(new ErrorHandler("Buyer not found", 404));

  // Ensure user is actual winner
  if (
    !auction.highestBidder ||
    auction.highestBidder.toString() !== buyer._id.toString()
  ) {
    return next(
      new ErrorHandler("You are not the winner of this auction.", 403),
    );
  }

  // Mark as paid
  auction.paymentStatus = "Paid";
  auction.paidAt = new Date();
  auction.overallStatus = "Paid - Awaiting Shipment";
  await auction.save();

  const amount = auction.currentBid;
  const commissionAmount = parseFloat(amount) * 0.07;
  const sellerAmount = parseFloat(amount) * 0.93;

  const existingEscrow = await Escrow.findOne({ auctionId: auction._id });
  if (!existingEscrow) {
    await Escrow.create({
      auctionId: auction._id,
      buyerId: buyer._id,
      sellerId: auction.createdBy._id,
      totalAmount: parseFloat(amount),
      commissionAmount,
      sellerAmount,
      status: "Held",
      transactionId: `DEMO_${auction._id}_${Date.now()}`,
      shippingAddress: buyer.address || null,
      createdAt: new Date(),
    });
  }

  // Ensure no duplicate demo escrow (dev only)
  // If an escrow already exists for this auction, do not create another.

  // Ensure we did not create duplicates in dev; if an escrow already exists, do not duplicate
  // (demo endpoint used only in non-production)

  // Increment metric
  try {
    await incrementMetric("totalTransactionsCount", 1);
  } catch (err) {
    console.error(err);
  }

  res.status(200).json({
    success: true,
    message: "Demo payment completed",
    auctionId: auction._id,
  });
});

// Initialize Premium Subscription Payment
export const initPremiumPayment = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.isPremium) {
    return next(new ErrorHandler("You already have premium subscription", 400));
  }

  // Read SSLCommerz config inside function (after dotenv loads)
  const store_id = process.env.SSLCOMMERZ_STORE_ID;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";

  const transactionId = `PREM-${user._id}-${Date.now()}`;

  console.log("SSLCommerz Config:", {
    store_id,
    store_passwd_length: store_passwd?.length,
    is_live,
  });

  const data = {
    total_amount: 999,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${process.env.BACKEND_URL}/api/v1/payment/premium/success`,
    fail_url: `${process.env.FRONTEND_URL}/payment-failed?type=premium`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled?type=premium`,
    ipn_url: `${process.env.BACKEND_URL}/api/v1/payment/premium/ipn`,
    shipping_method: "NO",
    product_name: "Nilamee Premium Subscription",
    product_category: "service",
    product_profile: "non-physical-goods",
    cus_name: user.userName || "Premium User",
    cus_email: user.email,
    cus_add1: user.address || "Dhaka, Bangladesh",
    cus_add2: "Bangladesh",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: user.phoneNumber || "01700000000",
    cus_fax: "01700000000",
    ship_name: user.userName || "Premium User",
    ship_add1: user.address || "Dhaka, Bangladesh",
    ship_add2: "Bangladesh",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh",
    value_a: `premium_${user._id}`,
    value_b: "monthly",
    value_c: "999",
    value_d: "BDT",
  };

  console.log("Payment Data:", data);

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  try {
    console.log("Calling SSLCommerz init...");
    const apiResponse = await sslcz.init(data);
    console.log("SSLCommerz Response:", apiResponse);

    if (apiResponse.status === "SUCCESS") {
      // Store transaction details temporarily
      user.pendingPremiumTransaction = {
        transactionId,
        amount: 999,
        initiatedAt: new Date(),
      };
      await user.save();

      // Use redirectGatewayURL for direct redirect (more stable in sandbox)
      const gatewayUrl =
        apiResponse.redirectGatewayURL || apiResponse.GatewayPageURL;

      res.status(200).json({
        success: true,
        gatewayUrl: gatewayUrl,
        transactionId,
      });
    } else {
      console.error("SSLCommerz returned non-SUCCESS status:", apiResponse);
      return next(new ErrorHandler("Payment initialization failed", 400));
    }
  } catch (error) {
    console.error("SSLCommerz Error:", error);
    console.error("Error details:", error.message, error.stack);
    return next(new ErrorHandler("Payment gateway error", 500));
  }
});

// Verify Premium Payment
export const verifyPremiumPayment = catchAsyncErrors(async (req, res, next) => {
  const { tranId } = req.query;

  console.log("=== PREMIUM VERIFICATION STARTED ===");
  console.log("Transaction ID received:", tranId);

  if (!tranId) {
    console.log("ERROR: No transaction ID provided");
    return next(new ErrorHandler("Transaction ID is required", 400));
  }

  const user = await User.findOne({
    "pendingPremiumTransaction.transactionId": tranId,
  });

  console.log(
    "User lookup result:",
    user ? `Found user: ${user.userName} (${user.email})` : "User not found",
  );

  if (!user) {
    console.log("ERROR: No pending transaction found for tranId:", tranId);
    return next(new ErrorHandler("Transaction not found", 404));
  }

  console.log("Activating premium for user:", user.userName);

  // Activate premium subscription
  user.isPremium = true;
  user.premiumActivatedAt = new Date();
  user.premiumExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  user.pendingPremiumTransaction = undefined;
  await user.save();

  console.log("Premium activated successfully!");
  console.log("User premium status:", {
    isPremium: user.isPremium,
    premiumActivatedAt: user.premiumActivatedAt,
    premiumExpiresAt: user.premiumExpiresAt,
  });

  res.status(200).json({
    success: true,
    message: "Premium subscription activated successfully",
    user: {
      isPremium: user.isPremium,
      premiumActivatedAt: user.premiumActivatedAt,
      premiumExpiresAt: user.premiumExpiresAt,
    },
  });
});

// Success URL Handler - SSLCommerz redirects here after payment
export const handlePremiumSuccess = catchAsyncErrors(async (req, res) => {
  console.log("\n=== PREMIUM SUCCESS CALLBACK ===");
  console.log("Method:", req.method);
  console.log("Body:", req.body);
  console.log("Query:", req.query);

  // Accept transaction ID from both body (POST) and query (GET)
  const tran_id = req.body.tran_id || req.query.tran_id || req.query.tranId;
  const status = req.body.status || req.query.status;

  console.log("Transaction ID:", tran_id);
  console.log("Status:", status);

  if (tran_id) {
    try {
      // Find user and activate premium
      const user = await User.findOne({
        "pendingPremiumTransaction.transactionId": tran_id,
      });

      if (user) {
        console.log("User found:", user.email);

        // Check if already premium (avoid duplicate activation)
        if (!user.isPremium) {
          user.isPremium = true;
          user.premiumActivatedAt = new Date();
          user.premiumExpiresAt = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          );
          user.pendingPremiumTransaction = undefined;
          await user.save();
          console.log("✅ Premium activated successfully!");
        } else {
          console.log("ℹ️ User is already premium");
        }
      } else {
        console.log("❌ No user found with transaction:", tran_id);
      }
    } catch (error) {
      console.error("Error activating premium:", error);
    }
  }

  // Always redirect to frontend success page
  res.redirect(
    `${process.env.FRONTEND_URL}/payment-success?type=premium&tranId=${tran_id}&status=success`,
  );
});

// IPN Handler for Premium Payment
export const premiumPaymentIPN = catchAsyncErrors(async (req, res) => {
  console.log("\n=== PREMIUM IPN RECEIVED ===");
  console.log("Body:", req.body);

  const { tran_id, status, val_id } = req.body;
  console.log("Transaction ID:", tran_id);
  console.log("Status:", status);
  console.log("Validation ID:", val_id);

  if (status === "VALID" || status === "VALIDATED") {
    try {
      const user = await User.findOne({
        "pendingPremiumTransaction.transactionId": tran_id,
      });

      if (user) {
        console.log("User found in IPN:", user.email);

        // Check if already premium (avoid duplicate activation)
        if (!user.isPremium) {
          user.isPremium = true;
          user.premiumActivatedAt = new Date();
          user.premiumExpiresAt = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          );
          user.pendingPremiumTransaction = undefined;
          await user.save();
          console.log("✅ Premium activated via IPN!");
        } else {
          console.log("ℹ️ User already has premium (IPN)");
        }
      } else {
        console.log("❌ No user found for IPN transaction:", tran_id);
      }
    } catch (error) {
      console.error("Error in IPN handler:", error);
    }
  }

  res.status(200).send("IPN Received");
});

// Cancel Premium Subscription
export const cancelPremiumSubscription = catchAsyncErrors(
  async (req, res, next) => {
    const { password } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (!user.isPremium) {
      return next(
        new ErrorHandler("You don't have an active premium subscription", 400),
      );
    }

    // Verify password
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Incorrect password", 401));
    }

    // Cancel premium subscription
    user.isPremium = false;
    user.premiumActivatedAt = undefined;
    user.premiumExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Premium subscription cancelled successfully",
    });
  },
);
