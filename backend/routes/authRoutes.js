const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, getAllUsers } = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/users", getAllUsers);

module.exports = router;
