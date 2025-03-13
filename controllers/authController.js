const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, contact, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ firstName, lastName, email, contact, password: hashedPassword });

    res.status(201).json({ msg: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Login user and return JWT
 * @route POST /api/auth/login
 * @access Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get user profile
 * @route GET /api/auth/profile
 * @access Private
 */
exports.getProfile = async (req, res) => {
  try {
    // Fetch user based on ID from JWT
    const user = await User.findByPk(req.user.id, { 
      attributes: ["id", "firstName", "lastName", "email", "contact"] 
    });

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
