const express = require("express");
const { addOrganization, updateOrganization, deleteOrganization, getOrganizations } = require("../controllers/organizationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes
router.post("/add", authMiddleware, addOrganization); // Add Organization
router.get("/get", authMiddleware, getOrganizations); // Get User's Organizations
router.put("/update/:id", authMiddleware, updateOrganization); // Update Organization
router.delete("/delete/:id", authMiddleware, deleteOrganization); // Delete Organization

module.exports = router;
