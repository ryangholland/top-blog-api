const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/post/:postId', commentController.getCommentsByPost);
router.post('/post/:postId', commentController.createComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;