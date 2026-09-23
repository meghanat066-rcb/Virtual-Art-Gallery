const multer = require("multer");
const { storage } = require("../config/cloudinary");

const profileImageUpload = multer({
  storage,
});

module.exports = profileImageUpload;