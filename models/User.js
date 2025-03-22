const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
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
});

module.exports = User;
