const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Organization = sequelize.define("Organization", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numberOfEmployees: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  baseCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, // Will store the image URL
    allowNull: true, // Optional field
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Organization;
