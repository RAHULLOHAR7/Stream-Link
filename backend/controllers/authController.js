const LoginLog = require("../models/LoginLog");
const User = require("../models/User");
const transporter = require("../config/mail");
const jwt = require("jsonwebtoken");

/* ===============================
   🔹 SEND OTP
================================ */
exports.sendOtp = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // ✅ NORMALIZE EMAIL
    email = email.toLowerCase().trim();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    await User.findOneAndUpdate(
      { email },
      {
        email, // ensure lowercase stored
        otp,
        otpExpiry: expiry,
        verified: false,
      },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      to: email,
      subject: "Your OTP for Live Stream Access",
      html: `
        <h2>Your OTP is <b>${otp}</b></h2>
        <p>This code is valid for 5 minutes.</p>
      `,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP send failed" });
  }
};

/* ===============================
   🔹 GET ALL USERS WITH OTP
================================ */
// exports.getAllOtpUsers = async (req, res) => {
//   try {
//     const users = await User.find({
//       $or: [
//         { otp: { $exists: true, $ne: null } },
//         { otpExpiry: { $exists: true, $ne: null } }
//       ]
//     }).select('email otp otpExpiry verified createdAt updatedAt');

//     res.json({
//       message: "Users with OTP retrieved successfully",
//       count: users.length,
//       users
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to retrieve users" });
//   }
// };

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }); // Get all users, newest first

    res.json({
      message: "All users retrieved successfully",
      count: users.length,
      users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};
//get all users data here 

/* ===============================
   🔹 VERIFY OTP
================================ */
exports.verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // ✅ NORMALIZE EMAIL
    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ USER VERIFIED
    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // 🔐 JWT TOKEN
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🧾 LOGIN LOG
    await LoginLog.create({
      email: user.email,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      message: "OTP verified",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
