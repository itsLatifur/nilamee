import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import ErrorHandler from "../../shared/middlewares/error.middleware.js";
import { User } from "../users/users.model.js";
import { PaymentProof } from "../commissions/proof.model.js";
import SSLCommerzPayment from "sslcommerz-lts";

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true"; // true for live, false for sandbox

// Initialize SSLCommerz payment
export const initCommissionPayment = catchAsyncErrors(
  async (req, res, next) => {
    const { amount, comment } = req.body;
    const user = await User.findById(req.user._id);

    if (!amount || amount <= 0) {
      return next(new ErrorHandler("Please provide a valid amount.", 400));
    }

    if (user.unpaidCommission === 0) {
      return next(
        new ErrorHandler("You don't have any unpaid commissions.", 400)
      );
    }

    if (amount > user.unpaidCommission) {
      return next(
        new ErrorHandler(
          `The amount exceeds your unpaid commission balance. Your unpaid commission is BDT ${user.unpaidCommission}`,
          400
        )
      );
    }

    const transactionId = `COMM_${user._id}_${Date.now()}`;

    const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    const paymentData = {
      total_amount: amount,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${process.env.BACKEND_URL}/api/v1/payment/commission/success`,
      fail_url: `${process.env.BACKEND_URL}/api/v1/payment/commission/fail`,
      cancel_url: `${process.env.BACKEND_URL}/api/v1/payment/commission/cancel`,
      ipn_url: `${process.env.BACKEND_URL}/api/v1/payment/commission/ipn`,
      product_name: "Auction Commission Payment",
      product_category: "Commission",
      product_profile: "general",
      cus_name: user.userName,
      cus_email: user.email,
      cus_add1: user.address || "N/A",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: user.phone || "N/A",
      shipping_method: "NO",
      value_a: user._id.toString(), // Store user ID
      value_b: amount.toString(), // Store amount
      value_c: comment || "", // Store comment
    };

    try {
      const apiResponse = await sslcommerz.init(paymentData);

      if (apiResponse.status === "SUCCESS") {
        // Create pending payment proof record
        await PaymentProof.create({
          userId: user._id,
          amount,
          comment: comment || "",
          transactionId,
          status: "Pending",
          proof: {
            public_id: transactionId,
            url: apiResponse.GatewayPageURL,
          },
        });

        res.status(200).json({
          success: true,
          gatewayUrl: apiResponse.GatewayPageURL,
          transactionId,
        });
      } else {
        return next(
          new ErrorHandler("Failed to initialize payment gateway.", 500)
        );
      }
    } catch (error) {
      return next(
        new ErrorHandler(error.message || "Payment initialization failed.", 500)
      );
    }
  }
);

// Payment success callback
export const paymentSuccess = catchAsyncErrors(async (req, res, next) => {
  const { tran_id, amount, value_a } = req.body; // value_a contains user ID

  const paymentProof = await PaymentProof.findOne({ transactionId: tran_id });
  const user = await User.findById(value_a);

  if (!paymentProof || !user) {
    return next(new ErrorHandler("Payment record not found.", 404));
  }

  // Update payment proof status
  paymentProof.status = "Approved";
  await paymentProof.save();

  // Deduct commission from user
  user.unpaidCommission = Math.max(0, user.unpaidCommission - amount);
  await user.save();

  res.redirect(
    `${process.env.FRONTEND_URL}/payment-success?tran_id=${tran_id}`
  );
});

// Payment failure callback
export const paymentFail = catchAsyncErrors(async (req, res, next) => {
  const { tran_id } = req.body;

  const paymentProof = await PaymentProof.findOne({ transactionId: tran_id });
  if (paymentProof) {
    paymentProof.status = "Rejected";
    await paymentProof.save();
  }

  res.redirect(`${process.env.FRONTEND_URL}/payment-failed?tran_id=${tran_id}`);
});

// Payment cancellation callback
export const paymentCancel = catchAsyncErrors(async (req, res, next) => {
  const { tran_id } = req.body;

  const paymentProof = await PaymentProof.findOne({ transactionId: tran_id });
  if (paymentProof) {
    paymentProof.status = "Rejected";
    await paymentProof.save();
  }

  res.redirect(
    `${process.env.FRONTEND_URL}/payment-cancelled?tran_id=${tran_id}`
  );
});

// IPN (Instant Payment Notification) - for webhook
export const paymentIPN = catchAsyncErrors(async (req, res, next) => {
  const { tran_id, status, amount, value_a } = req.body;

  if (status === "VALID" || status === "VALIDATED") {
    const paymentProof = await PaymentProof.findOne({ transactionId: tran_id });
    const user = await User.findById(value_a);

    if (paymentProof && user) {
      paymentProof.status = "Approved";
      await paymentProof.save();

      user.unpaidCommission = Math.max(0, user.unpaidCommission - amount);
      await user.save();
    }
  }

  res.status(200).send("IPN received");
});

// Validate payment transaction
export const validatePayment = catchAsyncErrors(async (req, res, next) => {
  const { transactionId } = req.params;

  const paymentProof = await PaymentProof.findOne({ transactionId });

  if (!paymentProof) {
    return next(new ErrorHandler("Payment not found.", 404));
  }

  const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  try {
    const validationResponse = await sslcommerz.validate({
      val_id: transactionId,
    });

    res.status(200).json({
      success: true,
      paymentProof,
      validation: validationResponse,
    });
  } catch (error) {
    return next(new ErrorHandler("Validation failed.", 500));
  }
});
