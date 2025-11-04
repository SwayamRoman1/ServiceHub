const express = require("express");
const router = express.Router();
const {
  getProviders,
  updateProvider,
  deleteProvider,
} = require("../controllers/providerController");
const auth = require("../middleware/auth");

router.get("/", getProviders);
router.put("/:id", auth, updateProvider);
router.delete("/:id", auth, deleteProvider);

module.exports = router;
