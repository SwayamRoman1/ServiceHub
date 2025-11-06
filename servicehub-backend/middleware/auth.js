// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ correct casing

module.exports = async function auth(req, res, next) {
  try {
    const hdr = req.header("Authorization") || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("auth middleware error:", err.message || err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
