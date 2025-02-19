const express = require("express");
const app = express();
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(express.json());

app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Blog API is running...");
});

module.exports = app;
