const express = require("express");

const router = express.Router();

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const {
  protect,
  artistOnly,
}  = require("../middleware/authMiddleware");

// Get all notifications
router.get(
  "/my-notifications",
  protect,
  artistOnly,
  getMyNotifications
);

// Mark all notifications as read
router.put(
  "/read-all",
  protect,
  artistOnly,
  markAllNotificationsAsRead
);
// Delete one notification
router.delete(
  "/:id",
  protect,
  artistOnly,
  deleteNotification
);
// Mark one notification as read
router.put(
  "/:id/read",
  protect,
  artistOnly,
  markNotificationAsRead
);



module.exports = router;