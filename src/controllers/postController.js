const prisma = require("../db/prisma");

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
};

// Get published posts
exports.getPublishedPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching published posts" });
  }
};

// Get 5 recent posts
exports.getRecentPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { username: true } },
        comments: true,
        tags: { select: { name: true } },
      },
    });

    // Format response
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      author: post.user.username,
      datePosted: new Date(post.createdAt).toLocaleDateString(),
      excerpt: post.excerpt,
      commentCount: post.comments.length,
      tags: post.tags.map((tag) => tag.name),
    }));

    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recent posts" });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { username: true } },
        comments: true,
        tags: { select: { name: true } },
      },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Format response
    const formattedPost = {
      id: post.id,
      title: post.title,
      author: post.user.username,
      datePosted: new Date(post.createdAt).toLocaleDateString(),
      content: post.content,
      comments: post.comments || [],
      tags: post.tags || [],
    };

    res.json(formattedPost);
  } catch (error) {
    res.status(500).json({ error: "Error fetching post" });
  }
};

// Get a random post
exports.getRandomPost = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { id: true }, // Only fetch post IDs
    });

    if (!posts.length) {
      return res.status(404).json({ error: "No published posts found" });
    }

    const randomIndex = Math.floor(Math.random() * posts.length);
    const randomPost = posts[randomIndex];

    res.json({ id: randomPost.id });
  } catch (error) {
    console.error("Error fetching random post:", error);
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
