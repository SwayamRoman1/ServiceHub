// routes/services.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/serviceController");

router.get("/", ctrl.getAll);
router.get("/mine", auth, ctrl.getMine);
router.post("/", auth, ctrl.create);
router.put("/:id", auth, ctrl.update);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
