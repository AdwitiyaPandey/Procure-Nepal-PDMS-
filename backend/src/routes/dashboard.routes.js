const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth.middleware");
const db = require("../db/db");

/* Buyer dashboard */
router.get("/buyer", auth, async (req, res) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json({
    role: "buyer",
    message: "Welcome to Buyer Dashboard",
    userId: req.user.id,
  });
});

/* Supplier dashboard */
router.get("/supplier", auth, async (req, res) => {
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json({
    role: "supplier",
    message: "Welcome to Supplier Dashboard",
    userId: req.user.id,
  });
});

module.exports = router;
