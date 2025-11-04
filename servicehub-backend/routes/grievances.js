const express = require("express");
const router = express.Router();
const {
  getGrievances,
  updateGrievance,
  deleteGrievance,
} = require("../controllers/grievanceController");
const auth = require("../middleware/auth");

router.get("/", getGrievances);
router.put("/:id", auth, updateGrievance);
router.delete("/:id", auth, deleteGrievance);

module.exports = router;
