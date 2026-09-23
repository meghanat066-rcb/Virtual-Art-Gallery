const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const artworkRoutes = require("./routes/artworkRoutes");
const commentRoutes = require("./routes/commentRoutes");
const artistRoutes = require("./routes/artistRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const exhibitionRoutes = require("./routes/exhibitionRoutes");
const virtualRoomRoutes = require("./routes/virtualRoomRoutes");

dotenv.config();
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/artworks", artworkRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/exhibitions", exhibitionRoutes);
app.use("/api/virtual-rooms", virtualRoomRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/artists", artistRoutes);
const path = require("path");

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
console.log("artistRoutes:", typeof artistRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("Virtual Art Gallery Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});