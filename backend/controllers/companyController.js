const Company = require("../models/Company");

const registerCompany = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists" });
    }

    // Create new company
    const newCompany = new Company({ name, teams: [] });
    await newCompany.save();

    res.status(201).json({
      message: "Company registered successfully",
      company: newCompany,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerCompany,
};
