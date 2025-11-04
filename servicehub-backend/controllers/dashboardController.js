const Dashboard = require("../models/dashboard");
const Service = require("../models/services");
const Booking = require("../models/booking");
const User = require("../models/user");
const ServiceProvider = require("../models/serviceprovider");
const Grievance = require("../models/grievance");

// ✅ Get dashboard data for both user & provider
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalUsers = await User.countDocuments();
    const totalProviders = await ServiceProvider.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();

    if (req.user.role === "provider") {
      const myServices = await Service.find({ provider: userId });
      const myBookings = await Booking.find({ provider: userId }).populate(
        "user"
      );
      return res.json({
        type: "provider",
        totalUsers,
        totalProviders,
        totalServices,
        totalBookings,
        myServices,
        myBookings,
      });
    } else {
      const myBookings = await Booking.find({ user: userId }).populate(
        "service"
      );
      const grievances = await Grievance.find({ user: userId });
      return res.json({
        type: "user",
        totalUsers,
        totalProviders,
        totalServices,
        totalBookings,
        myBookings,
        grievances,
      });
    }
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};

// ✅ Provider adds a new service
exports.addService = async (req, res) => {
  try {
    if (req.user.role !== "provider") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, description, price, category } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newService = await Service.create({
      name,
      description,
      price,
      category,
      provider: req.user.id,
    });

    res
      .status(201)
      .json({ message: "Service added successfully", service: newService });
  } catch (error) {
    console.error("Add Service error:", error);
    res.status(500).json({ message: "Failed to add service" });
  }
};

// ✅ Provider: Get their services
exports.getProviderServices = async (req, res) => {
  try {
    if (req.user.role !== "provider") {
      return res.status(403).json({ message: "Access denied" });
    }
    const services = await Service.find({ provider: req.user.id });
    res.json(services);
  } catch (error) {
    console.error("Provider Services error:", error);
    res.status(500).json({ message: "Error fetching services" });
  }
};

// ✅ User books a service
exports.bookService = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { serviceId } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const booking = await Booking.create({
      user: req.user.id,
      provider: service.provider,
      service: serviceId,
      status: "pending",
    });

    res.status(201).json({ message: "Service booked successfully", booking });
  } catch (error) {
    console.error("Book Service error:", error);
    res.status(500).json({ message: "Failed to book service" });
  }
};

// ✅ User: Get their bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "service"
    );
    res.json(bookings);
  } catch (error) {
    console.error("User Bookings error:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};
