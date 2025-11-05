const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    const user = await User.create({ name, email, password, role });

    if (role === "provider") {
      await ServiceProvider.create({ user: user._id });
    }

    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });
    const token = signToken(user);
    res.json({ token, user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
