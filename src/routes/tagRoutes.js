const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

router.get("/", tagController.getAllTags);
router.get("/:tagName", tagController.getPostsByTag)

module.exports = router;
