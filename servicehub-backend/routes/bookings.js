const express = require("express");
const router = express.Router();
const { createBooking, getUserBookings, updateBooking } = require("../controllers/bookingController");
const auth = require("../middleware/auth");

router.post("/", auth, createBooking);
router.get("/", auth, getUserBookings);
router.put("/:id", auth, updateBooking);

module.exports = router;
