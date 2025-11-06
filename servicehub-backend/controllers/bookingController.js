// controllers/bookingController.js
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Services = require("../models/Services");
const ServiceProvider = require("../models/ServiceProvider");

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { service: serviceId, scheduledAt } = req.body;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "Invalid service id" });
    }

    const svc = await Services.findById(serviceId);
    if (!svc) return res.status(404).json({ message: "Service not found" });
    if (!svc.provider) {
      return res
        .status(422)
        .json({ message: "Service has no provider assigned" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      provider: svc.provider,
      service: svc._id,
      status: "pending",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// GET /api/bookings  (for current user)
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("getUserBookings error:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// GET /api/bookings/provider  (for current provider)
const getProviderBookings = async (req, res) => {
  try {
    if (req.user.role !== "provider" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const providerDoc = await ServiceProvider.findOne({ user: req.user._id });
    if (!providerDoc) return res.json([]);
    const bookings = await Booking.find({ provider: providerDoc._id })
      .populate("user")
      .populate("service")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("getProviderBookings error:", err);
    res.status(500).json({ message: "Error fetching provider bookings" });
  }
};

// PUT /api/bookings/:id/status  (provider/admin can update)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only the owning provider (or admin) can change it
    if (req.user.role === "provider") {
      const providerDoc = await ServiceProvider.findOne({ user: req.user._id });
      if (
        !providerDoc ||
        String(booking.provider) !== String(providerDoc._id)
      ) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

    const allowed = ["pending", "accepted", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error("updateBookingStatus error:", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
};
