const User = require("../models/User");
const Artwork = require("../models/Artwork");

// Add or remove artwork from favorites
const toggleFavorite = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.artworkId);

    if (!artwork || artwork.status !== "approved") {
      return res.status(404).json({
        success: false,
        message: "Approved artwork not found",
      });
    }

    const user = await User.findById(req.user._id);

    const artworkId = artwork._id.toString();

    const alreadyFavorite = user.favorites.some(
      (id) => id.toString() === artworkId
    );

    if (alreadyFavorite) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== artworkId
      );
    } else {
      user.favorites.push(artwork._id);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: alreadyFavorite
        ? "Artwork removed from favorites"
        : "Artwork added to favorites",
      favorite: !alreadyFavorite,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get logged-in user's favorite artworks
const getMyFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      match: { status: "approved" },
      populate: {
        path: "uploadedBy",
        select: "name email role",
      },
    });

    res.status(200).json({
      success: true,
      favorites: user.favorites || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  toggleFavorite,
  getMyFavorites,
};