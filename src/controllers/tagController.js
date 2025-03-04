const prisma = require("../db/prisma");

// Get all tags sorted by popularity
exports.getAllTags = async (req, res) => {
    try {
        const tags = await prisma.tag.findMany({
          include: {
            posts: {
              where: { published: true }, // Only count published posts
              select: { id: true }, // We just need the count, not full post data
            },
          },
        });
    
        // Filter out tags with 0 published posts
        const formattedTags = tags
          .map(tag => ({
            id: tag.id,
            name: tag.name,
            count: tag.posts.length, // Count only published posts
          }))
          .filter(tag => tag.count > 0); // Don't include tags with zero published posts
    
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
