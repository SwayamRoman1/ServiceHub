// routes/bookings.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Booking = require("../controllers/bookingController");

const requireAdmin = (req, res, next) =>
  req.user?.role === "admin"
    ? next()
    : res.status(403).json({ message: "Admin only" });

router.post("/", auth, Booking.create);
router.get("/me", auth, Booking.getMyBookings);
router.get("/provider", auth, Booking.getProviderBookings);
router.put("/:id/status", auth, Booking.updateStatus);
router.get("/", auth, requireAdmin, Booking.getAll); // admin-only

module.exports = router;
