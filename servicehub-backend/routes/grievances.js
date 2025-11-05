// routes/grievances.js
const express = require("express");
const router = express.Router();
const {
  getGrievances,
  updateGrievance,
  deleteGrievance,
  createGrievance,
} = require("../controllers/grievanceController");
const auth = require("../middleware/auth");

// public: admins can view with UI; users will POST to open a ticket
router.get("/", getGrievances);
router.post("/", auth, createGrievance); // ✅ allow users to submit
router.put("/:id", auth, updateGrievance);
router.delete("/:id", auth, deleteGrievance);

module.exports = router;
