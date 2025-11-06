// controllers/serviceController.js
const mongoose = require("mongoose");
const Services = require("../models/Services");
const ServiceProvider = require("../models/ServiceProvider");

// GET /api/services
const getServices = async (_req, res) => {
  const services = await Services.find().sort({ createdAt: -1 });
  res.json(services);
};

// GET /api/services/mine (provider only)
const getMyServices = async (req, res) => {
  try {
    if (req.user.role !== "provider" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const providerDoc = await ServiceProvider.findOne({ user: req.user._id });
    if (!providerDoc) return res.json([]);
    const services = await Services.find({ provider: providerDoc._id }).sort({
      createdAt: -1,
    });
    res.json(services);
  } catch (err) {
    console.error("getMyServices error:", err);
    res.status(500).json({ message: "Failed to fetch provider services" });
  }
};

// GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid service id" });
    }
    const service = await Services.findById(id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    console.error("getServiceById error:", err);
    res.status(500).json({ message: "Failed to fetch service" });
  }
};

// POST /api/services  (provider/admin)
const createService = async (req, res) => {
  try {
    if (req.user.role !== "provider" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only providers/admin can add services" });
    }
    const providerDoc = await ServiceProvider.findOne({ user: req.user._id });
    if (!providerDoc)
      return res.status(400).json({ message: "Provider profile not found" });

    const {
      name,
      description = "",
      imageUrl = "",
      location = "",
      price,
      priceMin,
      priceMax,
      rating,
      availableToday = false,
      category = "",
    } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const payload = {
      name,
      description,
      imageUrl,
      location,
      category,
      createdBy: req.user._id,
      provider: providerDoc._id,
      availableToday: !!availableToday,
    };

    if (typeof price === "number") payload.price = price;
    if (typeof priceMin === "number") payload.priceMin = priceMin;
    if (typeof priceMax === "number") payload.priceMax = priceMax;
    if (typeof rating === "number")
      payload.rating = Math.max(0, Math.min(5, rating));

    const created = await Services.create(payload);
    res.status(201).json({ message: "Service created", service: created });
  } catch (err) {
    console.error("createService error:", err);
    res.status(500).json({ message: "Failed to create service" });
  }
};

// PUT /api/services/:id  (owner provider or admin)
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid service id" });
    }
    const svc = await Services.findById(id);
    if (!svc) return res.status(404).json({ message: "Service not found" });

    if (req.user.role === "provider") {
      const providerDoc = await ServiceProvider.findOne({ user: req.user._id });
      if (!providerDoc || String(svc.provider) !== String(providerDoc._id)) {
        return res
          .status(403)
          .json({ message: "Not allowed to modify this service" });
      }
    }

    const fields = [
      "name",
      "description",
      "imageUrl",
      "location",
      "price",
      "priceMin",
      "priceMax",
      "rating",
      "availableToday",
      "category",
    ];
    const update = {};
    for (const f of fields) if (f in req.body) update[f] = req.body[f];

    const updated = await Services.findByIdAndUpdate(id, update, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("updateService error:", err);
    res.status(500).json({ message: "Failed to update service" });
  }
};

// DELETE /api/services/:id  (owner provider or admin)
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid service id" });
    }
    const svc = await Services.findById(id);
    if (!svc) return res.status(404).json({ message: "Service not found" });

    if (req.user.role === "provider") {
      const providerDoc = await ServiceProvider.findOne({ user: req.user._id });
      if (!providerDoc || String(svc.provider) !== String(providerDoc._id)) {
        return res
          .status(403)
          .json({ message: "Not allowed to delete this service" });
      }
    }

    await Services.findByIdAndDelete(id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    console.error("deleteService error:", err);
    res.status(500).json({ message: "Failed to delete service" });
  }
};

module.exports = {
  getServices,
  getMyServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
