const express = require("express");
const { registerUser, loginUser, getProfile, verifyEmail, checkUserExists } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/check-user-exists", checkUserExists);
router.get("/profile", authMiddleware, getProfile); // Now using controller
router.get("/verify-email", verifyEmail);

module.exports = router;
