const express = require("express");

const {
  getPublishedExhibitions,
  getExhibitionById,
  getAllExhibitions,
  getAdminExhibitionById,
  createExhibition,
  updateExhibition,
  deleteExhibition,
} = require("../controllers/exhibitionController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// =====================================================
// PUBLIC EXHIBITION ROUTES
// =====================================================

// Get all published exhibitions
router.get(
  "/",
  getPublishedExhibitions
);


// =====================================================
// ADMIN EXHIBITION ROUTES
// =====================================================

// Get all exhibitions
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllExhibitions
);

router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getAdminExhibitionById
);

// Create exhibition
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
      name: "overviewImage",
      maxCount: 1,
    },
    {
      name: "installationShots",
      maxCount: 10,
    },
  ]),
  createExhibition
);

// Update exhibition
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
      name: "overviewImage",
      maxCount: 1,
    },
    {
      name: "installationShots",
      maxCount: 10,
    },
  ]),
  updateExhibition
);

// Delete exhibition
router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteExhibition
);

// Get one published exhibition
router.get(
  "/:id",
  getExhibitionById
);


module.exports = router;