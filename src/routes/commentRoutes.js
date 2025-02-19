const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authenticate = require("../middleware/authMiddleware");

router.get("/post/:postId", commentController.getCommentsByPost);
router.post("/post/:postId", commentController.createComment);
router.delete("/:id", authenticate, commentController.deleteComment);

module.exports = router;
