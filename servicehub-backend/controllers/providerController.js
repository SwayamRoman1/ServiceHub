// controllers/providerController.js
const ServiceProvider = require("../models/ServiceProvider");
// Ensure the Services model is registered (belt-and-suspenders)
require("../models/Services");
const User = require("../models/User");

// GET /api/providers — list providers with user + services
const getProviders = async (_req, res) => {
  const providers = await ServiceProvider.find()
    .populate({ path: "user", model: "User" })
    .populate({ path: "services", model: "Services" });
  res.json(providers);
};

// PUT /api/providers/:id — admin or owner
const updateProvider = async (req, res) => {
  if (req.user.role !== "admin") {
    const own = await ServiceProvider.findOne({ user: req.user._id });
    if (!own || String(own._id) !== String(req.params.id)) {
      return res.status(403).json({ message: "Not allowed" });
    }
  }

  const provider = await ServiceProvider.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(provider);
};

// DELETE /api/providers/:id — admin only
const deleteProvider = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  await ServiceProvider.findByIdAndDelete(req.params.id);
  res.json({ message: "Provider deleted" });
};

module.exports = { getProviders, updateProvider, deleteProvider };
