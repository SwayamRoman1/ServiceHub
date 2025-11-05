// controllers/bookingController.js
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const ServiceProvider = require("../models/ServiceProvider");

// User: create booking
exports.create = async (req, res) => {
  if (req.user.role !== "user")
    return res.status(403).json({ message: "User only" });

  const { serviceId, scheduledAt } = req.body;
  const service = await Service.findById(serviceId);
  if (!service) return res.status(404).json({ message: "Service not found" });

  // Some legacy services might not have provider set — try to infer
  let providerId = service.provider;
  if (!providerId) {
    const inferred = await ServiceProvider.findOne({ services: service._id });
    if (!inferred) {
      return res.status(400).json({
        message:
          "Service has no provider linked. Ask provider to re-save the service.",
      });
    }
    providerId = inferred._id;
  }

  const booking = await Booking.create({
    user: req.user._id,
    provider: providerId,
    service: service._id,
    scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
  });

  res.status(201).json(booking);
};

// User: my bookings
exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("service")
    .sort({ createdAt: -1 });
  res.json(bookings);
};

// Provider/Admin: bookings for my services
exports.getProviderBookings = async (req, res) => {
  if (req.user.role !== "provider" && req.user.role !== "admin")
    return res.status(403).json({ message: "Provider/admin only" });

  const sp = await ServiceProvider.findOne({ user: req.user._id });
  if (!sp) return res.json([]);

  const bookings = await Booking.find({ provider: sp._id })
    .populate("service")
    .populate("user")
    .sort({ createdAt: -1 });

  res.json(bookings);
};

// Provider/Admin: update status
exports.updateStatus = async (req, res) => {
  const { status } = req.body; // accepted, completed, cancelled, pending
  const booking = await Booking.findById(req.params.id).populate("provider");
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const sp = await ServiceProvider.findOne({ user: req.user._id });
  const owns = sp && String(booking.provider?._id) === String(sp._id);
  const can = owns || req.user.role === "admin";
  if (!can) return res.status(403).json({ message: "Forbidden" });

  if (!["pending", "accepted", "completed", "cancelled"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  booking.status = status;
  await booking.save();
  res.json(booking);
};

// Admin: all bookings
exports.getAll = async (_req, res) => {
  const bookings = await Booking.find()
    .populate("service")
    .populate("user")
    .populate("provider");
  res.json(bookings);
};
