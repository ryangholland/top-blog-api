const express = require("express");
const app = express();
const cors = require("cors");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Allow cookies (if needed)
  })
);

app.use(express.json());

app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Blog API is running...");
});

module.exports = app;
