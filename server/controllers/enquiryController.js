const Enquiry = require("../models/Enquiry");
const Artwork = require("../models/Artwork");

// Send an enquiry about an artwork
const createEnquiry = async (req, res) => {
  try {
    const { artworkId, message } = req.body;

    if (!artworkId || !message) {
      return res.status(400).json({
        success: false,
        message: "Artwork and message are required",
      });
    }

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    const enquiry = await Enquiry.create({
      artist: artwork.uploadedBy,
      artwork: artwork._id,
      visitor: req.user._id,
      message,
    });

    const populatedEnquiry = await Enquiry.findById(enquiry._id)
      .populate("artist", "name email")
      .populate("visitor", "name email")
      .populate("artwork", "title image");

    res.status(201).json({
      success: true,
      enquiry: populatedEnquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get enquiries received by logged-in artist
const getMyEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({
      artist: req.user._id,
    })
      .populate("visitor", "name email")
      .populate("artwork", "title image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Admin gets all enquiries
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("artist", "name email")
      .populate("visitor", "name email")
      .populate("artwork", "title image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get enquiries sent by logged-in user
const getMyUserEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({
      visitor: req.user._id,
    })
      .populate("artist", "name email")
      .populate("artwork", "title image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark one enquiry as read
const markEnquiryAsRead = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOneAndUpdate(
      {
        _id: req.params.id,
        artist: req.user._id,
      },
      {
        isRead: true,
      },
      {
        returnDocument: "after",
      }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Mark all enquiries as read
const markAllEnquiriesAsRead = async (req, res) => {
  try {
    await Enquiry.updateMany(
      {
        artist: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "All enquiries marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Delete one enquiry received by logged-in artist
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOneAndDelete({
      _id: req.params.id,
      artist: req.user._id,
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Artist replies to an enquiry
const replyToEnquiry = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const enquiry = await Enquiry.findOne({
      _id: req.params.id,
      artist: req.user._id,
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    enquiry.reply = reply.trim();
    enquiry.repliedAt = new Date();

    await enquiry.save();

    const populatedEnquiry = await Enquiry.findById(enquiry._id)
      .populate("artist", "name email")
      .populate("visitor", "name email")
      .populate("artwork", "title image");

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      enquiry: populatedEnquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// User deletes their own enquiry
const deleteMyUserEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOneAndDelete({
      _id: req.params.id,
      visitor: req.user._id,
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createEnquiry,
  getMyEnquiries,
  getAllEnquiries,
  getMyUserEnquiries,
  deleteMyUserEnquiry,
  markEnquiryAsRead,
  markAllEnquiriesAsRead,
  deleteEnquiry,
  replyToEnquiry,
};