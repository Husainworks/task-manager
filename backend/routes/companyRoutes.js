const express = require("express");
const { registerCompany } = require("../controllers/companyController");

const router = express.Router();

// Auth Routes
router.post("/register", registerCompany);

module.exports = router;
