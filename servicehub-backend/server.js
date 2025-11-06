const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo connection error:", err));

// ✅ Force-load all models BEFORE routes
require("./models/User");
require("./models/Services");
require("./models/ServiceProvider");
require("./models/Booking");
require("./models/Grievance");
require("./models/ChatModel");
require("./models/Dashboard");

// ✅ Import all routes AFTER models are registered
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const serviceRoutes = require("./routes/services");
const providerRoutes = require("./routes/providers");
const bookingRoutes = require("./routes/bookings");
const dashboardRoutes = require("./routes/dashboard");
const chatRoutes = require("./routes/chat");
const grievanceRoutes = require("./routes/grievances");

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/grievances", grievanceRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("ServiceHub API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
