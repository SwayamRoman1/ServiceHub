const Grievance = require("../models/Grievance");

// Get all grievances
const getGrievances = async (req, res) => {
  const grievances = await Grievance.find().populate("user");
  res.json(grievances);
};

// Admin: update grievance
const updateGrievance = async (req, res) => {
  const grievance = await Grievance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(grievance);
};

// Admin: delete grievance
const deleteGrievance = async (req, res) => {
  await Grievance.findByIdAndDelete(req.params.id);
  res.json({ message: "Grievance deleted" });
};

module.exports = { getGrievances, updateGrievance, deleteGrievance };
