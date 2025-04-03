const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
<<<<<<< HEAD
  name: {
=======
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
>>>>>>> origin/main
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
<<<<<<< HEAD
=======
    validate: {
      isEmail: true,
    },
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isNumeric: true,
    },
>>>>>>> origin/main
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
<<<<<<< HEAD
=======
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // New field to track email verification status
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otpSecret: { // Field to store the OTP secret
    type: DataTypes.STRING,
    allowNull: true,
  },
  otpExpiresAt: { // Optional: Field to store OTP expiration time
    type: DataTypes.DATE,
    allowNull: true,
  },
  otpAttempts: { // Optional: Field to track OTP attempts (e.g., prevent brute force)
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
>>>>>>> origin/main
});

module.exports = User;
