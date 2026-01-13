const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 🔹 ENV load (MUST be on top)
require("dotenv").config();

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());

// 🔹 PORT
const PORT = process.env.PORT || 5000;

// 🔹 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// 🔹 Base route (health check)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 🔹 Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/live", require("./routes/liveRoutes"));

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/admin", require("./routes/adminRoutes"));
