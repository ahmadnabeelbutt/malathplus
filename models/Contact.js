const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Contact = sequelize.define("Contact", {

  contact_id: { 
    type: DataTypes.UUID, // UUID as the primary unique identifier for the invoice
    defaultValue: DataTypes.UUIDV4,  // Automatically generate a UUID if not provided
    primaryKey: true,  // Set as the primary key of the invoice
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