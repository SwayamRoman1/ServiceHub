// routes/admin.js
const express = require("express");
const router = express.Router();

router.get("/health", (_req, res) => res.json({ ok: true }));

// Example “repair” endpoint placeholder (no-op but safe)
router.post("/repair/services-provider", async (_req, res) => {
  // In a real repair, you'd backfill provider links here.
  return res.json({ message: "No-op repair completed" });
});

module.exports = router;
