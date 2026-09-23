const Exhibition = require("../models/Exhibition");
const User = require("../models/User");
const Artwork = require("../models/Artwork");
const { cloudinary } = require("../config/cloudinary");

// Get all published exhibitions
const getPublishedExhibitions = async (req, res) => {
  try {
    const exhibitions = await Exhibition.find({
      status: "published",
    })
      .populate("artists", "name profileImage biography artistStatement")
      .populate(
        "artworks",
        "title artistName image category medium year price availability"
      )
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      exhibitions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Unable to load exhibitions",
    });
  }
};

// Get one published exhibition
const getExhibitionById = async (req, res) => {
  try {
    const exhibition = await Exhibition.findOne({
      _id: req.params.id,
      status: "published",
    })
      .populate(
        "artists",
        "name profileImage biography artistStatement artistJourneyVideo"
      )
      .populate(
        "artworks",
        [
          "title",
          "description",
          "story",
          "artistStatement",
          "category",
          "medium",
          "year",
          "dimensions",
          "orientation",
          "framed",
          "shipsFrom",
          "availability",
          "price",
          "artistName",
          "image",
          "uploadedBy",
        ].join(" ")
      );

    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: "Exhibition not found",
      });
    }

    res.status(200).json({
      success: true,
      exhibition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Unable to load exhibition",
    });
  }
};

// Admin: Get all exhibitions
const getAllExhibitions = async (req, res) => {
  try {
    const exhibitions = await Exhibition.find()
      .populate("artists", "name email")
      .populate("artworks", "title artistName image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      exhibitions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Unable to load exhibitions",
    });
  }
};

// Admin: Get one exhibition
const getAdminExhibitionById = async (req, res) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id)
      .populate(
        "artists",
        "name email profileImage biography artistStatement artistJourneyVideo"
      )
      .populate(
        "artworks",
        [
          "title",
          "description",
          "story",
          "artistStatement",
          "category",
          "medium",
          "year",
          "dimensions",
          "orientation",
          "framed",
          "shipsFrom",
          "availability",
          "price",
          "artistName",
          "image",
          "uploadedBy",
        ].join(" ")
      );

    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: "Exhibition not found",
      });
    }

    res.status(200).json({
      success: true,
      exhibition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Unable to load exhibition",
    });
  }
};
// Admin: Create exhibition
const createExhibition = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      title,
      subtitle,
      description,
      exhibitionPurpose,
      startDate,
      endDate,
      location,
      address,
      openingTimes,
      visitorInformation,
      artists,
      artworks,
      status,
      exhibitionType,
      featured,
      video,
    } = req.body || {};
    // ============================================
    // COVER IMAGE
    // ============================================

    const coverFile =
      req.files?.coverImage?.[0];

      const uploadedOverview = req.files?.overviewImage?.[0];

    const uploadedCoverImage =
      coverFile?.path || "";

    const uploadedCoverCloudinaryId =
      coverFile?.filename || "";

      const uploadedOverviewImage =
  req.files?.overviewImage?.[0]?.path || "";

const uploadedOverviewCloudinaryId =
  req.files?.overviewImage?.[0]?.filename || "";

    // ============================================
    // INSTALLATION IMAGES
    // ============================================

    const uploadedInstallationImages =
      (req.files?.installationShots || []).map(
        (file) => ({
          image: file.path,
          cloudinaryId: file.filename,
        })
      );

    // ============================================
    // BASIC VALIDATION
    // ============================================

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Exhibition title is required",
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Exhibition dates are required",
      });
    }

    if (
      new Date(endDate) <
      new Date(startDate)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "End date cannot be earlier than start date",
      });
    }

    // ============================================
    // NORMALIZE ARTISTS
    // ============================================

    let selectedArtists = [];

    if (artists) {
      selectedArtists = Array.isArray(artists)
        ? artists
        : [artists];
    }

    // ============================================
    // NORMALIZE ARTWORKS
    // ============================================

    let selectedArtworks = [];

    if (artworks) {
      selectedArtworks = Array.isArray(artworks)
        ? artworks
        : [artworks];
    }

    // ============================================
    // VALIDATE ARTISTS
    // ============================================

    if (selectedArtists.length > 0) {
      const validArtists =
        await User.find({
          _id: {
            $in: selectedArtists,
          },
          role: "artist",
        }).select("_id");

      if (
        validArtists.length !==
        selectedArtists.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "One or more selected artists are invalid",
        });
      }
    }
    // ============================================
    // VALIDATE ARTWORKS
    // ============================================

    if (selectedArtworks.length > 0) {
      const validArtworks =
        await Artwork.find({
          _id: {
            $in: selectedArtworks,
          },
          status: "approved",
        }).select("_id");

      if (
        validArtworks.length !==
        selectedArtworks.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only approved artworks can be added to an exhibition",
        });
      }
    }

    // ============================================
    // CREATE EXHIBITION
    // ============================================

    const exhibition =
      await Exhibition.create({
        title: title.trim(),

        subtitle:
          subtitle?.trim() || "",

        description:
          description?.trim() || "",

        exhibitionPurpose:
          exhibitionPurpose?.trim() || "",

        coverImage:
          uploadedCoverImage,

        coverCloudinaryId:
          uploadedCoverCloudinaryId,

        overviewImage: 
           uploadedOverview?.path || "",

        overviewCloudinaryId:
            uploadedOverview?.filename || "",  

        installationShots:
          uploadedInstallationImages,

        startDate,

        endDate,

        location:
          location?.trim() || "",

        address:
          address?.trim() || "",

        openingTimes:
          openingTimes?.trim() || "",

        visitorInformation:
          visitorInformation?.trim() || "",

        artists:
          selectedArtists,

        artworks:
          selectedArtworks,

        status:
          status || "draft",

        exhibitionType:
          exhibitionType || "current",


        featured:
          featured === "true",

        video: video || {
          url: "",
          title: "",
        },
      });

    // ============================================
    // RESPONSE
    // ============================================

    res.status(201).json({
      success: true,
      message:
        "Exhibition created successfully",
      exhibition,
    });

  } catch (error) {
    console.error(
      "CREATE EXHIBITION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create exhibition",
    });
  }
};
// Admin: Update exhibition
const updateExhibition = async (req, res) => {
  try {
    console.log("UPDATE BODY:", req.body);
    console.log("UPDATE FILES:", req.files);

    const exhibition =
      await Exhibition.findById(req.params.id);

    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: "Exhibition not found",
      });
    }

    const {
      title,
      subtitle,
      description,
      exhibitionPurpose,
      startDate,
      endDate,
      location,
      address,
      openingTimes,
      visitorInformation,
      artists,
      artworks,
      status,
      featured,
      video,
    } = req.body || {};

    // ============================================
    // BASIC INFORMATION
    // ============================================

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Exhibition title is required",
        });
      }

      exhibition.title = title.trim();
    }

    if (subtitle !== undefined) {
      exhibition.subtitle =
        subtitle.trim();
    }

    if (description !== undefined) {
      exhibition.description =
        description.trim();
    }

    if (
      exhibitionPurpose !== undefined
    ) {
      exhibition.exhibitionPurpose =
        exhibitionPurpose.trim();
    }

    // ============================================
    // DATES
    // ============================================

    if (startDate !== undefined) {
      exhibition.startDate = startDate;
    }

    if (endDate !== undefined) {
      exhibition.endDate = endDate;
    }

    if (
      exhibition.startDate &&
      exhibition.endDate &&
      new Date(exhibition.endDate) <
        new Date(exhibition.startDate)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "End date cannot be earlier than start date",
      });
    }

    // ============================================
    // LOCATION
    // ============================================

    if (location !== undefined) {
      exhibition.location =
        location.trim();
    }

    if (address !== undefined) {
      exhibition.address =
        address.trim();
    }

    if (openingTimes !== undefined) {
      exhibition.openingTimes =
        openingTimes.trim();
    }

    if (
      visitorInformation !== undefined
    ) {
      exhibition.visitorInformation =
        visitorInformation.trim();
    }

    // ============================================
    // ARTISTS
    // ============================================

    if (artists !== undefined) {
      exhibition.artists =
        Array.isArray(artists)
          ? artists
          : [artists];
    }

    // ============================================
    // ARTWORKS
    // ============================================

    if (artworks !== undefined) {
      exhibition.artworks =
        Array.isArray(artworks)
          ? artworks
          : [artworks];
    }

    // ============================================
    // PUBLISHING
    // ============================================

    if (status !== undefined) {
      exhibition.status = status;
    }

    if (featured !== undefined) {
      exhibition.featured =
        featured === true ||
        featured === "true";
    }
    // ============================================
    // VIDEO
    // ============================================

    if (video !== undefined) {
      exhibition.video = video;
    }

    // ============================================
    // NEW COVER IMAGE
    // ============================================

    const newCoverFile =
      req.files?.coverImage?.[0];

    if (newCoverFile) {
      const oldCoverCloudinaryId =
        exhibition.coverCloudinaryId;

      exhibition.coverImage =
        newCoverFile.path;

      exhibition.coverCloudinaryId =
        newCoverFile.filename;

      if (oldCoverCloudinaryId) {
        try {
          const deleteResult =
            await cloudinary.uploader.destroy(
              oldCoverCloudinaryId
            );

          console.log(
            "OLD COVER DELETE RESULT:",
            deleteResult
          );
        } catch (cloudinaryError) {
          console.error(
            "ERROR DELETING OLD COVER:",
            cloudinaryError
          );
        }
      }
    }
// ============================================
// UPDATE OVERVIEW IMAGE
// ============================================
const newOverviewFile =
  req.files?.overviewImage?.[0];

if (newOverviewFile) {

  const oldOverviewCloudinaryId =
    exhibition.overviewCloudinaryId;

  exhibition.overviewImage =
    newOverviewFile.path;

  exhibition.overviewCloudinaryId =
    newOverviewFile.filename;

  if (oldOverviewCloudinaryId) {
    try {

      const deleteResult =
        await cloudinary.uploader.destroy(
          oldOverviewCloudinaryId
        );

      console.log(
        "OLD OVERVIEW DELETE RESULT:",
        deleteResult
      );

    } catch (cloudinaryError) {

      console.error(
        "ERROR DELETING OLD OVERVIEW IMAGE:",
        cloudinaryError
      );

    }
  }
}
    // ============================================
    // INSTALLATION IMAGES
    // ============================================

    const newInstallationFiles =
      req.files?.installationShots || [];

    if (newInstallationFiles.length > 0) {
      const newInstallationImages =
        newInstallationFiles.map(
          (file) => ({
            image: file.path,
            cloudinaryId:
              file.filename,
          })
        );

      exhibition.installationShots =
        newInstallationImages;
    }

    // ============================================
    // SAVE
    // ============================================

    await exhibition.save();

    // ============================================
    // RETURN UPDATED EXHIBITION
    // ============================================

    const updatedExhibition =
      await Exhibition.findById(
        exhibition._id
      )
        .populate(
          "artists",
          "name email profileImage biography artistStatement"
        )
        .populate(
          "artworks",
          "title artistName image"
        );

    res.status(200).json({
      success: true,
      message:
        "Exhibition updated successfully",
      exhibition:
        updatedExhibition,
    });

  } catch (error) {
    console.error(
      "UPDATE EXHIBITION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update exhibition",
    });
  }
};
// Admin: Delete exhibition
const deleteExhibition = async (req, res) => {
  try {
    const exhibition =
      await Exhibition.findById(req.params.id);

    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: "Exhibition not found",
      });
    }

    await Exhibition.findByIdAndDelete(
      exhibition._id
    );

    res.status(200).json({
      success: true,
      message: "Exhibition deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Unable to delete exhibition",
    });
  }
};

module.exports = {
  getPublishedExhibitions,
  getExhibitionById,
  getAllExhibitions,
  getAdminExhibitionById,
  createExhibition,
  updateExhibition,
  deleteExhibition,
};