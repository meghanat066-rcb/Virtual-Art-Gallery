const express = require("express");
const { registerUser, loginUser, updateProfile, updateProfileImage, updateUserProfileImage,  removeUserProfileImage, } = require("../controllers/AuthController");


const {
  protect,
} = require("../middleware/authMiddleware");

const profileImageUpload = require("../middleware/profileImageUpload");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put(
  "/profile",
  protect,
  updateProfile
);
router.patch(
  "/profile-image",
  protect,
  profileImageUpload.single("profileImage"),
  updateProfileImage
);
router.patch(
  "/user-profile-image",
  protect,
  profileImageUpload.single("profileImage"),
  updateUserProfileImage
);
router.patch(
  "/user-profile-image/remove",
  protect,
  removeUserProfileImage
);
module.exports = router;