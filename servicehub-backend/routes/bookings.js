// routes/bookings.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

// user: create booking
router.post("/", auth, createBooking);

// user: my bookings
router.get("/", auth, getUserBookings);

// provider: bookings for my services
router.get("/provider", auth, getProviderBookings);

// provider/admin: update booking status
router.put("/:id/status", auth, updateBookingStatus);

module.exports = router;
