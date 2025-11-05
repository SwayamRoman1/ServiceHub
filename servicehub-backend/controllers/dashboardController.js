const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Grievance = require("../models/Grievance");

exports.getDashboardData = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProviders = await ServiceProvider.countDocuments();
  const totalServices = await Service.countDocuments();
  const totalBookings = await Booking.countDocuments();

  let body = { totalUsers, totalProviders, totalServices, totalBookings };

  if (req.user.role === "provider") {
    const sp = await ServiceProvider.findOne({ user: req.user._id });
    const myServices = sp ? await Service.find({ provider: sp._id }) : [];
    const myBookings = sp
      ? await Booking.find({ provider: sp._id }).populate("user service")
      : [];
    body.type = "provider";
    body.myServices = myServices;
    body.myBookings = myBookings;
  } else if (req.user.role === "user") {
    const myBookings = await Booking.find({ user: req.user._id }).populate(
      "service"
    );
    const grievances = await Grievance.find({ user: req.user._id });
    body.type = "user";
    body.myBookings = myBookings;
    body.grievances = grievances;
  } else {
    body.type = "admin";
  }

  res.json(body);
};
