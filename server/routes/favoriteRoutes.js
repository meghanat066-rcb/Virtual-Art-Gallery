const express = require("express");
const {
  toggleFavorite,
  getMyFavorites,
} = require("../controllers/favoriteController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.patch("/:artworkId", protect, toggleFavorite);
router.get("/", protect, getMyFavorites);

module.exports = router;