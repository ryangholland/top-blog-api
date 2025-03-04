const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsConfig");

const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const tagRoutes = require("./routes/tagRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(cors(corsOptions));
app.use(express.json());

app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/tags", tagRoutes)
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Blog API is running...");
});

module.exports = app;
