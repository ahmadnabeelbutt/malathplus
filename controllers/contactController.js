const Contact = require('../models/Contact');

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const { companyName, country, taxRegistrationNumber } = req.body;
    const newContact = await Contact.create({
      companyName,
      country,
      taxRegistrationNumber,
    });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all contacts
exports.getAllContacts = async (req, res) => {
    try {
      const contacts = await Contact.findAll();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};