// models/Invoice.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');  // Import User model
const Organization = require('./Organization');  // Import Organization model

const Invoice = sequelize.define('Invoice', {
  invoice_id: { 
    type: DataTypes.UUID, // UUID as the primary unique identifier for the invoice
    defaultValue: DataTypes.UUIDV4,  // Automatically generate a UUID if not provided
    primaryKey: true,  // Set as the primary key of the invoice
  },
  user_id: { 
    type: DataTypes.UUID, // Use UUID for foreign key to User
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  organization_id: {
    type: DataTypes.UUID, // Use UUID for foreign key to Organization
    allowNull: false,
    references: {
      model: Organization,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure invoice_number is unique
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  purchase_order: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  project: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  warehouse: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  line_items: {
    type: DataTypes.JSON, // Storing line items in JSON format
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidLineItems(value) {
        if (!Array.isArray(value)) {
          throw new Error('Line items must be an array.');
        }
      },
    },
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'canceled'),
    defaultValue: 'draft',
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Define associations
User.hasMany(Invoice, { foreignKey: 'user_id' });
Organization.hasMany(Invoice, { foreignKey: 'organization_id' });
Invoice.belongsTo(User, { foreignKey: 'user_id' });
Invoice.belongsTo(Organization, { foreignKey: 'organization_id' });

module.exports = Invoice;
