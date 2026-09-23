const express = require("express");

const {
  getPublishedVirtualRoom,
  getPublishedVirtualRooms,
  getAllVirtualRooms,
  getVirtualRoomById,
  createVirtualRoom,
  updateVirtualRoom,
  deleteVirtualRoom,
} = require("../controllers/virtualRoomController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =====================================================
// PUBLIC VIRTUAL ROOM ROUTES
// =====================================================

// Get the latest published virtual room
router.get(
  "/",
  getAllVirtualRooms
);
// Get all published virtual rooms

router.get(
  "/",

  getPublishedVirtualRooms
);
// =====================================================
// ADMIN VIRTUAL ROOM ROUTES
// =====================================================

// Get all virtual rooms
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllVirtualRooms
);

// Get one virtual room
router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getVirtualRoomById
);

// Create virtual room
router.post(
  "/admin",
  protect,
  adminOnly,
  upload.fields([
  {
    name: "coverImage",
    maxCount: 1,
  },
  {
    name: "welcomeBackgroundImage",
    maxCount: 1,
  },
]),
  createVirtualRoom
);

// Update virtual room
router.put(
  "/admin/:id",
  protect,
  adminOnly,
  upload.fields([
  {
    name: "coverImage",
    maxCount: 1,
  },
  {
    name: "welcomeBackgroundImage",
    maxCount: 1,
  },
]),
  updateVirtualRoom
);

// Delete virtual room
router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteVirtualRoom
);

module.exports = router;