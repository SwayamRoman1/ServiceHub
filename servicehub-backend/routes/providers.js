// routes/providers.js
const express = require("express");
const router = express.Router();
const {
  getProviders,
  updateProvider,
  deleteProvider,
} = require("../controllers/providerController");
const auth = require("../middleware/auth");

// public list of providers
router.get("/", getProviders);

// protected edits
router.put("/:id", auth, updateProvider);
router.delete("/:id", auth, deleteProvider);

module.exports = router;
