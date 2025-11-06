// controllers/dashboardController.js
const mongoose = require("mongoose");
const Services = require("../models/Services");
const Booking = require("../models/Booking");
const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");
const Grievance = require("../models/Grievance");

// GET /api/dashboard  (user or provider)
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Global counts (admin-ish overview for everybody)
    const [totalUsers, totalProviders, totalServices, totalBookings] =
      await Promise.all([
        User.countDocuments(),
        ServiceProvider.countDocuments(),
        Services.countDocuments(),
        Booking.countDocuments(),
      ]);

    if (req.user.role === "provider") {
      const providerDoc = await ServiceProvider.findOne({ user: userId });
      const myServices = providerDoc
        ? await Services.find({ provider: providerDoc._id }).sort({
            createdAt: -1,
          })
        : [];

      const myBookings = providerDoc
        ? await Booking.find({ provider: providerDoc._id })
            .populate("user")
            .populate("service")
            .sort({ createdAt: -1 })
        : [];

      return res.json({
        type: "provider",
        totalUsers,
        totalProviders,
        totalServices,
        totalBookings,
        myServices,
        myBookings,
      });
    }

    // customer (user) view
    const myBookings = await Booking.find({ user: userId })
      .populate("service")
      .populate({ path: "provider", model: "ServiceProvider" })
      .sort({ createdAt: -1 });

    const grievances = await Grievance.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.json({
      type: "user",
      totalUsers,
      totalProviders,
      totalServices,
      totalBookings,
      myBookings,
      grievances,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};

// POST /api/dashboard/add-service (provider)
exports.addService = async (req, res) => {
  try {
    if (req.user.role !== "provider" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
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
    res
      .status(201)
      .json({ message: "Service added successfully", service: created });
  } catch (error) {
    console.error("Add Service error:", error);
    res.status(500).json({ message: "Failed to add service" });
  }
};

// GET /api/dashboard/provider-services (provider)
exports.getProviderServices = async (req, res) => {
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
  } catch (error) {
    console.error("Provider Services error:", error);
    res.status(500).json({ message: "Error fetching services" });
  }
};

// POST /api/dashboard/book-service (user)
exports.bookService = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { serviceId, scheduledAt } = req.body;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "Invalid service id" });
    }
    const service = await Services.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (!service.provider) {
      return res
        .status(422)
        .json({ message: "Service has no provider assigned" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      provider: service.provider,
      service: service._id,
      status: "pending",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
    });

    res.status(201).json({ message: "Service booked successfully", booking });
  } catch (error) {
    console.error("Book Service error:", error);
    res.status(500).json({ message: "Failed to book service" });
  }
};

// GET /api/dashboard/my-bookings (user)
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("User Bookings error:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};
