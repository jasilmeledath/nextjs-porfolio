/**
 * @fileoverview Portfolio Routes - API routes for portfolio operations
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const PortfolioController = require('../controllers/portfolio-controller');
const { authenticate, requireAdmin } = require('../middleware/auth-middleware');

/**
 * @route GET /api/v1/portfolio
 * @desc Get all portfolio projects with filtering and pagination
 * @access Public (published only) / Admin (all)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 12)
 * @query {string} status - Filter by status (published, draft, archived, in-progress)
 * @query {string} category - Filter by category
 * @query {boolean} featured - Filter by featured status
 * @query {string} search - Search in title, description, technologies
 * @query {string} sortBy - Sort field (priority, createdAt, title, views, likes)
 * @query {string} sortOrder - Sort order (asc, desc)
 * @query {string} technologies - Comma-separated list of technologies
 */
router.get('/', PortfolioController.getAllProjects);

/**
 * @route GET /api/v1/portfolio/featured
 * @desc Get featured portfolio projects
 * @access Public
 * @query {number} limit - Number of projects to return (default: 6)
 */
router.get('/featured', PortfolioController.getFeaturedProjects);

/**
 * @route GET /api/v1/portfolio/stats
 * @desc Get portfolio statistics
 * @access Admin only
 */
router.get('/stats', authenticate, requireAdmin, PortfolioController.getPortfolioStats);

/**
 * @route GET /api/v1/portfolio/metadata
 * @desc Get available categories, technologies, and other metadata
 * @access Public
 */
router.get('/metadata', PortfolioController.getMetadata);

/**
 * @route GET /api/v1/portfolio/category/:category
 * @desc Get projects by category
 * @access Public
 * @param {string} category - Project category
 * @query {number} limit - Number of projects to return (default: 10)
 */
router.get('/category/:category', PortfolioController.getProjectsByCategory);

/**
 * @route POST /api/v1/portfolio
 * @desc Create a new portfolio project
 * @access Admin only
 * @body {Object} project - Project data
 */
router.post('/', authenticate, requireAdmin, PortfolioController.createProject);

/**
 * @route GET /api/v1/portfolio/:slug
 * @desc Get a single portfolio project by slug
 * @access Public (published only) / Admin (all)
 * @param {string} slug - Project slug
 * @query {boolean} incrementView - Whether to increment view count (default: true)
 */
router.get('/:slug', PortfolioController.getProjectBySlug);

/**
 * @route PUT /api/v1/portfolio/:id
 * @desc Update a portfolio project
 * @access Admin only
 * @param {string} id - Project ID
 * @body {Object} project - Updated project data
 */
router.put('/:id', authenticate, requireAdmin, PortfolioController.updateProject);

/**
 * @route DELETE /api/v1/portfolio/:id
 * @desc Delete a portfolio project
 * @access Admin only
 * @param {string} id - Project ID
 */
router.delete('/:id', authenticate, requireAdmin, PortfolioController.deleteProject);

/**
 * @route PATCH /api/v1/portfolio/:id/status
 * @desc Toggle project status
 * @access Admin only
 * @param {string} id - Project ID
 * @body {string} status - New status
 */
router.patch('/:id/status', authenticate, requireAdmin, PortfolioController.toggleStatus);

/**
 * @route PATCH /api/v1/portfolio/:id/featured
 * @desc Toggle featured status
 * @access Admin only
 * @param {string} id - Project ID
 */
router.patch('/:id/featured', authenticate, requireAdmin, PortfolioController.toggleFeatured);

module.exports = router;
