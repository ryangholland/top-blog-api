const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error fetching post" });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, published } = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated" });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: content.substring(0, 100),
        published: published || false,
        userId: req.user.id,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating post", details: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, published } = req.body;
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        content,
        excerpt: content.substring(0, 100), // Update excerpt too
        published,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating post", details: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    await prisma.post.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
};
