const Comment = require("../models/Comment");
const Artwork = require("../models/Artwork");

// Add a comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { artworkId } = req.params;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    if (artwork.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Comments are allowed only on approved artworks",
      });
    }

    const comment = await Comment.create({
      artwork: artworkId,
      user: req.user._id,
      text: text.trim(),
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name email role");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all comments for one artwork
const getArtworkComments = async (req, res) => {
  try {
    const { artworkId } = req.params;

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    const comments = await Comment.find({ artwork: artworkId })
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get comments made by the logged-in user
const getMyComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      user: req.user._id,
    })
      .populate("artwork", "title image artistName category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get all comments received on the logged-in artist's artworks
const getMyArtworkComments = async (req, res) => {
  try {
    const artistId = req.user._id;

    // Find all artworks uploaded by this artist
    const artworks = await Artwork.find({
      uploadedBy: artistId,
    }).select("_id");

    const artworkIds = artworks.map(
      (artwork) => artwork._id
    );

    // Find comments belonging to those artworks
    const comments = await Comment.find({
      artwork: { $in: artworkIds },
    })
      .populate("artwork", "title image artistName")
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  addComment,
  getArtworkComments,
  getMyComments,
  getMyArtworkComments,
};