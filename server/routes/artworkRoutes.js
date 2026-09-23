const express = require("express");
const {
  uploadArtwork,
  getAllArtworks,
  getFeaturedArtworks,
  getArtworkById,
  getArtworkReplicas,
  getMyArtworks,
  getPendingArtworks,
  getAllArtworksForAdmin,
  updateArtworkStatus,
  toggleLikeArtwork,
  updateArtwork,
  deleteArtwork,
  getVirtualTourArtists,
 
} = require("../controllers/artworkController");

const { protect, adminOnly, artistOnly, } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getAllArtworks);
router.get(
  "/virtual-tour-artists",
  getVirtualTourArtists
);
router.get("/my-artworks", protect,  artistOnly, getMyArtworks);
router.get("/admin/pending", protect, adminOnly, getPendingArtworks);
router.get("/admin/all", protect, adminOnly, getAllArtworksForAdmin);
router.get("/featured", getFeaturedArtworks);
router.get("/:id/replicas", getArtworkReplicas);
router.get("/:id", getArtworkById);
router.post(
  "/upload",
  protect,
  artistOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "replicaImage", maxCount: 1 },
  ]),
  uploadArtwork
);
router.patch("/:id/status", protect, adminOnly, updateArtworkStatus);
router.patch("/:id/like", protect, toggleLikeArtwork);
router.patch(
  "/:id",
  protect,
  artistOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "replicaImage", maxCount: 1 },
  ]),
  updateArtwork
);
router.delete("/:id", protect, deleteArtwork);


module.exports = router;