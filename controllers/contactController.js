const Contact = require('../models/Contact');

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const { companyName, country, taxRegistrationNumber, organization_id } = req.body;
    const newContact = await Contact.create({
      companyName,
      country,
      taxRegistrationNumber,
      organization_id
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

exports.getContactsByOrganization = async (req, res) => {
  try {
    const { organization_id } = req.params;

    // Validate organization_id
    if (!organization_id) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    // Fetch contacts by organization_id
    const contacts = await Contact.findAll({
      where: { organization_id },
    });

    res.status(200).json({ success: true, contacts });
  } catch (error) {
    console.error("Error fetching contacts by organization:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};