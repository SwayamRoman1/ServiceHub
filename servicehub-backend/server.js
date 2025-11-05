// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/providers", require("./routes/providers"));
app.use("/api/services", require("./routes/services"));
app.use("/api/grievances", require("./routes/grievances"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/admin", require("./routes/admin")); // ✅ add this

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
