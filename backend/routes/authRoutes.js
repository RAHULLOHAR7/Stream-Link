const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, getAllOtpUsers } = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/users", getAllOtpUsers);

module.exports = router;
