/**
 * @fileoverview Authentication Routes
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const AuthController = require('../controllers/auth-controller');
const { authenticate, rateLimitByUser } = require('../middleware/auth-middleware');

const router = express.Router();

/**
 * Rate limiting configuration for authentication routes
 * @constant {Object} authRateLimit
 */
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth routes
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.',
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      details: 'Maximum 5 authentication attempts allowed per 15 minutes.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for successful requests
  skip: (req, res) => res.statusCode < 400,
  keyGenerator: (req) => {
    // Use IP + User-Agent for better rate limiting
    return `${req.ip}-${req.get('User-Agent')}`;
  }  
});

/**
 * Rate limiting for password change (more restrictive)
 * @constant {Object} passwordChangeRateLimit
 */
const passwordChangeRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password changes per hour
  message: {
    status: 'error',
    message: 'Too many password change attempts, please try again later.',
    error: {
      code: 'PASSWORD_CHANGE_RATE_LIMIT_EXCEEDED',
      details: 'Maximum 3 password changes allowed per hour.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * @route POST /api/v1/auth/login
 * @description User login
 * @access Public
 * @rateLimit 5 requests per 15 minutes per IP
 */
router.post('/login', authRateLimit, AuthController.login);

/**
 * @route POST /api/v1/auth/logout
 * @description User logout
 * @access Private
 * @middleware authenticate
 */
router.post('/logout', authenticate, AuthController.logout);

/**
 * @route GET /api/v1/auth/verify
 * @description Verify authentication token
 * @access Private
 * @middleware authenticate
 */
router.get('/verify', authenticate, AuthController.verifyToken);

/**
 * @route GET /api/v1/auth/profile
 * @description Get user profile
 * @access Private
 * @middleware authenticate
 */
router.get('/profile', authenticate, AuthController.getProfile);

/**
 * @route PUT /api/v1/auth/profile
 * @description Update user profile
 * @access Private
 * @middleware authenticate, rateLimitByUser (100 requests per 15 minutes per user)
 */
router.put('/profile', 
  authenticate, 
  rateLimitByUser(100, 15 * 60 * 1000), 
  AuthController.updateProfile
);

/**
 * @route PUT /api/v1/auth/change-password
 * @description Change user password
 * @access Private
 * @middleware authenticate, passwordChangeRateLimit
 */
router.put('/change-password', 
  passwordChangeRateLimit,
  authenticate, 
  AuthController.changePassword
);

/**
 * @route GET /api/v1/auth/permissions
 * @description Get user permissions
 * @access Private
 * @middleware authenticate
 */
router.get('/permissions', authenticate, AuthController.getPermissions);

/**
 * @route GET /api/v1/auth/refresh
 * @description Refresh authentication token
 * @access Private
 * @middleware authenticate
 * @note This is a placeholder for future token refresh implementation
 */
router.post('/refresh', authenticate, (req, res) => {
  // For now, just return the current user data
  // In a production app, you might implement refresh tokens
  const token = req.user.generateAuthToken();
  
  res.json({
    status: 'success',
    message: 'Token refreshed successfully',
    data: {
      user: req.user.toJSON(),
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  });
});

/**
 * Health check for auth routes
 * @route GET /api/v1/auth/health
 * @description Authentication service health check
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Authentication service is healthy',
    data: {
      service: 'auth-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0'
    }
  });
});

module.exports = router;