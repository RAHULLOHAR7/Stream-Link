const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted to live stream",
    email: req.user.email,
    embedUrl: "https://www.youtube.com/embed/LIVE_STREAM_ID",
  });
});

module.exports = router;
