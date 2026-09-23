const mongoose = require("mongoose");

const exhibitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    exhibitionPurpose: {
      type: String,
      default: "",
      trim: true,
    },

    // Main exhibition / cover image
    coverImage: {
      type: String,
      default: "",
    },

    coverCloudinaryId: {
      type: String,
      default: "",
    },

    // Overview image
    overviewImage: {
      type: String,
      default: "",
    },

    overviewCloudinaryId: {
      type: String,
      default: "",
    },

    // Installation photographs
    installationShots: [
      {
        image: {
          type: String,
          required: true,
        },

        cloudinaryId: {
          type: String,
          default: "",
        },
      },
    ],

    // Exhibition video
    video: {
      url: {
        type: String,
        default: "",
      },

      title: {
        type: String,
        default: "",
      },
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    openingTimes: {
      type: String,
      default: "",
      trim: true,
    },

    visitorInformation: {
      type: String,
      default: "",
      trim: true,
    },

    // Artists participating in the normal exhibition
    artists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Approved artworks included in the normal exhibition
    artworks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artwork",
      },
    ],

    // Admin controls whether exhibition is visible
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Exhibition",
  exhibitionSchema
);