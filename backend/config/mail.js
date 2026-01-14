const nodemailer = require("nodemailer");

// ✅ Create transporter with better configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS, // Use App Password, not regular password
  },
  // ✅ Additional options for better compatibility
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
  // ✅ Connection timeout
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// ✅ Verify transporter configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Mail transporter verification failed:", error);
  } else {
    console.log("✅ Mail transporter is ready to send emails");
  }
});

module.exports = transporter;
