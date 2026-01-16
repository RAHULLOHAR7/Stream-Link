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

    // ✅ VALIDATE EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

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

    // ✅ SEND EMAIL WITH PROPER ERROR HANDLING
    try {
      const mailInfo = await transporter.sendMail({
        from: process.env.EMAIL, // Explicitly set from address
        to: email,
        subject: "Your OTP for Live Stream Access",
        html: `
          <h2>Your OTP is <b>${otp}</b></h2>
          <p>This code is valid for 5 minutes.</p>
        `,
      });

      console.log(`✅ OTP email sent successfully to: ${email}`, mailInfo.messageId);
      res.json({ message: "OTP sent successfully" });
    } catch (mailError) {
      // Log detailed email error
      console.error(`❌ Email sending failed for: ${email}`, {
        error: mailError.message,
        code: mailError.code,
        response: mailError.response,
        responseCode: mailError.responseCode,
        command: mailError.command,
      });

      // Return more specific error message
      if (mailError.code === 'EAUTH' || mailError.code === 'EENVELOPE') {
        return res.status(500).json({ 
          message: "Email authentication failed. Please check email configuration.",
          error: mailError.message 
        });
      } else if (mailError.code === 'ECONNECTION' || mailError.code === 'ETIMEDOUT') {
        return res.status(500).json({ 
          message: "Email service connection failed. Please try again later.",
          error: mailError.message 
        });
      } else {
        return res.status(500).json({ 
          message: `Failed to send OTP email to ${email}. Please check if the email address is valid.`,
          error: mailError.message 
        });
      }
    }
  } catch (err) {
    console.error("❌ OTP send error:", err);
    res.status(500).json({ 
      message: "OTP send failed", 
      error: err.message 
    });
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

/* ===============================
   🔹 DIRECT LOGIN (NO OTP)
================================ */
exports.directLogin = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // ✅ NORMALIZE EMAIL
    email = email.toLowerCase().trim();

    // ✅ VALIDATE EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ CREATE OR UPDATE USER (NO OTP REQUIRED)
    const user = await User.findOneAndUpdate(
      { email },
      {
        email, // ensure lowercase stored
        verified: true, // Direct access, no verification needed
        otp: null,
        otpExpiry: null,
      },
      { upsert: true, new: true }
    );

    // 🔐 JWT TOKEN
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Longer expiry for direct login
    );

    // 🧾 LOGIN LOG
    await LoginLog.create({
      email: user.email,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
    });

    console.log(`✅ Direct login successful for: ${email}`);

    res.json({
      message: "Access granted",
      token,
    });
  } catch (err) {
    console.error("❌ Direct login error:", err);
    res.status(500).json({ 
      message: "Login failed", 
      error: err.message 
    });
  }
};
