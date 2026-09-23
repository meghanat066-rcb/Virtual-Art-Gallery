const crypto = require("crypto");
const Purchase = require("../models/Purchase");
const Artwork = require("../models/Artwork");

// Complete demo purchase
const createPurchase = async (req, res) => {
  try {
    console.log("NEW PURCHASE CONTROLLER IS RUNNING");
    console.log("PURCHASE BODY:", req.body);
    const {
      artworkId,
      shippingAddress,
      phoneNumber,
    } = req.body;

    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can purchase artworks",
      });
    }

    if (!artworkId) {
      return res.status(400).json({
        success: false,
        message: "Artwork ID is required",
      });
    }

    if (!shippingAddress?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    if (!phoneNumber?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phoneNumber.trim())) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid 10-digit phone number",
      });
    }

    const artwork = await Artwork.findById(artworkId);

    if (!artwork || artwork.status !== "approved") {
      return res.status(404).json({
        success: false,
        message: "Approved artwork not found",
      });
    }

    if (
      artwork.availability &&
      artwork.availability !== "Available"
    ) {
      return res.status(400).json({
        success: false,
        message: `This artwork is currently ${artwork.availability.toLowerCase()}`,
      });
    }

    if (!artwork.price || artwork.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Artwork price is not available",
      });
    }

    if (
      artwork.uploadedBy.toString() ===
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot buy your own artwork",
      });
    }

    const existingPurchase = await Purchase.findOne({
      artwork: artwork._id,
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message:
          "This artwork has already been purchased",
      });
    }

    const transactionId =
      "VAG-" +
      Date.now() +
      "-" +
      crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

     console.log("ARTIST VALUE:", artwork.uploadedBy);
     console.log("PAYMENT STATUS VALUE:", "Successful");   

    const purchase = await Purchase.create({
      buyer: req.user._id,
      artwork: artwork._id,
      artist: artwork.uploadedBy,
      amount: artwork.price,
      paymentMethod: "Demo Card Payment",
      paymentStatus: "Successful",
      orderStatus: "Confirmed",
      transactionId,
      shippingAddress: shippingAddress.trim(),
      phoneNumber: phoneNumber.trim(),
    });

    artwork.availability = "Sold";
    await artwork.save();

    const populatedPurchase =
      await Purchase.findById(purchase._id)
        .populate("buyer", "name email role")
        .populate("artist", "name email role")
        .populate(
          "artwork",
          [
            "title",
            "artistName",
            "image",
            "category",
            "price",
            "availability",
            "uploadedBy",
          ].join(" ")
        );

    res.status(201).json({
      success: true,
      message: "Purchase completed successfully",
      purchase: populatedPurchase,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "This artwork has already been purchased",
      });
    }

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to complete purchase",
    });
  }
};

// Get logged-in user's purchases
const getMyPurchases = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message:
          "Only users can view purchase history",
      });
    }

    const purchases = await Purchase.find({
      buyer: req.user._id,
      paymentStatus: "Successful",
    })
      .populate(
        "artwork",
        [
          "title",
          "artistName",
          "image",
          "category",
          "price",
          "availability",
        ].join(" ")
      )
      .populate("artist", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load purchases",
    });
  }
};
// Admin gets all successful purchases
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      paymentStatus: "Successful",
    })
      .populate("buyer", "name email")
      .populate("artist", "name email")
      .populate(
        "artwork",
        [
          "title",
          "artistName",
          "image",
          "category",
          "price",
          "availability",
        ].join(" ")
      )
      .sort({ createdAt: -1 });

    const totalPurchases = purchases.length;

    const totalAmount = purchases.reduce(
      (total, purchase) =>
        total + Number(purchase.amount || 0),
      0
    );

    const confirmedPurchases = purchases.filter(
      (purchase) =>
        purchase.orderStatus === "Confirmed"
    ).length;

    res.status(200).json({
      success: true,
      purchases,
      summary: {
        totalPurchases,
        totalAmount,
        confirmedPurchases,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load admin purchases",
    });
  }
};
// Get purchases received by logged-in artist
const getMySales = async (req, res) => {
  try {
    if (req.user.role !== "artist") {
      return res.status(403).json({
        success: false,
        message: "Only artists can view sales",
      });
    }

    const sales = await Purchase.find({
      artist: req.user._id,
      paymentStatus: "Successful",
    })
      .populate("buyer", "name email")
      .populate(
        "artwork",
        [
          "title",
          "artistName",
          "image",
          "category",
          "price",
        ].join(" ")
      )
      .sort({ createdAt: -1 });

    const totalSales = sales.length;

    const totalRevenue = sales.reduce(
      (total, sale) => total + Number(sale.amount || 0),
      0
    );

    const completedSales = sales.filter(
      (sale) => sale.orderStatus === "Confirmed"
    ).length;

    res.status(200).json({
      success: true,
      sales,
      summary: {
        totalSales,
        totalRevenue,
        completedSales,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load artist sales",
    });
  }
};
// Admin gets all successful sales
const getAllSales = async (req, res) => {
  try {
    const sales = await Purchase.find({
      paymentStatus: "Successful",
    })
      .populate("buyer", "name email")
      .populate("artist", "name email")
      .populate(
        "artwork",
        [
          "title",
          "artistName",
          "image",
          "category",
          "price",
        ].join(" ")
      )
      .sort({ createdAt: -1 });

    const totalSales = sales.length;

    const totalRevenue = sales.reduce(
      (total, sale) =>
        total + Number(sale.amount || 0),
      0
    );

    const completedSales = sales.filter(
      (sale) => sale.orderStatus === "Confirmed"
    ).length;

    res.status(200).json({
      success: true,
      sales,
      summary: {
        totalSales,
        totalRevenue,
        completedSales,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load admin sales",
    });
  }
};
// Admin deletes one sale
const deleteAdminSale = async (req, res) => {
  try {
    const sale = await Purchase.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    await Purchase.findByIdAndDelete(sale._id);

    res.status(200).json({
      success: true,
      message: "Sale deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to delete sale",
    });
  }
};
// Check whether artwork is already purchased
const checkPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      artwork: req.params.artworkId,
      paymentStatus: "Successful",
    });

    const purchasedByCurrentUser =
      purchase &&
      purchase.buyer.toString() ===
        req.user._id.toString();

    res.status(200).json({
      success: true,
      purchased: Boolean(purchase),
      purchasedByCurrentUser: Boolean(
        purchasedByCurrentUser
      ),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to check purchase status",
    });
  }
};
// Delete one sale from logged-in artist's sales history
const deleteMySale = async (req, res) => {
  try {
    const sale = await Purchase.findOne({
      _id: req.params.id,
      artist: req.user._id,
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    await Purchase.findByIdAndDelete(sale._id);

    res.status(200).json({
      success: true,
      message: "Sale deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to delete sale",
    });
  }
};
// Delete one purchase from logged-in user's purchase history
const deleteMyPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      _id: req.params.id,
      buyer: req.user._id,
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    await Purchase.findByIdAndDelete(purchase._id);

    res.status(200).json({
      success: true,
      message: "Purchase deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to delete purchase",
    });
  }
};
module.exports = {
  createPurchase,
  getMyPurchases,
  getAllPurchases,
  getMySales,
  getAllSales,
  deleteAdminSale,
  checkPurchase,
  deleteMySale,
  deleteMyPurchase,
};