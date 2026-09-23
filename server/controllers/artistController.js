const User = require("../models/User");
const Artwork = require("../models/Artwork");

// Get all artists
const getArtists = async (req, res) => {
  try {
    const artists = await User.find(
      { role: "artist" },
      "name profileImage biography artistStatement artistJourneyVideo"
    ).sort({ name: 1 });

    res.status(200).json({
      success: true,
      artists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get one artist with published artworks
const getArtistProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const artist = await User.findOne(
      {
        _id: id,
        role: "artist",
      },
      "name email profileImage biography artistStatement artistJourneyVideo"
    );

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    const artworks = await Artwork.find({
      uploadedBy: id,
      status: "approved",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      artist,
      artworks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update artist biography and achievements
const updateArtistBiography = async (req, res) => {
  try {
    const artistId = req.user._id;

    const {
      biography,
      artisticJourney,
    } = req.body;

    const artist = await User.findOne({
      _id: artistId,
      role: "artist",
    });

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    if (biography !== undefined) {
  artist.biography = biography;
}

if (artisticJourney !== undefined) {
  artist.artistStatement = artisticJourney;
}

    await artist.save();

    res.status(200).json({
      success: true,
      message: "Artist profile updated successfully!",
      artist: {
        name: artist.name,
        profileImage: artist.profileImage,
        biography: artist.biography,
        artistStatement: artist.artistStatement,
        artistJourneyVideo: artist.artistJourneyVideo,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get logged-in artist biography
const getMyArtistBiography = async (req, res) => {
  try {
    const artistId = req.user._id;

    const artist = await User.findOne(
      {
        _id: artistId,
        role: "artist",
      },
      "name email profileImage biography artistStatement artistJourneyVideo"
    );

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    res.status(200).json({
      success: true,
      artist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateArtistVideo = async (req, res) => {
  try {
    const artistId = req.user._id;

    const artist = await User.findOne({
      _id: artistId,
      role: "artist",
    });

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    const { artistJourneyVideo } = req.body;

    if (!artistJourneyVideo) {
      return res.status(400).json({
        success: false,
        message: "Please enter a video URL",
      });
    }

    artist.artistJourneyVideo = artistJourneyVideo.trim();

    await artist.save();

    res.status(200).json({
      success: true,
      message: "Artist journey video saved successfully!",
      artistJourneyVideo: artist.artistJourneyVideo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteArtist = async (req, res) => {
  try {
    const artist = await User.findOne({
      _id: req.params.id,
      role: "artist",
    });

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    // Delete all artworks uploaded by this artist
    await Artwork.deleteMany({
      uploadedBy: artist._id,
    });

    // Delete the artist account
    await artist.deleteOne();

    res.status(200).json({
      success: true,
      message: "Artist and their artworks deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getArtists,
  getArtistProfile,
  getMyArtistBiography,
  updateArtistBiography,
  updateArtistVideo,
  deleteArtist,
};