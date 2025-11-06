// routes/grievances.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createGrievance,
  getMyGrievances,
  getGrievances,
  updateGrievance,
  deleteGrievance,
} = require("../controllers/grievanceController");

// User: create + list mine
router.post("/", auth, createGrievance);
router.get("/mine", auth, getMyGrievances);

// Admin: list all / modify / delete
router.get("/", getGrievances); // if you want admin-only, add an admin guard
router.put("/:id", auth, updateGrievance);
router.delete("/:id", auth, deleteGrievance);

module.exports = router;
