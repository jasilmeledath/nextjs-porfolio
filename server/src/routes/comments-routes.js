/**
 * @fileoverview Comments Routes - API endpoints for comment operations
 * @author jasilmeledath@gmail.com
 * @created 2025-01-27
 * @version 1.0.0
 */

const express = require('express');
const CommentsController = require('../controllers/comments-controller');
const { authenticate, authorize } = require('../middleware/auth-middleware');

const router = express.Router();

/**
 * Public routes (no authentication required)
 */

// Add comment to blog
router.post('/blog/:blogId', CommentsController.addComment);

// Get approved comments for a blog
router.get('/blog/:blogId', CommentsController.getBlogComments);

/**
 * Admin routes (authentication + authorization required)
 */

// Get all pending comments for moderation
router.get('/pending', 
  authenticate, 
  authorize(['comments:moderate']), 
  CommentsController.getPendingComments
);

// Moderate single comment
router.patch('/:blogId/:commentId/moderate', 
  authenticate, 
  authorize(['comments:moderate']), 
  CommentsController.moderateComment
);

// Bulk moderate comments
router.patch('/bulk-moderate', 
  authenticate, 
  authorize(['comments:moderate']), 
  CommentsController.bulkModerateComments
);

// Delete comment
router.delete('/:blogId/:commentId', 
  authenticate, 
  authorize(['comments:moderate']), 
  CommentsController.deleteComment
);

// Get comment statistics
router.get('/stats', 
  authenticate, 
  authorize(['analytics:view']), 
  CommentsController.getCommentStats
);

module.exports = router;