import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/getall", isAuthenticated, getUserNotifications);
router.put("/read/:id", isAuthenticated, markNotificationRead);
router.put("/readall", isAuthenticated, markAllNotificationsRead);
router.delete("/delete/:id", isAuthenticated, deleteNotification);

export default router;
