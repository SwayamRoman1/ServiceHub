const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Services || mongoose.model("Services", servicesSchema);
