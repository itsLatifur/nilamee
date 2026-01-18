import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";

// Deprecated: manual commission enforcement is removed. Keep middleware as no-op.
export const trackCommissionStatus = catchAsyncErrors(
  async (req, res, next) => {
    next();
  },
);
