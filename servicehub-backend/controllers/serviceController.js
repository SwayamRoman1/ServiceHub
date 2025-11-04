const Services = require("../models/Services");

// Get all services
const getServices = async (req, res) => {
  const services = await Services.find();
  res.json(services);
};

// Admin: update service
const updateService = async (req, res) => {
  const service = await Services.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(service);
};

// Admin: delete service
const deleteService = async (req, res) => {
  await Services.findByIdAndDelete(req.params.id);
  res.json({ message: "Service deleted" });
};

module.exports = { getServices, updateService, deleteService };
