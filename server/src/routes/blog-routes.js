/**
 * @fileoverview Blog Routes - API endpoints for blog operations
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const express = require('express');
const BlogController = require('../controllers/blog-controller');
const { authenticate, authorize } = require('../middleware/auth-middleware');

const router = express.Router();

/**
 * Public routes (no authentication required)
 */

// Get published blogs for public view
router.get('/public', BlogController.getPublishedBlogs);

// Get single blog by slug (public)
router.get('/public/:slug', BlogController.getBlogBySlug);

// Get popular blogs
router.get('/popular', BlogController.getPopularBlogs);

// Get recent blogs
router.get('/recent', BlogController.getRecentBlogs);

// Get categories
router.get('/categories', BlogController.getCategories);

// Get tags
router.get('/tags', BlogController.getTags);

// Add comment to blog (public, but requires author info)
router.post('/:id/comments', BlogController.addComment);

/**
 * Protected routes (authentication required)
 */

// Get all blogs (admin/author view with filtering)
router.get('/', authenticate, BlogController.getAllBlogs);

// Get single blog by ID
router.get('/:id', authenticate, BlogController.getBlogById);

// Create new blog
router.post('/', authenticate, authorize(['blog:write']), BlogController.createBlog);

// Update blog
router.put('/:id', authenticate, authorize(['blog:write']), BlogController.updateBlog);

// Delete blog
router.delete('/:id', authenticate, authorize(['blog:delete']), BlogController.deleteBlog);

// Toggle blog status (publish/unpublish)
router.patch('/:id/status', authenticate, authorize(['blog:write']), BlogController.toggleBlogStatus);

// Get blog statistics (admin only)
router.get('/stats/overview', authenticate, authorize(['analytics:view']), BlogController.getBlogStats);

// Moderate comment (admin only)
router.patch('/:id/comments/:commentId/moderate', authenticate, authorize(['comments:moderate']), BlogController.moderateComment);

module.exports = router;
