/**
 * @fileoverview Authentication Controller
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const User = require('../models/User');
const { HTTP_STATUS } = require('../constants/http-status');
const { API_RESPONSE_STATUS, API_MESSAGES } = require('../constants/api-response');
const { 
  ValidationError, 
  AuthenticationError, 
  DatabaseError 
} = require('../errors/custom-errors');

/**
 * Authentication Controller Class
 * @class AuthController
 */
class AuthController {
  /**
   * User login
   * @async
   * @function login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Input validation
      if (!email || !password) {
        throw new ValidationError('MISSING_CREDENTIALS', 'Email and password are required');
      }
      
      if (typeof email !== 'string' || typeof password !== 'string') {
        throw new ValidationError('INVALID_CREDENTIALS_FORMAT', 'Email and password must be strings');
      }
      
      // Find user by email (including password field)
      const user = await User.findByEmailWithPassword(email);
      
      if (!user) {
        throw new AuthenticationError('INVALID_CREDENTIALS', 'Invalid email or password');
      }
      
      // Check if account is locked
      if (user.isLocked) {
        const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60));
        throw new AuthenticationError('ACCOUNT_LOCKED', 
          `Account is locked due to multiple failed login attempts. Try again in ${lockTimeRemaining} minutes.`);
      }
      
      // Check if account is active
      if (!user.isActive) {
        throw new AuthenticationError('ACCOUNT_DEACTIVATED', 'Account has been deactivated');
      }
      
      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        // Handle failed login attempt
        await user.handleFailedLoginAttempt();
        throw new AuthenticationError('INVALID_CREDENTIALS', 'Invalid email or password');
      }
      
      // Handle successful login
      await user.handleSuccessfulLogin();
      
      // Generate auth token
      const token = user.generateAuthToken();
      
      // Prepare user data (password already excluded via toJSON transform)
      const userData = user.toJSON();
      
      // Track login analytics (optional)
      const loginInfo = {
        userId: user._id,
        email: user.email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      };
      
      // Log successful login (you can save this to a separate collection for analytics)
      console.log('Successful login:', loginInfo);
      
      res.status(HTTP_STATUS.SUCCESS).json({
        status: API_RESPONSE_STATUS.SUCCESS,
        message: 'Login successful',
        data: {
          user: userData,
          token,
          expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof ValidationError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: API_RESPONSE_STATUS.ERROR,
          message: 'Validation failed',
          error: {
            code: error.code,
            details: error.message
          }
        });
      }
      
      if (error instanceof AuthenticationError) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: API_RESPONSE_STATUS.ERROR,
          message: 'Authentication failed',
          error: {
            code: error.code,
            details: error.message
          }
        });
      }
      
      // Database or unexpected error
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.INTERNAL_SERVER_ERROR,
        error: {
          code: 'LOGIN_ERROR',
          details: 'An error occurred during login'
        }
      });
    }
  }
  
  /**
   * User logout
   * @async
   * @function logout
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async logout(req, res) {
    try {
      // Log logout analytics
      const logoutInfo = {
        userId: req.user?._id,
        email: req.user?.email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      };
      
      console.log('User logout:', logoutInfo);
      
      // In a more complex setup, you might want to:
      // 1. Add token to a blacklist
      // 2. Clear refresh tokens from database
      // 3. Log the logout event
      
      res.status(HTTP_STATUS.SUCCESS).json({
        status: API_RESPONSE_STATUS.SUCCESS,
        message: 'Logout successful',
        data: {
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.INTERNAL_SERVER_ERROR,
        error: {
          code: 'LOGOUT_ERROR',
          details: 'An error occurred during logout'
        }
      });
    }
  }
  
  /**
   * Verify authentication token
   * @async
   * @function verifyToken
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async verifyToken(req, res) {
    try {
      // User is already attached by authenticate middleware
      const userData = req.user.toJSON();
      
      res.status(HTTP_STATUS.SUCCESS).json({
        status: API_RESPONSE_STATUS.SUCCESS,
        message: 'Token is valid',
        data: {
          user: userData,
          isValid: true,
          expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
      });
      
    } catch (error) {
      console.error('Token verification error:', error);
      
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.INTERNAL_SERVER_ERROR,
        error: {
          code: 'TOKEN_VERIFICATION_ERROR',
          details: 'An error occurred during token verification'
        }
      });
    }
  }
  
  /**
   * Get user profile
   * @async
   * @function getProfile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async getProfile(req, res) {
    try {
      const userData = req.user.toJSON();
      
      res.status(HTTP_STATUS.SUCCESS).json({
        status: API_RESPONSE_STATUS.SUCCESS,
        message: 'Profile retrieved successfully',
        data: {
          user: userData
        }
      });
      
    } catch (error) {
      console.error('Get profile error:', error);
      
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.INTERNAL_SERVER_ERROR,
        error: {
          code: 'PROFILE_RETRIEVAL_ERROR',
          details: 'An error occurred while retrieving profile'
        }
      });
    }
  }
  
  /**
   * Update user profile
   * @async
   * @function updateProfile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async updateProfile(req, res) {
    try {
      const { firstName, lastName, preferences } = req.body;
      const userId = req.user._id;
      
      // Prepare update data
      const updateData = {};
      
      if (firstName && typeof firstName === 'string') {
        updateData.firstName = firstName.trim();
      }
      
      if (lastName && typeof lastName === 'string') {
        updateData.lastName = lastName.trim();
      }
      
      if (preferences && typeof preferences === 'object') {
        // Validate preferences structure
        if (preferences.theme && ['light', 'dark', 'system'].includes(preferences.theme)) {
          updateData['preferences.theme'] = preferences.theme;
        }
        
        if (preferences.notifications && typeof preferences.notifications === 'object') {
          if (typeof preferences.notifications.email === 'boolean') {
            updateData['preferences.notifications.email'] = preferences.notifications.email;
          }
          
          if (typeof preferences.notifications.comments === 'boolean') {
            updateData['preferences.notifications.comments'] = preferences.notifications.comments;
          }
        }
        
        if (preferences.dashboard && typeof preferences.dashboard === 'object') {
          if (preferences.dashboard.layout && ['grid', 'list'].includes(preferences.dashboard.layout)) {
            updateData['preferences.dashboard.layout'] = preferences.dashboard.layout;
          }
        }
      }
      
      if (Object.keys(updateData).length === 0) {
        throw new ValidationError('NO_UPDATE_DATA', 'No valid update data provided');
      }
      
      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      if (!updatedUser) {
        throw new DatabaseError('USER_UPDATE_FAILED', 'Failed to update user profile');
      }
      
      res.status(HTTP_STATUS.SUCCESS).json({
        status: API_RESPONSE_STATUS.SUCCESS,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser.toJSON()
        }
      });
      
    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error instanceof ValidationError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: API_RESPONSE_STATUS.ERROR,
          message: 'Validation failed',
          error: {
            code: error.code,
            details: error.message
          }
        });
      }
      
      if (error instanceof DatabaseError) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          status: API_RESPONSE_STATUS.ERROR,
          message: 'Database error',
          error: {
            code: error.code,
            details: error.message
          }
        });
      }
      
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.INTERNAL_SERVER_ERROR,
        error: {
          code: 'PROFILE_UPDATE_ERROR',
          details: 'An error occurred while updating profile'
        }
      });
    }
  }
  
  /**
   * Change user password
   * @async
   * @function changePassword
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user._id;
      
      // Input validation
      if (!currentPassword || !newPassword) {
        throw new ValidationError('MISSING_PASSWORDS', 'Current password and new password are required');
      }
      
      if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
        throw new ValidationError('INVALID_PASSWORD_FORMAT', 'Passwords must be strings');
      }
      
      if (newPassword.length < 8) {
        throw new ValidationError('PASSWORD_TOO_SHORT', 'New password must be at least 8 characters long');
      }
      
      if (currentPassword === newPassword) {
        throw new ValidationError('SAME_PASSWORD', 'New password must be different from current password');
      }
      
      // Get user with password
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        throw new DatabaseError('USER_NOT_FOUND', 'User not found');
      }
      
      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      
      if (!isCurrentPasswordValid) {
        throw new AuthenticationError('INVALID_CURRENT_PASSWORD', 'Current password is incorrect');
      }
      
      // Update password
      user.password = newPassword;
      await user.save();
      
      // Log password change
      console.log('Password changed:', {
        userId: user._id,
        email: user.email,
        ip: req.ip,
        timestamp: new Date()
      });
      
      res.status(HTTP_STATUS.SUCCESS).json({
        status: API_RESPONSE_STATUS.SUCCESS,
        message: 'Password changed successfully',
        data: {
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error('Change password error:', error);
      
      if (error instanceof ValidationError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: API_RESPONSE_STATUS.ERROR,
          message: 'Validation failed',
          error: {
            code: error.code,
            details: error.message
          }
        });
      }
      
      if (error instanceof AuthenticationError) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: API_RESPONSE_STATUS.ERROR,
          message: 'Authentication failed',
          error: {
            code: error.code,
            details: error.message
          }
        });
      }
      
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.INTERNAL_SERVER_ERROR,
        error: {
          code: 'PASSWORD_CHANGE_ERROR',
          details: 'An error occurred while changing password'
        }
      });
    }
  }
  
  /**
   * Get user permissions
   * @async
   * @function getPermissions
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async getPermissions(req, res) {
    try {
      const permissions = req.user.permissions || [];
      
      res.status(HTTP_STATUS.SUCCESS).json({
        status: API_RESPONSE_STATUS.SUCCESS,
        message: 'Permissions retrieved successfully',
        data: {
          permissions,
          role: req.user.role,
          userId: req.user._id
        }
      });
      
    } catch (error) {
      console.error('Get permissions error:', error);
      
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.INTERNAL_SERVER_ERROR,
        error: {
          code: 'PERMISSIONS_RETRIEVAL_ERROR',
          details: 'An error occurred while retrieving permissions'
        }
      });
    }
  }
}

module.exports = AuthController;