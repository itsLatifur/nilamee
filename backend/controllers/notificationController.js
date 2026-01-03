import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Notification } from "../models/notificationSchema.js";

// Get user's notifications
export const getUserNotifications = catchAsyncErrors(async (req, res, next) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    userId: req.user._id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    notifications,
    unreadCount,
  });
});

// Mark notification as read
export const markNotificationRead = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findOne({
    _id: id,
    userId: req.user._id,
  });

  if (!notification) {
    return next(new ErrorHandler("Notification not found.", 404));
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: "Notification marked as read.",
  });
});

// Mark all notifications as read
export const markAllNotificationsRead = catchAsyncErrors(
  async (req, res, next) => {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
  }
);

// Delete notification
export const deleteNotification = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findOne({
    _id: id,
    userId: req.user._id,
  });

  if (!notification) {
    return next(new ErrorHandler("Notification not found.", 404));
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: "Notification deleted.",
  });
});
