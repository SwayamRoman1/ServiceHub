// servicehub-backend/models/Services.js
const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    // keep whatever fields you already use; these are common ones:
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    category: { type: String, default: "General" },
    // If you already have provider in your schema, keep it; otherwise it’s optional.
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider" },
    image: { type: String, default: "" },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "services" } // <- force the collection name
);

// Register primary model name (matches your existing code)
let ServicesModel;
try {
  ServicesModel = mongoose.model("Services");
} catch {
  ServicesModel = mongoose.model("Services", servicesSchema, "services");
}

// ALSO register an alias named "Service" that points to the SAME collection.
// This satisfies any populate or code that uses model: 'Service'.
try {
  mongoose.model("Service");
} catch {
  mongoose.model("Service", servicesSchema, "services");
}

module.exports = ServicesModel;
