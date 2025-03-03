const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database username
  process.env.DB_PASS, // Database password
  {
    host: process.env.DB_HOST, // MySQL server (usually localhost)
    port: process.env.DB_PORT || 3306, // Default MySQL port
    dialect: "mysql", // Change from "postgres" to "mysql"
    logging: false, // Disable logging (optional)
  }
);

sequelize
  .authenticate()
  .then(() => console.log("✅ MySQL Connected"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

module.exports = sequelize;
