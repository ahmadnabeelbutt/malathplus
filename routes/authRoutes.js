const express = require("express");
<<<<<<< HEAD
const { registerUser, loginUser, getProfile } = require("../controllers/authController");
=======
const { registerUser, loginUser, getProfile, verifyEmail, checkUserExists } = require("../controllers/authController");
>>>>>>> origin/main
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
<<<<<<< HEAD
router.get("/profile", authMiddleware, getProfile); // Now using controller
=======
router.post("/check-user-exists", checkUserExists);
router.get("/profile", authMiddleware, getProfile); // Now using controller
router.get("/verify-email", verifyEmail);
>>>>>>> origin/main

module.exports = router;
