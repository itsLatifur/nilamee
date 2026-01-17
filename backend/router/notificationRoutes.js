import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { addClient, removeClient } from "../shared/sseManager.js";

const router = express.Router();

router.get("/getall", isAuthenticated, getUserNotifications);
// Server-Sent Events stream for real-time notifications
router.get("/stream", isAuthenticated, (req, res) => {
  // Set SSE headers
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders && res.flushHeaders();

  const userId = req.user._id.toString();
  addClient(userId, res);

  // Send a ready comment
  res.write(`: connected\n\n`);

  // Keep connection alive with occasional ping
  const ping = setInterval(() => {
    try {
      res.write(`:\n`);
    } catch (err) {
      clearInterval(ping);
      removeClient(userId, res);
    }
  }, 25000);

  req.on("close", () => {
    clearInterval(ping);
    removeClient(userId, res);
  });
});
router.put("/read/:id", isAuthenticated, markNotificationRead);
router.put("/readall", isAuthenticated, markAllNotificationsRead);
router.delete("/delete/:id", isAuthenticated, deleteNotification);

export default router;
