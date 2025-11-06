// models/ServiceProvider.js
const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // This MUST reference the model name "Services" (plural)
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Services" }],

    experience: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    photo: { type: String },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ServiceProvider ||
  mongoose.model("ServiceProvider", serviceProviderSchema);
