const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Define One-to-Many Relationship
User.hasMany(Organization, { foreignKey: "userId", onDelete: "CASCADE" });
Organization.belongsTo(User, { foreignKey: "userId" });

module.exports = Organization;
