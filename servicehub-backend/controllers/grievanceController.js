// controllers/grievanceController.js
const Grievance = require("../models/Grievance");

const getGrievances = async (_req, res) => {
  const grievances = await Grievance.find().populate("user");
  res.json(grievances);
};

const createGrievance = async (req, res) => {
  const { title, description } = req.body;
  if (!title?.trim() || !description?.trim()) {
    return res.status(400).json({ message: "Title and description required" });
  }
  const g = await Grievance.create({
    user: req.user._id,
    title: title.trim(),
    description: description.trim(),
  });
  res.status(201).json(g);
};

const updateGrievance = async (req, res) => {
  const grievance = await Grievance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(grievance);
};

const deleteGrievance = async (req, res) => {
  await Grievance.findByIdAndDelete(req.params.id);
  res.json({ message: "Grievance deleted" });
};

module.exports = {
  getGrievances,
  createGrievance,
  updateGrievance,
  deleteGrievance,
};
