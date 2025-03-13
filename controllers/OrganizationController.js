const Organization = require("../models/Organization");

/**
 * @desc Add a new organization
 * @route POST /api/organizations
 * @access Private
 */
exports.addOrganization = async (req, res) => {
  try {
    const { companyName, industry, numberOfEmployees, baseCurrency, country, image } = req.body;
    const userId = req.user.id;

    const organization = await Organization.create({
      companyName,
      industry,
      numberOfEmployees,
      baseCurrency,
      country,
      image, // Save image URL
      userId,
    });

    res.status(201).json({ msg: "Organization created successfully", organization });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * @desc Get all organizations of a user
 * @route GET /api/organizations
 * @access Private
 */
exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll({ where: { userId: req.user.id } });

    res.json(organizations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Update an organization
 * @route PUT /api/organizations/:id
 * @access Private
 */
exports.updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    let organization = await Organization.findOne({ where: { id, userId } });
    if (!organization) return res.status(404).json({ msg: "Organization not found" });

    await organization.update(req.body);

    res.json({ msg: "Organization updated successfully", organization });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Delete an organization
 * @route DELETE /api/organizations/:id
 * @access Private
 */
exports.deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const organization = await Organization.findOne({ where: { id, userId } });
    if (!organization) return res.status(404).json({ msg: "Organization not found" });

    await organization.destroy();

    res.json({ msg: "Organization deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
