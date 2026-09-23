const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema(
  {
    // =========================================
    // BASIC ARTWORK INFORMATION
    // =========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    story: {
      type: String,
      default: "",
    },

    artistStatement: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    medium: {
      type: String,
      default: "",
    },

    year: {
      type: Number,
    },

    // Original artwork dimensions
    dimensions: {
      type: String,
      default: "",
    },

    orientation: {
      type: String,
      default: "Portrait",
    },

    framed: {
      type: String,
      default: "Yes",
    },

    shipsFrom: {
      type: String,
      default: "India",
    },

    // =========================================
    // ORIGINAL ARTWORK
    // =========================================

    price: {
      type: Number,
      min: 1,
      default: null,
    },

    availability: {
      type: String,
      enum: ["Available", "Sold", "Reserved"],
      default: "Available",
    },

    // =========================================
    // REPLICA INFORMATION
    // =========================================

    replicaAvailable: {
      type: Boolean,
      default: false,
    },

    artworkType: {
  type: String,
  enum: ["Original", "Replica"],
  default: "Original",
},

    originalArtwork: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Artwork",
  default: null,
},


    replicaPrices: {
      small: {
        dimensions: {
          type: String,
          default: "40 × 30 cm",
        },

        price: {
          type: Number,
          min: 1,
          default: null,
        },

        available: {
          type: Boolean,
          default: false,
        },
      },

      medium: {
        dimensions: {
          type: String,
          default: "60 × 45 cm",
        },

        price: {
          type: Number,
          min: 1,
          default: null,
        },

        available: {
          type: Boolean,
          default: false,
        },
      },

      large: {
        dimensions: {
          type: String,
          default: "90 × 60 cm",
        },

        price: {
          type: Number,
          min: 1,
          default: null,
        },

        available: {
          type: Boolean,
          default: false,
        },
      },

      xl: {
        dimensions: {
          type: String,
          default: "120 × 90 cm",
        },

        price: {
          type: Number,
          min: 1,
          default: null,
        },

        available: {
          type: Boolean,
          default: false,
        },
      },
    },

    // =========================================
    // ARTIST
    // =========================================

    artistName: {
      type: String,
      required: true,
      trim: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================================
// IMAGES
// =========================================

// Original artwork image
image: {
  type: String,
  required: true,
},

cloudinaryId: {
  type: String,
  required: true,
},

// Replica artwork image
replicaImage: {
  type: String,
  default: "",
},

replicaCloudinaryId: {
  type: String,
  default: "",
},

    // =========================================
    // ADMIN APPROVAL
    // =========================================

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // =========================================
    // LIKES
    // =========================================

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Artwork", artworkSchema);