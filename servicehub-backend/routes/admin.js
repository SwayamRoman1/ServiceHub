// routes/admin.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Service = require("../models/Service");
const ServiceProvider = require("../models/ServiceProvider");
const Booking = require("../models/Booking");
const User = require("../models/User");

// simple admin-only guard (after auth)
const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    return next({ status: 403, message: "Admin only" });
  }
  next();
};

router.use(auth, requireAdmin);

// Stats (used by dashboard if you want)
router.get("/stats", async (_req, res) => {
  const [users, providers, services, bookings] = await Promise.all([
    User.countDocuments(),
    ServiceProvider.countDocuments(),
    Service.countDocuments(),
    Booking.countDocuments(),
  ]);
  res.json({ users, providers, services, bookings });
});

// One-time repair: backfill Service.provider for legacy data
router.post("/repair/services-provider", async (_req, res) => {
  const missing = await Service.find({
    $or: [{ provider: { $exists: false } }, { provider: null }],
  });

  let fixed = 0;
  for (const s of missing) {
    const sp = await ServiceProvider.findOne({ services: s._id });
    if (sp) {
      s.provider = sp._id;
      await s.save();
      fixed++;
    }
  }

  res.json({ scanned: missing.length, fixed });
});

module.exports = router;
