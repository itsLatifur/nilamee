import { User } from "../../features/users/users.model.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.middleware.js";
import { catchAsyncErrors } from "./async.middleware.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Accept token from cookie or Authorization header (Bearer)
  let token = null;
  if (req.cookies && req.cookies.token) token = req.cookies.token;
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorHandler("User not authenticated.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id).select("-password");
  next();
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resouce.`,
          403
        )
      );
    }
    next();
  };
};
