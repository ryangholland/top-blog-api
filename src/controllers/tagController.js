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
  const tagId = parseInt(req.params.id);

  if (isNaN(tagId)) {
    return res.status(400).json({ error: "Invalid tag ID" });
  }

  try {
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      include: {
        posts: {
          where: { published: true }, // Only return published posts
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            excerpt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.json(tag);
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
