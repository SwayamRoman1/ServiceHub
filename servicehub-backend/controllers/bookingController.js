const Booking = require("../models/Booking");

// Create booking
const createBooking = async (req, res) => {
  const { provider, service, scheduledAt } = req.body;
  const booking = await Booking.create({
    user: req.user._id,
    provider,
    service,
    scheduledAt,
  });
  res.status(201).json(booking);
};

// Get bookings for user
const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("provider")
    .populate("service");
  res.json(bookings);
};

// Update booking status
const updateBooking = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(booking);
};

module.exports = { createBooking, getUserBookings, updateBooking };
