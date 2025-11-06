// routes/services.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getServices,
  getMyServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Public
router.get("/", getServices);

// Provider convenience endpoint must be BEFORE :id
router.get("/mine", auth, getMyServices);

// Plain :id (no regex) — controller validates ObjectId
router.get("/:id", getServiceById);

// Create/Update/Delete
router.post("/", auth, createService);
router.put("/:id", auth, updateService);
router.delete("/:id", auth, deleteService);

module.exports = router;
