const express = require("express");
const {
  updateUserProfile,
  getUserProfile,
  loginUser,
  registerUser,
  uploadUserImage,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.post("/upload-image", upload.single("image"), uploadUserImage);

module.exports = router;
