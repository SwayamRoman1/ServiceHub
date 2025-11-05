// controllers/providerController.js
const ServiceProvider = require("../models/ServiceProvider");
const Service = require("../models/Service"); // ✅ use the singular model

// GET /api/providers
exports.getAll = async (_req, res) => {
  const providers = await ServiceProvider.find()
    .populate("user")
    .populate("services"); // refs "Service" in ServiceProvider.js
  res.json(providers);
};

// PUT /api/providers/:id  (admin only via routes)
exports.update = async (req, res) => {
  const p = await ServiceProvider.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .populate("user")
    .populate("services");
  if (!p) return res.status(404).json({ message: "Provider not found" });
  res.json(p);
};

// DELETE /api/providers/:id  (admin only via routes)
exports.remove = async (req, res) => {
  const p = await ServiceProvider.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ message: "Provider not found" });

  // Optionally clean up their services too:
  await Service.deleteMany({ provider: p._id });

  res.json({ message: "Provider deleted" });
};
