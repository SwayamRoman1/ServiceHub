// routes/dashboard.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getDashboardData,
  addService,
  getProviderServices,
  bookService,
  getUserBookings,
} = require("../controllers/dashboardController");

// Get dashboard data (user or provider)
router.get("/", auth, getDashboardData);

// Provider: add a new service
router.post("/add-service", auth, addService);

// Provider: list own services
router.get("/provider-services", auth, getProviderServices);

// User: book a service
router.post("/book-service", auth, bookService);

// User: my bookings
router.get("/my-bookings", auth, getUserBookings);

module.exports = router;
