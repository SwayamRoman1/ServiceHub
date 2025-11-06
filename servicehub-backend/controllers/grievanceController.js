// controllers/grievanceController.js
const Grievance = require("../models/Grievance");
const ServiceProvider = require("../models/ServiceProvider");

// USER: create a grievance
const createGrievance = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }
    const g = await Grievance.create({
      user: req.user._id,
      title: title.trim(),
      description: description.trim(),
      status: "pending",
    });
    res.status(201).json(g);
  } catch (err) {
    console.error("createGrievance error:", err);
    res.status(500).json({ message: "Failed to submit support request" });
  }
};

// USER: list my grievances
const getMyGrievances = async (req, res) => {
  try {
    const list = await Grievance.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(list);
  } catch (err) {
    console.error("getMyGrievances error:", err);
    res.status(500).json({ message: "Failed to fetch your support requests" });
  }
};

// ADMIN: list all grievances
const getGrievances = async (_req, res) => {
  try {
    const grievances = await Grievance.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.json(grievances);
  } catch (err) {
    console.error("getGrievances error:", err);
    res.status(500).json({ message: "Failed to fetch grievances" });
  }
};

// ADMIN: update (e.g., status)
const updateGrievance = async (req, res) => {
  try {
    const g = await Grievance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!g) return res.status(404).json({ message: "Not found" });
    res.json(g);
  } catch (err) {
    console.error("updateGrievance error:", err);
    res.status(500).json({ message: "Failed to update grievance" });
  }
};

// ADMIN: delete
const deleteGrievance = async (req, res) => {
  try {
    await Grievance.findByIdAndDelete(req.params.id);
    res.json({ message: "Grievance deleted" });
  } catch (err) {
    console.error("deleteGrievance error:", err);
    res.status(500).json({ message: "Failed to delete grievance" });
  }
};

module.exports = {
  createGrievance,
  getMyGrievances,
  getGrievances,
  updateGrievance,
  deleteGrievance,
};
