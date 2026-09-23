const express = require("express");

const {
  getArtists,
  getArtistProfile,
  getMyArtistBiography,
  updateArtistBiography,
  updateArtistVideo,
  deleteArtist,
} = require("../controllers/artistController");

const {
  protect,
  artistOnly,
  adminOnly,
} = require("../middleware/authMiddleware");


const router = express.Router();

// Get all artists
router.get("/", getArtists);

router.get(
  "/profile/biography",
  protect,
  artistOnly,
  getMyArtistBiography
);

router.patch(
  "/profile/biography",
  protect,
  artistOnly,
  updateArtistBiography
);

router.patch(
  "/profile/video",
  protect,
  artistOnly,
  updateArtistVideo
);
router.delete("/:id", protect, adminOnly, deleteArtist);
// Get one artist and their published artworks
router.get("/:id", getArtistProfile);

module.exports = router;