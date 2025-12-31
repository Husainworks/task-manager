const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
  getUsers,
  getUserById,
  getTeamMembers,
} = require("../controllers/userController");

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); //Get all users (Admin Only)
router.get("/:id", protect, getUserById); //Get a specific user
// Route to fetch team members
router.get("/team-members/:adminId", protect, getTeamMembers);

module.exports = router;
