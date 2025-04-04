const { Op } = require("sequelize");
const Invoice = require("../models/Invoice");
const Organization = require("../models/Organization");

/**
 * @desc Add a new invoice
 * @route POST /api/invoices/add
 * @access Private
 */
exports.addInvoice = async (req, res) => {
  try {
    const { customer_name, invoice_number, currency, date, due_date, purchase_order, reference, project, warehouse, line_items, total_amount } = req.body;
    const userId = req.user.id;
    
    // Get the user's organization
    const organization = await Organization.findOne({ where: { userId } });
    if (!organization) {
      return res.status(400).json({ msg: "You must have an organization to create invoices" });
    }

    // Create invoice for the organization
    const invoice = await Invoice.create({
      user_id: userId,
      organization_id: organization.id,
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
      status: 'draft', // Default status for newly created invoices
    });

    res.status(201).json({ msg: "Invoice created successfully", invoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all invoices for a user's account
exports.getInvoices = async (req, res) => {
  try {
    const userId = req.user.id;  // Get the authenticated user's ID

    // Fetch all invoices for the user (no organization filtering)
    const invoices = await Invoice.findAll({ where: { user_id: userId } });

    if (!invoices || invoices.length === 0) {
      return res.status(404).json({ msg: "No invoices found for this user." });
    }

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get all invoices for a user's organization
 * @route GET /api/invoices/getOrganizationInvoices
 * @access Private
 */
exports.getOrganizationInvoices = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the user's organization
    const organization = await Organization.findOne({ where: { userId } });
    if (!organization) {
      return res.status(400).json({ msg: "Organization not found" });
    }

    // Fetch invoices related to this organization
    const invoices = await Invoice.findAll({ where: { organization_id: organization.id } });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get a specific invoice by its ID
 * @route GET /api/invoices/getInvoiceById/:id
 * @access Private
 */
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get the user's organization
    const organization = await Organization.findOne({ where: { userId } });
    if (!organization) {
      return res.status(400).json({ msg: "Organization not found" });
    }

    // Fetch the invoice by ID and ensure it's associated with the user's organization
    const invoice = await Invoice.findOne({
      where: { id, organization_id: organization.id },
    });

    if (!invoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Update an invoice
 * @route PUT /api/invoices/update/:id
 * @access Private
 */
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get the user's organization
    const organization = await Organization.findOne({ where: { userId } });
    if (!organization) {
      return res.status(400).json({ msg: "Organization not found" });
    }

    let invoice = await Invoice.findOne({ where: { id, organization_id: organization.id } });
    if (!invoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    // Update the invoice
    await invoice.update(req.body);

    res.json({ msg: "Invoice updated successfully", invoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Delete an invoice
 * @route DELETE /api/invoices/delete/:id
 * @access Private
 */
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get the user's organization
    const organization = await Organization.findOne({ where: { userId } });
    if (!organization) {
      return res.status(400).json({ msg: "Organization not found" });
    }

    const invoice = await Invoice.findOne({ where: { id, organization_id: organization.id } });
    if (!invoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    await invoice.destroy();

    res.json({ msg: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
