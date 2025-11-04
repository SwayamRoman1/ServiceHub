const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema(
  {
    totalUsers: { type: Number, default: 0 },
    totalProviders: { type: Number, default: 0 },
    totalServices: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Dashboard || mongoose.model("Dashboard", dashboardSchema);
