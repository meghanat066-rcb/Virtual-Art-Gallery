const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
      required: true,
    },

    // NEW
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    paymentMethod: {
      type: String,
      default: "Demo Card Payment",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Successful", "Failed"],
      default: "Successful",
    },

    // NEW
    orderStatus: {
      type: String,
      enum: [
        "Confirmed",
        "Processing",
        "Completed",
        "Cancelled",
      ],
      default: "Confirmed",
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    // NEW
    shippingAddress: {
      type: String,
      default: "",
    },

    // NEW
    phoneNumber: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// One user cannot purchase the same artwork twice
purchaseSchema.index(
  {
    artwork: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Purchase",
  purchaseSchema
);