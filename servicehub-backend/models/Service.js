// models/Service.js
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    category: { type: String, default: "General" },
    // IMPORTANT: this references the ServiceProvider collection
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    rating: { type: Number, default: 4.5 },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);
