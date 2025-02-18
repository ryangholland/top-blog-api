const express = require("express");
const app = express();
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

app.use(express.json());

app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.get("/", (req, res) => {
  res.send("Blog API is running...");
});

module.exports = app;