// controllers/serviceController.js
const Service = require("../models/Service");
const ServiceProvider = require("../models/ServiceProvider");

// Public: list all services
exports.getAll = async (_req, res) => {
  const services = await Service.find().populate({
    path: "provider",
    populate: { path: "user" },
  });
  res.json(services);
};

// Provider/Admin: create service
exports.create = async (req, res) => {
  const can = req.user.role === "provider" || req.user.role === "admin";
  if (!can) return res.status(403).json({ message: "Only providers/admin" });

  // ensure there is a ServiceProvider doc for this user
  let sp = await ServiceProvider.findOne({ user: req.user._id });
  if (!sp) {
    // auto-create for old accounts created before we added this behavior
    sp = await ServiceProvider.create({ user: req.user._id });
  }

  const {
    name,
    description = "",
    price = 0,
    category = "General",
    image,
  } = req.body;
  if (!name?.trim())
    return res.status(400).json({ message: "Name is required" });

  const service = await Service.create({
    name: name.trim(),
    description,
    price,
    category,
    image,
    provider: sp._id,
  });

  sp.services.push(service._id);
  await sp.save();

  const withPop = await Service.findById(service._id).populate({
    path: "provider",
    populate: { path: "user" },
  });

  res.status(201).json(withPop);
};

// Provider/Admin: my services
exports.getMine = async (req, res) => {
  const can = req.user.role === "provider" || req.user.role === "admin";
  if (!can) return res.status(403).json({ message: "Only providers/admin" });

  let sp = await ServiceProvider.findOne({ user: req.user._id });
  if (!sp) {
    // return empty; UI will prompt to add the first service (and we’ll autoinit SP on create)
    return res.json([]);
  }
  const services = await Service.find({ provider: sp._id });
  res.json(services);
};

// Provider/Admin: update
exports.update = async (req, res) => {
  const service = await Service.findById(req.params.id).populate("provider");
  if (!service) return res.status(404).json({ message: "Service not found" });

  const sp = await ServiceProvider.findOne({ user: req.user._id });
  const owns = sp && String(service.provider?._id) === String(sp._id);
  const can = owns || req.user.role === "admin";
  if (!can) return res.status(403).json({ message: "Forbidden" });

  const { name, description, price, category, image } = req.body;
  if (name !== undefined) service.name = String(name).trim();
  if (description !== undefined) service.description = description;
  if (price !== undefined) service.price = price;
  if (category !== undefined) service.category = category;
  if (image !== undefined) service.image = image;

  await service.save();
  res.json(service);
};

// Provider/Admin: delete
exports.remove = async (req, res) => {
  const service = await Service.findById(req.params.id).populate("provider");
  if (!service) return res.status(404).json({ message: "Service not found" });

  const sp = await ServiceProvider.findOne({ user: req.user._id });
  const owns = sp && String(service.provider?._id) === String(sp._id);
  const can = owns || req.user.role === "admin";
  if (!can) return res.status(403).json({ message: "Forbidden" });

  await service.deleteOne();
  // also pull from provider.services array (cleanup)
  if (owns) {
    await ServiceProvider.updateOne(
      { _id: sp._id },
      { $pull: { services: service._id } }
    );
  }
  res.json({ message: "Service deleted" });
};
