// controllers/invoiceController.js
const Invoice = require('../models/Invoice');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Create Invoice
exports.createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate Invoice PDF
exports.generateInvoicePDF = async (req, res) => {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });
  
      // Define the invoices directory
      const invoicesDir = path.join(__dirname, '../invoices');
      
      // Check if the directory exists, if not, create it
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }
  
      // Define the file path
      const pdfPath = path.join(invoicesDir, `invoice_${invoice.id}.pdf`);
      const doc = new PDFDocument();
  
      // Stream the PDF to a file
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);
  
      doc.fontSize(16).text(`Invoice #${invoice.id}`);
      doc.text(`Customer: ${invoice.customer_name}`);
      doc.text(`Amount: $${invoice.amount}`);
      doc.text(`Status: ${invoice.status}`);
      doc.end();
  
      // Wait for the PDF to finish writing before sending the response
      writeStream.on('finish', () => {
        res.download(pdfPath);
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Delete Invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    await invoice.destroy();
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
