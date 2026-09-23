const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "artist", "admin"],
      default: "user",
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artwork",
      },
    ],

    // Artist profile information
    profileImage: {
      type: String,
      default: "",
    },

    userProfileImage: {
    type: String,
    default: "",
},

    biography: {
      type: String,
      default: "",
      trim: true,
      maxlength: 6000,
    },

    artistStatement: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
    artistJourneyVideo: {
    type: String,
    default: "",
    trim: true,
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);