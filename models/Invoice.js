// models/Invoice.js
const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const Invoice = sequelize.define('invoice', {
  user_id: { type: DataTypes.INTEGER, allowNull: true }, // Nullable foreign key for user
  organization_id: { type: DataTypes.INTEGER, allowNull: true }, // Nullable foreign key for organization
  customer_name: { type: DataTypes.STRING, allowNull: false },
  invoice_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  currency: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  due_date: { type: DataTypes.DATEONLY, allowNull: false },
  purchase_order: { type: DataTypes.STRING, allowNull: true },
  reference: { type: DataTypes.STRING, allowNull: true },
  project: { type: DataTypes.STRING, allowNull: true },
  warehouse: { type: DataTypes.STRING, allowNull: true },
  line_items: {
    type: DataTypes.JSON, // Storing line items in JSON format
    allowNull: false,
    defaultValue: [],
  },
  total_amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'draft' },
});

module.exports = Invoice;