const express = require("express");
const {
  createPurchase,
  getMyPurchases,
  getAllPurchases,
  getMySales,
  getAllSales,
  deleteAdminSale,
  checkPurchase,
  deleteMySale,
  deleteMyPurchase,
} = require("../controllers/purchaseController");

const {
  artistOnly,
} = require("../middleware/authMiddleware");

const { protect, userOnly,  adminOnly,} = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/", protect, userOnly, createPurchase);
router.get("/my-purchases", protect, userOnly,getMyPurchases);
// Admin gets all purchases
router.get(
  "/admin/all-purchases",
  protect,
  adminOnly,
  getAllPurchases
);
router.get(
  "/my-sales",
  protect,
  getMySales
);
// Admin gets all successful sales
router.get(
  "/admin/all-sales",
  protect,
  adminOnly,
  getAllSales
);
// Admin deletes one sale
router.delete(
  "/admin/all-sales/:id",
  protect,
  adminOnly,
  deleteAdminSale
);
router.get("/check/:artworkId", protect, userOnly, checkPurchase);
router.delete(
  "/my-sales/:id",
  protect,
  artistOnly,
  deleteMySale
);
router.delete(
  "/my-purchases/:id",
  protect,
  userOnly,
  deleteMyPurchase
);

module.exports = router;