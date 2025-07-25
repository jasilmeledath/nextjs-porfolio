/**
 * @fileoverview Authentication Middleware
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { HTTP_STATUS } = require('../constants/http-status');
const { API_RESPONSE_STATUS, API_MESSAGES } = require('../constants/api-response');
const { AuthenticationError, AuthorizationError } = require('../errors/custom-errors');

/**
 * Authentication middleware to verify JWT tokens
 * @function authenticate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('ACCESS_TOKEN_MISSING', 'Access token is required');
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      throw new AuthenticationError('ACCESS_TOKEN_MISSING', 'Access token is required');
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Find user by ID from token
      const user = await User.findById(decoded.id);
      
      if (!user) {
        throw new AuthenticationError('USER_NOT_FOUND', 'User not found');
      }
      
      if (!user.isActive) {
        throw new AuthenticationError('ACCOUNT_DEACTIVATED', 'Account has been deactivated');
      }
      
      if (user.isLocked) {
        throw new AuthenticationError('ACCOUNT_LOCKED', 'Account is temporarily locked due to multiple failed login attempts');
      }
      
      // Attach user to request object
      req.user = user;
      req.token = token;
      
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        throw new AuthenticationError('TOKEN_EXPIRED', 'Access token has expired');
      } else if (jwtError.name === 'JsonWebTokenError') {
        throw new AuthenticationError('INVALID_TOKEN', 'Invalid access token');
      } else {
        throw jwtError;
      }
    }
    
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.AUTHENTICATION_FAILED,
        error: {
          code: error.code,
          details: error.message
        }
      });
    }
    
    // Unexpected error
    console.error('Authentication middleware error:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: API_RESPONSE_STATUS.ERROR,
      message: API_MESSAGES.INTERNAL_SERVER_ERROR,
      error: {
        code: 'AUTH_MIDDLEWARE_ERROR',
        details: 'Authentication verification failed'
      }
    });
  }
};

/**
 * Authorization middleware to check user permissions
 * @function authorize
 * @param {string|Array<string>} requiredPermissions - Required permissions
 * @returns {Function} Express middleware function
 */
const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('USER_NOT_AUTHENTICATED', 'User authentication required');
      }
      
      // Convert single permission to array
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];
      
      // Check if user has any of the required permissions
      const hasPermission = permissions.some(permission => 
        req.user.hasPermission(permission)
      );
      
      if (!hasPermission) {
        throw new AuthorizationError('INSUFFICIENT_PERMISSIONS', 
          `Required permissions: ${permissions.join(', ')}`);
      }
      
      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: API_RESPONSE_STATUS.ERROR,
          message: API_MESSAGES.AUTHENTICATION_FAILED,
          error: {
            code: error.code,
            details: error.message
          }
        });
      }
      
      if (error instanceof AuthorizationError) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          status: API_RESPONSE_STATUS.ERROR,
          message: API_MESSAGES.ACCESS_DENIED,
          error: {
            code: error.code,
            details: error.message
          }
        });
      }
      
      // Unexpected error
      console.error('Authorization middleware error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.INTERNAL_SERVER_ERROR,
        error: {
          code: 'AUTH_MIDDLEWARE_ERROR',
          details: 'Authorization verification failed'
        }
      });
    }
  };
};

/**
 * Role-based authorization middleware
 * @function requireRole
 * @param {string|Array<string>} requiredRoles - Required roles
 * @returns {Function} Express middleware function
 */
const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('USER_NOT_AUTHENTICATED', 'User authentication required');
      }
      
      // Convert single role to array
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      
      // Check if user has any of the required roles
      const hasRole = roles.includes(req.user.role);
      
      if (!hasRole) {
        throw new AuthorizationError('INSUFFICIENT_ROLE', 
          `Required roles: ${roles.join(', ')}`);
      }
      
      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: API_RESPONSE_STATUS.ERROR,
          message: API_MESSAGES.AUTHENTICATION_FAILED,
          error: {
            code: error.code,
            details: error.message
          }
        });
      }
      
      if (error instanceof AuthorizationError) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          status: API_RESPONSE_STATUS.ERROR,
          message: API_MESSAGES.ACCESS_DENIED,
          error: {
            code: error.code,
            details: error.message
          }
        });
      }
      
      // Unexpected error
      console.error('Role authorization middleware error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.INTERNAL_SERVER_ERROR,
        error: {
          code: 'AUTH_MIDDLEWARE_ERROR',
          details: 'Role authorization failed'
        }
      });
    }
  };
};

/**
 * Admin-only middleware (shortcut for requireRole('admin'))
 * @function requireAdmin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const requireAdmin = requireRole('admin');

/**
 * Optional authentication middleware
 * @function optionalAuth
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      return next();
    }
    
    const token = authHeader.substring(7);
    
    if (!token) {
      return next();
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id);
      
      if (user && user.isActive && !user.isLocked) {
        req.user = user;
        req.token = token;
      }
    } catch (jwtError) {
      // Invalid token, but continue without authentication
      console.warn('Optional auth failed:', jwtError.message);
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    // Continue without authentication on error
    next();
  }
};

/**
 * Rate limiting by user ID (for authenticated requests)
 * @function rateLimitByUser
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Express middleware function
 */
const rateLimitByUser = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();
  
  return (req, res, next) => {
    if (!req.user) {
      return next();
    }
    
    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get or create user request log
    if (!userRequests.has(userId)) {
      userRequests.set(userId, []);
    }
    
    const requests = userRequests.get(userId);
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    userRequests.set(userId, recentRequests);
    
    // Check if user has exceeded the limit
    if (recentRequests.length >= maxRequests) {
      return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.RATE_LIMIT_EXCEEDED,
        error: {
          code: 'USER_RATE_LIMIT_EXCEEDED',
          details: `Too many requests. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds allowed.`
        }
      });
    }
    
    // Add current request timestamp
    recentRequests.push(now);
    
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  requireRole,
  requireAdmin,
  optionalAuth,
  rateLimitByUser
};