const express = require("express");
const router = express.Router();
const {
  getDashboardData,
  addService,
  getProviderServices,
  bookService,
  getUserBookings,
} = require("../controllers/dashboardController");
const auth = require("../middleware/auth");

// Get dashboard data
router.get("/", auth, getDashboardData);

// Provider: Add a new service
router.post("/add-service", auth, addService);

// Provider: View own services
router.get("/provider-services", auth, getProviderServices);

// User: Book a service
router.post("/book-service", auth, bookService);

// User: View bookings
router.get("/my-bookings", auth, getUserBookings);

module.exports = router;
