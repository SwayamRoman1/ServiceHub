const ServiceProvider = require("../models/ServiceProvider");
const Services = require("../models/Services");
const User = require("../models/User");

// Get all providers with services populated
const getProviders = async (req, res) => {
  const providers = await ServiceProvider.find()
    .populate("user")
    .populate("services");
  res.json(providers);
};

// Admin: update provider
const updateProvider = async (req, res) => {
  const provider = await ServiceProvider.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(provider);
};

// Admin: delete provider
const deleteProvider = async (req, res) => {
  await ServiceProvider.findByIdAndDelete(req.params.id);
  res.json({ message: "Provider deleted" });
};

module.exports = { getProviders, updateProvider, deleteProvider };
