const VirtualRoom = require("../models/VirtualRoom");
const { cloudinary } = require("../config/cloudinary");

// =====================================================
// PUBLIC: GET PUBLISHED VIRTUAL ROOM
// =====================================================

const getPublishedVirtualRoom = async (req, res) => {
  try {
    const virtualRoom = await VirtualRoom.findOne({
      status: "published",
    }).sort({ createdAt: -1 });

    if (!virtualRoom) {
      return res.status(404).json({
        success: false,
        message: "No published virtual room found",
      });
    }

    res.status(200).json({
      success: true,
      virtualRoom,
    });
  } catch (error) {
    console.error(
      "GET PUBLISHED VIRTUAL ROOM ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load virtual room",
    });
  }
};
// =====================================================
// PUBLIC: GET ALL PUBLISHED VIRTUAL ROOMS
// =====================================================

const getPublishedVirtualRooms = async (req, res) => {
  try {
    const virtualRooms = await VirtualRoom.find({
      status: "published",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      virtualRooms,
    });
  } catch (error) {
    console.error(
      "GET PUBLISHED VIRTUAL ROOMS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load virtual rooms",
    });
  }
};
// =====================================================
// ADMIN: GET ALL VIRTUAL ROOMS
// =====================================================

const getAllVirtualRooms = async (req, res) => {
  try {
    const virtualRooms = await VirtualRoom.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      virtualRooms,
    });
  } catch (error) {
    console.error(
      "GET ALL VIRTUAL ROOMS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load virtual rooms",
    });
  }
};

// =====================================================
// ADMIN: GET ONE VIRTUAL ROOM
// =====================================================

const getVirtualRoomById = async (req, res) => {
  try {
    const virtualRoom =
      await VirtualRoom.findById(req.params.id);

    if (!virtualRoom) {
      return res.status(404).json({
        success: false,
        message: "Virtual room not found",
      });
    }

    res.status(200).json({
      success: true,
      virtualRoom,
    });
  } catch (error) {
    console.error(
      "GET VIRTUAL ROOM ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load virtual room",
    });
  }
};

// =====================================================
// ADMIN: CREATE VIRTUAL ROOM
// =====================================================

const createVirtualRoom = async (req, res) => {
  try {
    console.log(
      "CREATE VIRTUAL ROOM BODY:",
      req.body
    );

    const {
      title,
      description,
      artists,
      artworks,
      theme,
      status,
    } = req.body || {};

    // -------------------------------------------------
    // Validate title
    // -------------------------------------------------

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Virtual room title is required",
      });
    }

    // -------------------------------------------------
    // Parse artists
    // -------------------------------------------------

    let parsedArtists = [];

    if (artists) {
      try {
        parsedArtists =
          typeof artists === "string"
            ? JSON.parse(artists)
            : artists;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid virtual room artists data",
        });
      }
    }

    if (!Array.isArray(parsedArtists)) {
      parsedArtists = [];
    }

    // -------------------------------------------------
    // Parse artworks
    // -------------------------------------------------

    let parsedArtworks = [];

    if (artworks) {
      try {
        parsedArtworks =
          typeof artworks === "string"
            ? JSON.parse(artworks)
            : artworks;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid virtual room artworks data",
        });
      }
    }

    if (!Array.isArray(parsedArtworks)) {
      parsedArtworks = [];
    }

    // -------------------------------------------------
    // Validate artists
    // -------------------------------------------------

    for (const artist of parsedArtists) {
      if (!artist.name?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Every virtual room artist must have a name",
        });
      }

      artist.name = artist.name.trim();

      artist.biography =
        artist.biography?.trim() || "";

      artist.artistStatement =
        artist.artistStatement?.trim() || "";
    }

    // -------------------------------------------------
    // Validate artworks
    // -------------------------------------------------

    for (const artwork of parsedArtworks) {
      if (!artwork.title?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Every virtual room artwork must have a title",
        });
      }

      if (!artwork.image?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Every virtual room artwork must have an image",
        });
      }

      if (!artwork.artistName?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Every virtual room artwork must have an artist name",
        });
      }

      artwork.title =
        artwork.title.trim();

      artwork.artistName =
        artwork.artistName.trim();

      artwork.story =
        artwork.story?.trim() || "";

      artwork.medium =
        artwork.medium?.trim() || "";

      artwork.dimensions =
        artwork.dimensions?.trim() || "";
    }

    // -------------------------------------------------
    // Cover image
    // -------------------------------------------------

    const coverFile =
      req.files?.coverImage?.[0];

    const coverImage =
      coverFile?.path || "";

    const coverCloudinaryId =
      coverFile?.filename || "";

      // -------------------------------------------------
// Welcome background image
// -------------------------------------------------

const welcomeBackgroundFile =
  req.files?.welcomeBackgroundImage?.[0];

const welcomeBackgroundImage =
  welcomeBackgroundFile?.path || "";

const welcomeBackgroundCloudinaryId =
  welcomeBackgroundFile?.filename || "";

    // -------------------------------------------------
    // Create Virtual Room
    // -------------------------------------------------

    const virtualRoom =
      await VirtualRoom.create({
        title: title.trim(),

        description:
          description?.trim() || "",

        coverImage,

        coverCloudinaryId,

        welcomeBackgroundImage,

        welcomeBackgroundCloudinaryId,

        artists: parsedArtists,

        artworks: parsedArtworks,

        theme:
  ["luxury", "modern", "dark"].includes(theme)
    ? theme
    : "luxury",

        status:
          status === "published"
            ? "published"
            : "draft",
      });

    res.status(201).json({
      success: true,
      message:
        "Virtual room created successfully",

      virtualRoom,
    });
  } catch (error) {
    console.error(
      "CREATE VIRTUAL ROOM ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create virtual room",
    });
  }
};

// =====================================================
// ADMIN: UPDATE VIRTUAL ROOM
// =====================================================

const updateVirtualRoom = async (req, res) => {
  try {
    console.log(
      "UPDATE VIRTUAL ROOM BODY:",
      req.body
    );

    console.log(
      "UPDATE VIRTUAL ROOM FILES:",
      req.files
    );

    const virtualRoom =
      await VirtualRoom.findById(req.params.id);

    if (!virtualRoom) {
      return res.status(404).json({
        success: false,
        message: "Virtual room not found",
      });
    }

    const {
      title,
      description,
      artists,
      artworks,
      theme,
      status,
    } = req.body || {};

    // -------------------------------------------------
    // Update title
    // -------------------------------------------------

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Virtual room title is required",
        });
      }

      virtualRoom.title =
        title.trim();
    }

    // -------------------------------------------------
    // Update description
    // -------------------------------------------------

    if (description !== undefined) {
      virtualRoom.description =
        description.trim();
    }

    // -------------------------------------------------
    // Update artists
    // -------------------------------------------------

    if (artists !== undefined) {
      let parsedArtists;

      try {
        parsedArtists =
          typeof artists === "string"
            ? JSON.parse(artists)
            : artists;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid virtual room artists data",
        });
      }

      if (!Array.isArray(parsedArtists)) {
        parsedArtists = [];
      }

      for (const artist of parsedArtists) {
        console.log(
  "ARTIST YEAR RECEIVED:",
  artist.name,
  artist.year
);

        if (!artist.name?.trim()) {
          return res.status(400).json({
            success: false,
            message:
              "Every virtual room artist must have a name",
          });
        }

        artist.name =
          artist.name.trim();

        artist.biography =
          artist.biography?.trim() || "";

        artist.artistStatement =
          artist.artistStatement?.trim() || "";
      }

      virtualRoom.artists =
        parsedArtists;
    }

    // -------------------------------------------------
    // Update artworks
    // -------------------------------------------------

    if (artworks !== undefined) {
      let parsedArtworks;

      try {
        parsedArtworks =
          typeof artworks === "string"
            ? JSON.parse(artworks)
            : artworks;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid virtual room artworks data",
        });
      }

      if (!Array.isArray(parsedArtworks)) {
        parsedArtworks = [];
      }

      for (const artwork of parsedArtworks) {
        if (!artwork.title?.trim()) {
          return res.status(400).json({
            success: false,
            message:
              "Every virtual room artwork must have a title",
          });
        }

        if (!artwork.image?.trim()) {
          return res.status(400).json({
            success: false,
            message:
              "Every virtual room artwork must have an image",
          });
        }

        if (!artwork.artistName?.trim()) {
          return res.status(400).json({
            success: false,
            message:
              "Every virtual room artwork must have an artist name",
          });
        }

        artwork.title =
          artwork.title.trim();

        artwork.artistName =
          artwork.artistName.trim();

        artwork.story =
          artwork.story?.trim() || "";

        artwork.medium =
          artwork.medium?.trim() || "";

        artwork.dimensions =
          artwork.dimensions?.trim() || "";
      }

      virtualRoom.artworks =
        parsedArtworks;
    }
// -------------------------------------------------
// Update theme
// -------------------------------------------------

if (theme !== undefined) {
  if (
    theme !== "luxury" &&
    theme !== "modern" &&
    theme !== "dark"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid virtual room theme",
    });
  }

  virtualRoom.theme = theme;
}
    // -------------------------------------------------
    // Update status
    // -------------------------------------------------

    if (status !== undefined) {
      if (
        status !== "draft" &&
        status !== "published"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid virtual room status",
        });
      }

      virtualRoom.status =
        status;
    }

    // -------------------------------------------------
    // Replace cover image
    // -------------------------------------------------

    const newCoverFile =
      req.files?.coverImage?.[0];

    if (newCoverFile) {
      const oldCoverCloudinaryId =
        virtualRoom.coverCloudinaryId;

      virtualRoom.coverImage =
        newCoverFile.path;

      virtualRoom.coverCloudinaryId =
        newCoverFile.filename;

      if (oldCoverCloudinaryId) {
        try {
          const deleteResult =
            await cloudinary.uploader.destroy(
              oldCoverCloudinaryId
            );

          console.log(
            "OLD VIRTUAL ROOM COVER DELETE RESULT:",
            deleteResult
          );
        } catch (cloudinaryError) {
          console.error(
            "ERROR DELETING OLD VIRTUAL ROOM COVER:",
            cloudinaryError
          );
        }
      }
    }
// -------------------------------------------------
// Replace welcome background image
// -------------------------------------------------

const newWelcomeBackgroundFile =
  req.files?.welcomeBackgroundImage?.[0];

if (newWelcomeBackgroundFile) {
  const oldWelcomeBackgroundCloudinaryId =
    virtualRoom.welcomeBackgroundCloudinaryId;

  virtualRoom.welcomeBackgroundImage =
    newWelcomeBackgroundFile.path;

  virtualRoom.welcomeBackgroundCloudinaryId =
    newWelcomeBackgroundFile.filename;

  if (oldWelcomeBackgroundCloudinaryId) {
    try {
      const deleteResult =
        await cloudinary.uploader.destroy(
          oldWelcomeBackgroundCloudinaryId
        );

      console.log(
        "OLD VIRTUAL ROOM WELCOME BACKGROUND DELETE RESULT:",
        deleteResult
      );
    } catch (cloudinaryError) {
      console.error(
        "ERROR DELETING OLD VIRTUAL ROOM WELCOME BACKGROUND:",
        cloudinaryError
      );
    }
  }
}
    // -------------------------------------------------
    // Save
    // -------------------------------------------------

    await virtualRoom.save();

    res.status(200).json({
      success: true,
      message:
        "Virtual room updated successfully",

      virtualRoom,
    });
  } catch (error) {
    console.error(
      "UPDATE VIRTUAL ROOM ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update virtual room",
    });
  }
};

// =====================================================
// ADMIN: DELETE VIRTUAL ROOM
// =====================================================

const deleteVirtualRoom = async (req, res) => {
  try {
    const virtualRoom =
      await VirtualRoom.findById(req.params.id);

    if (!virtualRoom) {
      return res.status(404).json({
        success: false,
        message: "Virtual room not found",
      });
    }

    // -------------------------------------------------
    // Delete cover image from Cloudinary
    // -------------------------------------------------

    if (virtualRoom.coverCloudinaryId) {
      try {
        const deleteResult =
          await cloudinary.uploader.destroy(
            virtualRoom.coverCloudinaryId
          );

        console.log(
          "VIRTUAL ROOM COVER DELETE RESULT:",
          deleteResult
        );
      } catch (cloudinaryError) {
        console.error(
          "ERROR DELETING VIRTUAL ROOM COVER:",
          cloudinaryError
        );
      }
    }
// -------------------------------------------------
// Delete welcome background image from Cloudinary
// -------------------------------------------------

if (virtualRoom.welcomeBackgroundCloudinaryId) {
    try {
        const deleteResult =
            await cloudinary.uploader.destroy(
                virtualRoom.welcomeBackgroundCloudinaryId
            );

        console.log(
            "VIRTUAL ROOM WELCOME BACKGROUND DELETE RESULT:",
            deleteResult
        );
    } catch (cloudinaryError) {
        console.error(
            "ERROR DELETING VIRTUAL ROOM WELCOME BACKGROUND:",
            cloudinaryError
        );
    }
}
    // -------------------------------------------------
    // Delete artist profile images
    // -------------------------------------------------

    for (const artist of virtualRoom.artists) {
      if (artist.profileCloudinaryId) {
        try {
          const deleteResult =
            await cloudinary.uploader.destroy(
              artist.profileCloudinaryId
            );

          console.log(
            "VIRTUAL ARTIST IMAGE DELETE RESULT:",
            deleteResult
          );
        } catch (cloudinaryError) {
          console.error(
            "ERROR DELETING VIRTUAL ARTIST IMAGE:",
            cloudinaryError
          );
        }
      }
    }

    // -------------------------------------------------
    // Delete artwork images
    // -------------------------------------------------

    for (const artwork of virtualRoom.artworks) {
      if (artwork.cloudinaryId) {
        try {
          const deleteResult =
            await cloudinary.uploader.destroy(
              artwork.cloudinaryId
            );

          console.log(
            "VIRTUAL ARTWORK IMAGE DELETE RESULT:",
            deleteResult
          );
        } catch (cloudinaryError) {
          console.error(
            "ERROR DELETING VIRTUAL ARTWORK IMAGE:",
            cloudinaryError
          );
        }
      }
    }

    // -------------------------------------------------
    // Delete database document
    // -------------------------------------------------

    await VirtualRoom.findByIdAndDelete(
      virtualRoom._id
    );

    res.status(200).json({
      success: true,
      message:
        "Virtual room deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE VIRTUAL ROOM ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to delete virtual room",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getPublishedVirtualRoom,
  getPublishedVirtualRooms,
  getAllVirtualRooms,
  getVirtualRoomById,
  createVirtualRoom,
  updateVirtualRoom,
  deleteVirtualRoom,
};