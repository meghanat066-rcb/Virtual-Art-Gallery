const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    const allowedRoles = ["user", "artist"];

const userRole = allowedRoles.includes(role)
  ? role
  : "user";

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    const userResponse = {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
};

res.status(201).json({
  success: true,
  message: "Registration successful",
  user: userResponse,
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Check email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const userResponse = {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
};

res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  user: userResponse,
});

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// Update logged-in user's profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate name
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // Validate email
    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check whether another account already uses this email
    const existingUser = await User.findOne({
      email: email.trim(),
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Update name and email
    user.name = name.trim();
    user.email = email.trim();

    // Change password only if a new password was entered
    if (newPassword) {

      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required",
        });
      }

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be at least 6 characters",
        });
      }

      user.password = await bcrypt.hash(
        newPassword,
        10
      );
    }

    await user.save();

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update profile",
    });
  }
};
// Upload / update artist profile image
const updateProfileImage = async (req, res) => {
  try {
    if (req.user.role !== "artist") {
      return res.status(403).json({
        success: false,
        message: "Only artists can update profile image",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Cloudinary URL returned by multer-storage-cloudinary
    user.profileImage = req.file.path;

    await user.save();

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    };

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Profile image upload error:", error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update profile image",
    });
  }
};
// Upload / update normal user profile image
const updateUserProfileImage = async (req, res) => {
  try {
    // Only normal users can use this endpoint
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can update user profile image",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Cloudinary URL returned by multer-storage-cloudinary
    user.userProfileImage = req.file.path;

    await user.save();

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      userProfileImage: user.userProfileImage,
    };

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user: userResponse,
    });

  } catch (error) {
    console.error(
      "User profile image upload error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update profile image",
    });
  }
};
// Remove normal user profile image
const removeUserProfileImage = async (req, res) => {
  try {
    // Only normal users can use this endpoint
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can remove user profile image",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.userProfileImage = "";

    await user.save();

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      userProfileImage: user.userProfileImage,
    };

    res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      user: userResponse,
    });

  } catch (error) {
    console.error(
      "Remove user profile image error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to remove profile image",
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  updateProfileImage,
  updateUserProfileImage,
  removeUserProfileImage,
};