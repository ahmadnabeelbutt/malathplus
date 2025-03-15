// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/InvoiceController');

router.post('/create', invoiceController.createInvoice);
router.get('/getInvoices', invoiceController.getAllInvoices);
router.get('/getInvoiceByOrg/:organization_id', invoiceController.getInvoicesByOrganization);
router.get('/invoices/:id', invoiceController.getInvoiceById);
router.get('/invoices/pdf/:id', invoiceController.generateInvoicePDF);
router.delete('/invoices/:id', invoiceController.deleteInvoice);

module.exports = router;