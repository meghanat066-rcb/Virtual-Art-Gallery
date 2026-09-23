const express = require("express");

const router = express.Router();

const {
  createEnquiry,
  getMyEnquiries,
  getAllEnquiries,
  getMyUserEnquiries,
  deleteMyUserEnquiry,
  markEnquiryAsRead,
  markAllEnquiriesAsRead,
  deleteEnquiry,
  replyToEnquiry,
} = require("../controllers/enquiryController");

const {
  protect,
  adminOnly,
  artistOnly,
} = require("../middleware/authMiddleware");


// Visitor sends an enquiry
router.post(
  "/",
  protect,
  createEnquiry
);

router.get(
  "/my-enquiries/user",
  protect,
  getMyUserEnquiries
);
router.delete(
  "/my-enquiries/user/:id",
  protect,
  deleteMyUserEnquiry
);
// Logged-in artist gets their enquiries
router.get(
  "/my-enquiries",
  protect,
  artistOnly,
  getMyEnquiries
);

// Admin gets all enquiries
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllEnquiries
);
// Mark all enquiries as read
router.put(
  "/read-all",
  protect,
  artistOnly,
  markAllEnquiriesAsRead
);

// Artist replies to one enquiry

router.put(

  "/:id/reply",

  protect,

  artistOnly,

  replyToEnquiry

);
// Delete one enquiry
router.delete(
  "/:id",
  protect,
  artistOnly,
  deleteEnquiry
);

// Mark one enquiry as read
router.put(
  "/:id/read",
  protect,
  artistOnly,
  markEnquiryAsRead
);


module.exports = router;