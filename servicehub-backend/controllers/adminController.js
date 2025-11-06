const User = require("../models/User");
const Service = require("../models/Services");
const ServiceProvider = require("../models/ServiceProvider");
const Booking = require("../models/Booking");
const Grievance = require("../models/Grievance");

exports.stats = async (_req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProviders = await ServiceProvider.countDocuments();
  const totalServices = await Service.countDocuments();
  const totalBookings = await Booking.countDocuments();
  res.json({ totalUsers, totalProviders, totalServices, totalBookings });
};

exports.users = async (_req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.services = async (_req, res) => {
  const items = await Service.find().populate("provider");
  res.json(items);
};

exports.providers = async (_req, res) => {
  const items = await ServiceProvider.find()
    .populate("user")
    .populate("services");
  res.json(items);
};

exports.bookings = async (_req, res) => {
  const items = await Booking.find()
    .populate("service")
    .populate("user")
    .populate("provider");
  res.json(items);
};

exports.grievances = async (_req, res) => {
  const items = await Grievance.find().populate("user");
  res.json(items);
};
