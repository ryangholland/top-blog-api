const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authenticate = require("../middleware/authMiddleware");

// Public
router.get("/", postController.getPublishedPosts);
router.get("/recent", postController.getRecentPosts);
router.get("/random", postController.getRandomPost);
router.get("/:id", postController.getPostById);

// Protected
router.use(authenticate);
router.get("/all", postController.getAllPosts)
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
