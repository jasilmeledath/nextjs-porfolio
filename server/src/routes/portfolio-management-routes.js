/**
 * @fileoverview Portfolio Management Routes - Admin CRUD Operations
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const PortfolioManagementController = require('../controllers/portfolio-management-controller');
const { authenticate } = require('../middleware/auth-middleware');
const { uploadConfigs, handleUploadError, processUploads } = require('../middleware/upload-enhanced');

// Apply authentication middleware to all routes
router.use(authenticate);

// ==================== PORTFOLIO OVERVIEW ROUTES ====================

/**
 * @route   GET /api/portfolio-management/overview
 * @desc    Get complete portfolio data
 * @access  Private (Admin)
 */
router.get('/overview', PortfolioManagementController.getCompletePortfolio);

/**
 * @route   GET /api/portfolio-management/stats
 * @desc    Get portfolio statistics
 * @access  Private (Admin)
 */
router.get('/stats', PortfolioManagementController.getPortfolioStats);

// ==================== PERSONAL INFO ROUTES ====================

/**
 * @route   GET /api/portfolio-management/personal-info
 * @desc    Get personal information
 * @access  Private (Admin)
 */
router.get('/personal-info', PortfolioManagementController.getPersonalInfo);

/**
 * @route   POST /api/portfolio-management/personal-info
 * @desc    Create or update personal information
 * @access  Private (Admin)
 */
router.post('/personal-info', 
  uploadConfigs.personalInfo,
  handleUploadError,
  processUploads,
  PortfolioManagementController.upsertPersonalInfo
);

/**
 * @route   PUT /api/portfolio-management/personal-info
 * @desc    Update personal information
 * @access  Private (Admin)
 */
router.put('/personal-info', 
  uploadConfigs.personalInfo,
  handleUploadError,
  PortfolioManagementController.upsertPersonalInfo
);

// ==================== SOCIAL LINKS ROUTES ====================

/**
 * @route   GET /api/portfolio-management/social-links
 * @desc    Get all social links
 * @access  Private (Admin)
 */
router.get('/social-links', PortfolioManagementController.getSocialLinks);

/**
 * @route   POST /api/portfolio-management/social-links
 * @desc    Create new social link
 * @access  Private (Admin)
 */
router.post('/social-links', PortfolioManagementController.createSocialLink);

/**
 * @route   PUT /api/portfolio-management/social-links/:id
 * @desc    Update social link
 * @access  Private (Admin)
 */
router.put('/social-links/:id', PortfolioManagementController.updateSocialLink);

/**
 * @route   DELETE /api/portfolio-management/social-links/:id
 * @desc    Delete social link
 * @access  Private (Admin)
 */
router.delete('/social-links/:id', PortfolioManagementController.deleteSocialLink);

// ==================== SKILLS ROUTES ====================

/**
 * @route   GET /api/portfolio-management/skills
 * @desc    Get all skills
 * @access  Private (Admin)
 */
router.get('/skills', PortfolioManagementController.getSkills);

/**
 * @route   POST /api/portfolio-management/skills
 * @desc    Create new skill
 * @access  Private (Admin)
 */
router.post('/skills', PortfolioManagementController.createSkill);

/**
 * @route   PUT /api/portfolio-management/skills/:id
 * @desc    Update skill
 * @access  Private (Admin)
 */
router.put('/skills/:id', PortfolioManagementController.updateSkill);

/**
 * @route   DELETE /api/portfolio-management/skills/:id
 * @desc    Delete skill
 * @access  Private (Admin)
 */
router.delete('/skills/:id', PortfolioManagementController.deleteSkill);

// ==================== PROJECTS ROUTES ====================

/**
 * @route   GET /api/portfolio-management/projects
 * @desc    Get all projects
 * @access  Private (Admin)
 */
router.get('/projects', PortfolioManagementController.getProjects);

/**
 * @route   GET /api/portfolio-management/projects/:id
 * @desc    Get single project by ID
 * @access  Private (Admin)
 */
router.get('/projects/:id', PortfolioManagementController.getProject);

/**
 * @route   POST /api/portfolio-management/projects
 * @desc    Create new project
 * @access  Private (Admin)
 */
router.post('/projects',
  uploadConfigs.project,
  handleUploadError,
  PortfolioManagementController.createProject
);

/**
 * @route   PUT /api/portfolio-management/projects/:id
 * @desc    Update project
 * @access  Private (Admin)
 */
router.put('/projects/:id',
  uploadConfigs.project,
  handleUploadError,
  PortfolioManagementController.updateProject
);

/**
 * @route   DELETE /api/portfolio-management/projects/:id
 * @desc    Delete project
 * @access  Private (Admin)
 */
router.delete('/projects/:id', PortfolioManagementController.deleteProject);

// ==================== EXPERIENCE ROUTES ====================

/**
 * @route   GET /api/portfolio-management/experience
 * @desc    Get all experience entries
 * @access  Private (Admin)
 */
router.get('/experience', PortfolioManagementController.getExperience);

/**
 * @route   POST /api/portfolio-management/experience
 * @desc    Create new experience entry
 * @access  Private (Admin)
 */
router.post('/experience',
  uploadConfigs.experience,
  handleUploadError,
  PortfolioManagementController.createExperience
);

/**
 * @route   PUT /api/portfolio-management/experience/:id
 * @desc    Update experience entry
 * @access  Private (Admin)
 */
router.put('/experience/:id',
  uploadConfigs.experience,
  handleUploadError,
  PortfolioManagementController.updateExperience
);

/**
 * @route   DELETE /api/portfolio-management/experience/:id
 * @desc    Delete experience entry
 * @access  Private (Admin)
 */
router.delete('/experience/:id', PortfolioManagementController.deleteExperience);

// ==================== RESUME MANAGEMENT ROUTES ====================

/**
 * @route   GET /api/portfolio-management/resume/download
 * @desc    Download resume file
 * @access  Private (Admin)
 */
router.get('/resume/download', PortfolioManagementController.downloadResume);

/**
 * @route   GET /api/portfolio-management/resume/view
 * @desc    View resume in browser
 * @access  Private (Admin)
 */
router.get('/resume/view', PortfolioManagementController.viewResume);

module.exports = router;
