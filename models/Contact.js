const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Contact = sequelize.define("Contact", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  organization_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  taxRegistrationNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Contact;