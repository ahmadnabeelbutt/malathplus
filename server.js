const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const InvoiceRoutes = require("./routes/InvoiceRoutes");
const OraganizationRoutes = require("./routes/OrganizationRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/invoice", InvoiceRoutes);
app.use("/api/organization", OraganizationRoutes);

app.get("/", (req, res) => {
  res.send("API is running.......");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Connect to database and sync tables
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected!");

    // Sync models (this creates the `users` table if it doesn't exist)
    await sequelize.sync({ alter: true }); 
    console.log("✅ Database synced successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});
