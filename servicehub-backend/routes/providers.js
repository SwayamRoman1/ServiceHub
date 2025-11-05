const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const ctrl = require("../controllers/providerController");

router.get("/", ctrl.getAll);
router.put("/:id", auth, isAdmin, ctrl.update);
router.delete("/:id", auth, isAdmin, ctrl.remove);

module.exports = router;
