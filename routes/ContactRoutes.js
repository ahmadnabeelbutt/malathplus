// routes/ContactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');


/**
 * 
 *  CONTACT ROUTES
 * 
 */
router.post('/createcontact', contactController.createContact);
router.get('/getcontacts', contactController.getAllContacts);
router.get('/getContactByOrg/:organization_id', contactController. getContactsByOrganization);

/**
 * 
 *  ------ ROUTES
 * 
 */

module.exports = router;