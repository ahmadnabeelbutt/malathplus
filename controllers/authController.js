const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendEmail");
const speakeasy = require("speakeasy"); // For OTP generation
const twilio = require("twilio"); // For SMS sending
require("dotenv").config();


// Twilio configuration
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;  // Your Twilio phone number

// Send OTP SMS function
const sendOtpSMS = (phoneNumber, otp) => {
  return twilioClient.messages.create({
    body: `Your OTP code is ${otp}`,
    from: twilioPhoneNumber,
    to: phoneNumber
  });
};


/**
 * @desc Check if user exists by email
 * @route POST /api/auth/check-user-exists
 * @access Public
 */
exports.checkUserExists = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(200).json({ msg: "User already exists" });
    } else {
      return res.status(200).json({ msg: "User does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


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

    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    user = await User.create({ 
      firstName, 
      lastName, 
      email, 
      contact, 
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });
    // Generate email verification link
    const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;

    // Send email
    await sendVerificationEmail(email, verificationLink);

    res.status(201).json({ msg: "User registered. Verification email sent.", user, verificationLink });
    //res.status(201).json({ msg: "User registered successfully", user });
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

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    /*
    // Generate OTP secret and OTP code
    const secret = speakeasy.generateSecret({ length: 20 });
    const otp = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });

    // Store OTP secret in the user record
    user.otpSecret = secret.base32;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expiration time (5 minutes)
    await user.save();
    console.log(user.contact);
    // Send OTP via SMS
    await sendOtpSMS(user.contact, otp); // Assuming you have a utility to send OTP via SMS

    res.json({ msg: "OTP sent to your phone. Please enter it to proceed." });

    */
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    // Return the JWT token and user info
    res.json({ token, user });
  } catch (error) {
    //console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Verify OTP and login user (returns JWT)
 * @route POST /api/auth/verify-otp
 * @access Public
 */
exports.verifyOtpAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Verify the OTP entered by the user
    const isValidOtp = speakeasy.totp.verify({
      secret: user.otpSecret,
      encoding: 'base32',
      token: otp,
      window: 1  // Adjust time window as needed
    });

    if (!isValidOtp) return res.status(400).json({ msg: "Invalid OTP" });

    // OTP is valid, now generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Clear OTP secret after successful verification
    user.otpSecret = null; // Or store it securely in DB if needed for future reference
    await user.save();

    // Return the JWT token and user info
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

/**
 * @desc Verify user's email
 * @route GET /api/auth/verify-email
 * @access Public
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Find user by token
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null; // Remove token after verification
    await user.save();

    res.json({ msg: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


