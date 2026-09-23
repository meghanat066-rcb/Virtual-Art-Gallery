const express = require("express");
const {
  addComment,
  getArtworkComments,
  getMyComments,
  getMyArtworkComments,
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:artworkId", protect, addComment);
router.get("/my-comments", protect, getMyComments);
router.get(
  "/my-artwork-comments",
  protect,
  getMyArtworkComments
);
router.get("/:artworkId", getArtworkComments);


module.exports = router;