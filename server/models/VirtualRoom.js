const mongoose = require("mongoose");

// Separate artist information used only inside the Virtual 3D Room
const virtualRoomArtistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
year: {
  type: Number,
},
    profileImage: {
      type: String,
      default: "",
    },

    profileCloudinaryId: {
      type: String,
      default: "",
    },

    biography: {
      type: String,
      default: "",
      trim: true,
    },

    artistStatement: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

// Separate artwork information used only inside the Virtual 3D Room
const virtualRoomArtworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      default: "",
    },

    story: {
      type: String,
      default: "",
      trim: true,
    },

    artistName: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
    },

    medium: {
      type: String,
      default: "",
      trim: true,
    },

    dimensions: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

// Virtual 3D Room
const virtualRoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    coverCloudinaryId: {
      type: String,
      default: "",
    },
welcomeBackgroundImage: {
  type: String,
  default: "",
},

welcomeBackgroundCloudinaryId: {
  type: String,
  default: "",
},
    artists: [virtualRoomArtistSchema],

    artworks: [virtualRoomArtworkSchema],

    theme: {
  type: String,
  enum: ["luxury", "modern", "dark"],
  default: "luxury",
},

status: {
  type: String,
  enum: ["draft", "published"],
  default: "draft",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VirtualRoom", virtualRoomSchema);