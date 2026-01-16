const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, getAllUsers, directLogin } = require("../controllers/authController");

// Direct login (no OTP required)
router.post("/direct-login", directLogin);

// OTP routes (kept for backward compatibility if needed)
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/users", getAllUsers);

module.exports = router;
