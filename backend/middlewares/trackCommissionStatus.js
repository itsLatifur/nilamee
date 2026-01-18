import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// Commission payment is now handled by the system automatically.
// This middleware used to prevent auctioneers with unpaidCommission
// from performing actions. Keep as a no-op to avoid blocking users.
export const trackCommissionStatus = catchAsyncErrors(
  async (req, res, next) => {
    // Intentionally do nothing.
    next();
  },
);
