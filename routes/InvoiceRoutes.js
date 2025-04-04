const express = require("express");
const { addInvoice, getInvoices, updateInvoice, deleteInvoice, getOrganizationInvoices, getInvoiceById } = require("../controllers/InvoiceController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes
router.post("/add", authMiddleware, addInvoice); // Add Invoice
router.get("/get", authMiddleware, getInvoices); // Get User's Invoices
router.put("/update/:id", authMiddleware, updateInvoice); // Update Invoice
router.delete("/delete/:id", authMiddleware, deleteInvoice); // Delete Invoice

// New Routes
router.get("/getOrganizationInvoices", authMiddleware, getOrganizationInvoices); // Get all invoices for user's organization
router.get("/getInvoiceById/:id", authMiddleware, getInvoiceById); // Get invoice by its ID

module.exports = router;
