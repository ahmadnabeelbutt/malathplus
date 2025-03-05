// models/Invoice.js
const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const Invoice = sequelize.define('Invoice', {
  customer_name: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'unpaid' },
});

module.exports = Invoice;
