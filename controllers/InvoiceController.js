// controllers/invoiceController.js
const Invoice = require('../models/Invoice');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Create Invoice
exports.createInvoice = async (req, res) => {
  try {
    const {
      customer_name,
      invoice_number,
      currency,
      date,
      due_date,
      purchase_order,
      reference,
      project,
      warehouse,
      line_items,
      total_amount,
      status
    } = req.body;

    // Input validation
    if (!customer_name || !invoice_number || !currency || !date || !due_date || !Array.isArray(line_items) || line_items.length === 0) {
      return res.status(400).json({ message: "Missing required fields or invalid line items" });
    }

    // Validate line items and calculate total amount
   
    const processedItems = line_items.map((item) => {
      if (!item.description || !item.account || !item.quantity || !item.price) {
        throw new Error("Each line item must have description, account, quantity, and price");
      }
     
      return { ...item };
    });

    // Create invoice
    const newInvoice = await Invoice.create({
      customer_name,
      invoice_number,
      currency,
      date,
      due_date,
      purchase_order,
      reference,
      project,
      warehouse,
      line_items: processedItems,
      total_amount,
      status
    });

    res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
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


// Get invoices by organization ID
exports.getInvoicesByOrganization = async (req, res) => {
  try {
    const { organization_id } = req.params;

    // Validate that organization_id is provided
    if (!organization_id) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    // Fetch invoices for the given organization_id
    const invoices = await Invoice.findAll({
      where: { organization_id },
      order: [['date', 'DESC']], // Sort by date in descending order
    });

    res.status(200).json({ success: true, invoices });
  } catch (error) {
    console.error("Error fetching invoices by organization:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
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
