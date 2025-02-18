const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get comments for a post
exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(req.params.postId) },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching comments" });
  }
};

// Create a comment
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(req.params.postId),
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Error creating comment" });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    await prisma.comment.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
};
