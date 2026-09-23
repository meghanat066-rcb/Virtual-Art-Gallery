const Artwork = require("../models/Artwork");
const Notification = require("../models/Notification");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

// Upload artwork
// Upload artwork
const uploadArtwork = async (req, res) => {
    try {
        const {
            title,
            category,
            artistName,
            story,
            medium,
            year,
            dimensions,
            orientation,
            framed,
            shipsFrom,
            price,
            replicaAvailable,
            replicaPrices,
            availability,
        } = req.body;

        // =========================================
        // BASIC VALIDATION
        // =========================================

        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Artwork title is required",
            });
        }

        if (!category?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Artwork category is required",
            });
        }

        if (!artistName?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Artist name is required",
            });
        }

        if (!story?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Artwork story is required",
            });
        }

        if (!medium?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Artwork medium is required",
            });
        }

        if (!year) {
            return res.status(400).json({
                success: false,
                message: "Artwork year is required",
            });
        }

        if (!dimensions?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Artwork dimensions are required",
            });
        }

        if (!orientation?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Artwork orientation is required",
            });
        }

        if (!framed?.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Please specify whether the artwork is framed",
            });
        }

        if (!shipsFrom?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Ships from location is required",
            });
        }

        const originalImage = req.files?.image?.[0];
        const replicaImage = req.files?.replicaImage?.[0];


if (!originalImage) {
  return res.status(400).json({
    success: false,
    message: "Artwork image is required",
  });
}

        // =========================================
        // YEAR VALIDATION
        // =========================================

        const numericYear = Number(year);
        const currentYear = new Date().getFullYear();

        if (
            Number.isNaN(numericYear) ||
            numericYear < 1000 ||
            numericYear > currentYear
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid artwork year",
            });
        }

        // =========================================
        // ORIGINAL PRICE
        // =========================================

        if (
            price === undefined ||
            price === null ||
            price === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Original artwork price is required",
            });
        }

        const numericPrice = Number(price);

        if (
            Number.isNaN(numericPrice) ||
            numericPrice < 1
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid original artwork price",
            });
        }

        // =========================================
        // AVAILABILITY
        // =========================================

        const selectedAvailability =
            availability?.trim() || "Available";

        const allowedAvailability = [
            "Available",
            "Sold",
            "Reserved",
        ];

        if (
            !allowedAvailability.includes(
                selectedAvailability
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Availability must be Available, Sold, or Reserved",
            });
        }

        // =========================================
        // REPLICA AVAILABILITY
        // =========================================

        const hasReplicas =
            replicaAvailable === true ||
            replicaAvailable === "true";

        // =========================================
        // DEFAULT REPLICA STRUCTURE
        // =========================================

        let parsedReplicaPrices = {
            small: {
                dimensions: "40 × 30 cm",
                price: null,
                available: false,
            },

            medium: {
                dimensions: "60 × 45 cm",
                price: null,
                available: false,
            },

            large: {
                dimensions: "90 × 60 cm",
                price: null,
                available: false,
            },

            xl: {
                dimensions: "120 × 90 cm",
                price: null,
                available: false,
            },
        };

        // =========================================
        // PROCESS REPLICA PRICES
        // =========================================

        if (hasReplicas) {

            if (!replicaPrices) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please provide replica size and price information",
                });
            }
            if (!replicaImage) {
    return res.status(400).json({
        success: false,
        message: "Please upload a replica image",
    });
}

            try {
                const parsed =
                    typeof replicaPrices === "string"
                        ? JSON.parse(replicaPrices)
                        : replicaPrices;

                const sizes = [
                    {
                        key: "small",
                        dimensions: "40 × 30 cm",
                    },
                    {
                        key: "medium",
                        dimensions: "60 × 45 cm",
                    },
                    {
                        key: "large",
                        dimensions: "90 × 60 cm",
                    },
                    {
                        key: "xl",
                        dimensions: "120 × 90 cm",
                    },
                ];

                for (const size of sizes) {

                    const value = parsed[size.key];

                    if (
                        value !== undefined &&
                        value !== null &&
                        value !== ""
                    ) {

                        // =================================
                        // OBJECT FORMAT
                        // { price, available }
                        // =================================

                        if (
                            typeof value === "object"
                        ) {

                            const rawPrice =
                                value.price;

                            const available =
                                value.available === true ||
                                value.available === "true";

                            if (
                                rawPrice !== undefined &&
                                rawPrice !== null &&
                                rawPrice !== ""
                            ) {

                                const numericReplicaPrice =
                                    Number(rawPrice);

                                if (
                                    Number.isNaN(
                                        numericReplicaPrice
                                    ) ||
                                    numericReplicaPrice < 1
                                ) {
                                    return res.status(400).json({
                                        success: false,
                                        message:
                                            `Invalid ${size.key} replica price`,
                                    });
                                }

                                parsedReplicaPrices[
                                    size.key
                                ] = {
                                    dimensions:
                                        size.dimensions,

                                    price:
                                        numericReplicaPrice,

                                    available:
                                        available,
                                };
                            }
                        }

                        // =================================
                        // SIMPLE NUMBER FORMAT
                        // =================================

                        else {

                            const numericReplicaPrice =
                                Number(value);

                            if (
                                Number.isNaN(
                                    numericReplicaPrice
                                ) ||
                                numericReplicaPrice < 1
                            ) {
                                return res.status(400).json({
                                    success: false,
                                    message:
                                        `Invalid ${size.key} replica price`,
                                });
                            }

                            parsedReplicaPrices[
                                size.key
                            ] = {
                                dimensions:
                                    size.dimensions,

                                price:
                                    numericReplicaPrice,

                                available: true,
                            };
                        }
                    }
                }

            } catch (error) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid replica prices format",
                });
            }

            // =========================================
            // AT LEAST ONE REPLICA SIZE REQUIRED
            // =========================================

            const availableReplicaSizes = [
                parsedReplicaPrices.small,
                parsedReplicaPrices.medium,
                parsedReplicaPrices.large,
                parsedReplicaPrices.xl,
            ].filter(
                (item) =>
                    item.available &&
                    item.price !== null
            );

            if (availableReplicaSizes.length === 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please provide at least one replica size and price",
                });
            }
        }

        // =========================================
        // CREATE ARTWORK
        // =========================================

        const artwork = await Artwork.create({

            // -----------------------------------------
            // BASIC INFORMATION
            // -----------------------------------------

            title: title.trim(),

            description: "",

            story: story.trim(),

            artistStatement: "",

            category: category.trim(),

            medium: medium.trim(),

            year: numericYear,

            dimensions: dimensions.trim(),

            orientation: orientation.trim(),

            framed: framed.trim(),

            shipsFrom: shipsFrom.trim(),

            // -----------------------------------------
            // ORIGINAL SELLING INFORMATION
            // -----------------------------------------

            price: numericPrice,

            availability:
                selectedAvailability,

            // -----------------------------------------
            // REPLICA INFORMATION
            // -----------------------------------------

            replicaAvailable:
                hasReplicas,

            replicaPrices:
                hasReplicas
                    ? parsedReplicaPrices
                    : undefined,

            // -----------------------------------------
            // ARTIST
            // -----------------------------------------

            artistName:
                artistName.trim(),

            uploadedBy:
                req.user._id,

            // -----------------------------------------
            // IMAGE
            // -----------------------------------------

            image: originalImage.path,
cloudinaryId: originalImage.filename,

replicaImage: replicaImage?.path || "",
replicaCloudinaryId: replicaImage?.filename || "",
            // -----------------------------------------
            // ADMIN APPROVAL
            // -----------------------------------------

            status: "pending",
        });

      

        // =========================================
        // RESPONSE
        // =========================================

        return res.status(201).json({
            success: true,

            message:
                "Artwork submitted for admin approval",

            artwork,
        });

    } catch (error) {

        console.error(
            "Upload artwork error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                error.message ||
                "Something went wrong while uploading the artwork",
        });
    }
};
// Get approved artworks for gallery
const getAllArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find({ status: "approved" })
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      artworks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get logged-in user's uploaded artworks
const getMyArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find({ uploadedBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      artworks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateArtworkStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be approved or rejected",
      });
    }

    const artwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    await Notification.create({
      user: artwork.uploadedBy,
      artwork: artwork._id,
      status,
      message:
        status === "approved"
          ? `Your artwork "${artwork.title}" has been approved.`
          : `Your artwork "${artwork.title}" has been rejected.`,
    });

    res.status(200).json({
      success: true,
      message: `Artwork ${status} successfully`,
      artwork,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const toggleLikeArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = artwork.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      artwork.likes = artwork.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      artwork.likes.push(req.user._id);
    }

    await artwork.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked
        ? "Artwork unliked successfully"
        : "Artwork liked successfully",
      liked: !alreadyLiked,
      likeCount: artwork.likes.length,
      likes: artwork.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findOne({
      _id: req.params.id,
      status: "approved",
    }).populate(
      "uploadedBy",
      "name email role"
    );

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Approved artwork not found",
      });
    }

    // -----------------------------------------
    // BUILD REPLICA OPTIONS FROM ORIGINAL ARTWORK
    // -----------------------------------------

    const replicas = [];

    if (artwork.replicaAvailable) {
      const replicaSizes = [
        {
          key: "small",
          name: "Small",
        },
        {
          key: "medium",
          name: "Medium",
        },
        {
          key: "large",
          name: "Large",
        },
        {
          key: "xl",
          name: "XL",
        },
      ];

      replicaSizes.forEach((size) => {
        const replica =
          artwork.replicaPrices?.[size.key];

        if (
          replica &&
          replica.available &&
          replica.price !== null &&
          replica.price !== undefined
        ) {
          replicas.push({
            key: size.key,
            name: size.name,
            dimensions: replica.dimensions,
            price: replica.price,
            image: artwork.image,
            artistName: artwork.artistName,
            originalArtwork: artwork._id,
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      artwork,
      replicas,
    });

  } catch (error) {

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid artwork ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get approved replicas of an original artwork
const getArtworkReplicas = async (req, res) => {
  try {
    const originalArtwork = await Artwork.findOne({
      _id: req.params.id,
      artworkType: "Original",
      status: "approved",
    });

    if (!originalArtwork) {
      return res.status(404).json({
        success: false,
        message: "Original artwork not found",
      });
    }

    const replicas = await Artwork.find({
      originalArtwork: originalArtwork._id,
      artworkType: "Replica",
      status: "approved",
    })
      .select(
        "title image artistName dimensions price availability artworkType originalArtwork"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      replicas,
    });

  } catch (error) {

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid artwork ID",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get all pending artworks for admin
const getPendingArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find({ status: "pending" })
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      artworks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get all artworks for admin
const getAllArtworksForAdmin = async (req, res) => {
  try {
    const artworks = await Artwork.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      artworks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update artwork
const updateArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(
      req.params.id
    );

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    const isOwner =
      artwork.uploadedBy.toString() ===
      req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to edit this artwork",
      });
    }

    const {
  title,
  description,
  story,
  category,
  medium,
  year,
  dimensions,
  orientation,
  framed,
  shipsFrom,
  availability,
  artistName,
  price,
  replicaAvailable,
  replicaPrices,
} = req.body;

    const originalImage = req.files?.image?.[0];

    const replicaImage = req.files?.replicaImage?.[0];

    console.log("UPDATE ORIGINAL IMAGE:", originalImage);
console.log("UPDATE REPLICA IMAGE:", replicaImage);

    console.log("UPDATE ARTWORK BODY:", req.body);

    if (
  !title?.trim() ||
  !category?.trim() ||
  !medium?.trim() ||
  !year ||
  !dimensions?.trim() ||
  !availability ||
  !artistName?.trim() ||
  price === "" ||
  price === undefined
) {
      return res.status(400).json({
        success: false,
        message: "All artwork fields are required",
      });
    }

    const numericPrice = Number(price);
    const numericYear = Number(year);
    const currentYear = new Date().getFullYear();

    let parsedReplicaPrices = {
  small: {
    price: null,
    available: false,
  },
  medium: {
    price: null,
    available: false,
  },
  large: {
    price: null,
    available: false,
  },
  xl: {
    price: null,
    available: false,
  },
};

if (replicaPrices) {
  try {
    parsedReplicaPrices =
      typeof replicaPrices === "string"
        ? JSON.parse(replicaPrices)
        : replicaPrices;
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid replica price data",
    });
  }
}

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid artwork price",
      });
    }

    if (
      Number.isNaN(numericYear) ||
      numericYear < 1000 ||
      numericYear > currentYear
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid artwork year",
      });
    }

    const allowedAvailability = [
      "Available",
      "Sold",
      "Reserved",
    ];

    if (
      !allowedAvailability.includes(availability)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Availability must be Available, Sold, or Reserved",
      });
    }

    artwork.title = title.trim();
    artwork.description = description.trim();
    artwork.story = story?.trim() || "";
    artwork.category = category.trim();
    artwork.medium = medium.trim();
    artwork.year = numericYear;
    artwork.dimensions = dimensions.trim();
    artwork.orientation = orientation?.trim() || "Portrait";
    artwork.framed = framed?.trim() || "Yes";
    artwork.shipsFrom = shipsFrom?.trim() || "India";
    artwork.availability = availability;
    artwork.artistName = artistName.trim();
    artwork.price = numericPrice;

    artwork.replicaAvailable =
  replicaAvailable === true ||
  replicaAvailable === "true";

artwork.replicaPrices = parsedReplicaPrices;

    if (replicaImage) {
  artwork.replicaImage = replicaImage.path;
  artwork.replicaCloudinaryId = replicaImage.filename;
}
if (originalImage) {
  artwork.image = originalImage.path;
  artwork.cloudinaryId = originalImage.filename;
}
    await artwork.save();

    res.status(200).json({
      success: true,
      message: "Artwork updated successfully",
      artwork,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    const isOwner =
      artwork.uploadedBy.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this artwork",
      });
    }

    await artwork.deleteOne();

    res.status(200).json({
      success: true,
      message: "Artwork deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get diverse approved artworks for the Home page
const getFeaturedArtworks = async (req, res) => {
  try {
    const preferredCategories = [
      "Paintings",
      "Sculptures",
      "Ceramics",
      "Digital Art",
      "Photography",
    ];

    const approvedArtworks = await Artwork.find({
      status: "approved",
      category: { $in: preferredCategories },
    })
      .sort({ createdAt: -1 });

    const selectedArtworks = [];
    const selectedCategories = new Set();

    for (const artwork of approvedArtworks) {
      if (
        !selectedCategories.has(artwork.category) &&
        selectedArtworks.length < 4
      ) {
        selectedArtworks.push(artwork);
        selectedCategories.add(artwork.category);
      }
    }

    if (selectedArtworks.length < 4) {
      for (const artwork of approvedArtworks) {
        const alreadySelected = selectedArtworks.some(
          (selected) =>
            selected._id.toString() === artwork._id.toString()
        );

        if (
          !alreadySelected &&
          selectedArtworks.length < 4
        ) {
          selectedArtworks.push(artwork);
        }
      }
    }

    res.status(200).json({
      success: true,
      artworks: selectedArtworks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load curated artworks",
    });
  }
};
// Get artists for Virtual Tour
const getVirtualTourArtists = async (req, res) => {
  try {
    const artists = await User.find({
      role: "artist",
    })
      .select("name  profileImage biography")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      artists,
    });
  } catch (error) {
    console.error(
      "Get Virtual Tour artists error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load artists",
    });
  }
};
module.exports = {
  uploadArtwork,
  getAllArtworks,
  getArtworkById,
  getArtworkReplicas,
  getMyArtworks,
  getPendingArtworks,
  getAllArtworksForAdmin,
  updateArtworkStatus,
  toggleLikeArtwork,
  updateArtwork,
  deleteArtwork,
  getFeaturedArtworks,
  getVirtualTourArtists,
};