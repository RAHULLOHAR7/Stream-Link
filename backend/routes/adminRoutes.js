const express = require("express");
const router = express.Router();
const LoginLog = require("../models/LoginLog");

router.get("/login-logs", async (req, res) => {
  try {
    const logs = await LoginLog.find().sort({ loggedInAt: -1 }).limit(100);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

module.exports = router;
