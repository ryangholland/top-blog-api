const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all tags sorted by popularity
exports.getAllTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true }, // Count the number of posts per tag
        },
      },
      orderBy: {
        posts: { _count: "desc" }, // Sort by post count (most used tags first)
      },
    });

    // Format response
    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      count: tag._count.posts,
    }));

    res.json(formattedTags);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tags" });
  }
};

// Get posts by tag name
exports.getPostsByTag = async (req, res) => {
  try {
    const { tagName } = req.params;

    const posts = await prisma.post.findMany({
      where: {
        tags: {
          some: { name: tagName }, // Find posts that include this tag
        },
      },
      include: {
        tags: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts for this tag" });
  }
};
