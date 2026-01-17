import mongoose from "mongoose";
import sseManager from "../shared/sseManager.js";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["info", "warning", "error", "success"],
    default: "info",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Emit SSE to connected clients whenever a notification is saved
notificationSchema.post("save", function (doc) {
  try {
    const data = {
      _id: doc._id,
      userId: doc.userId,
      title: doc.title,
      message: doc.message,
      type: doc.type,
      isRead: doc.isRead,
      createdAt: doc.createdAt,
    };
    sseManager.sendToUser(doc.userId?.toString(), data);
  } catch (err) {
    console.error("Failed to emit SSE for notification:", err);
  }
});

export const Notification = mongoose.model("Notification", notificationSchema);
