/**
 * @fileoverview User Model - MongoDB schema for user authentication and profile
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User Schema Definition
 * @description Defines the structure for user documents in MongoDB
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'admin',
    required: true
  },
  
  permissions: [{
    type: String,
    enum: [
      'portfolio:read',
      'portfolio:write',
      'blog:read',
      'blog:write',
      'blog:delete',
      'comments:moderate',
      'media:upload',
      'media:delete',
      'analytics:view',
      'settings:manage',
      'users:manage'
    ]
  }],
  
  profileImage: {
    type: String,
    default: null
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLogin: {
    type: Date,
    default: null
  },
  
  loginAttempts: {
    type: Number,
    default: 0
  },
  
  lockUntil: {
    type: Date,
    default: null
  },
  
  passwordResetToken: {
    type: String,
    default: null
  },
  
  passwordResetExpires: {
    type: Date,
    default: null
  },
  
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      comments: {
        type: Boolean,
        default: true
      }
    },
    dashboard: {
      layout: {
        type: String,
        enum: ['grid', 'list'],
        default: 'grid'
      }
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.__v;
      return ret;
    }
  }
});

/**
 * Virtual property for full name
 * @virtual
 */
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * Virtual property for account lock status
 * @virtual
 */
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

/**
 * Pre-save middleware to hash password
 * @function
 * @param {Function} next - Mongoose next middleware function
 */
userSchema.pre('save', async function(next) {
  // Only hash password if it's been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Set default permissions based on role
    if (this.isNew && this.role === 'admin') {
      this.permissions = [
        'portfolio:read',
        'portfolio:write',
        'blog:read',
        'blog:write',
        'blog:delete',
        'comments:moderate',
        'media:upload',
        'media:delete',
        'analytics:view',
        'settings:manage',
        'users:manage'
      ];
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare password method
 * @function comparePassword
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} Password match result
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

/**
 * Generate JWT token
 * @function generateAuthToken
 * @returns {string} JWT token
 */
userSchema.methods.generateAuthToken = function() {
  const payload = {
    id: this._id,
    email: this.email,
    role: this.role,
    permissions: this.permissions
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your-secret-key',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'portfolio-api',
      audience: 'portfolio-frontend'
    }
  );
};

/**
 * Generate password reset token
 * @function generatePasswordResetToken
 * @returns {string} Reset token
 */
userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Token expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

/**
 * Handle failed login attempts
 * @function handleFailedLoginAttempt
 */
userSchema.methods.handleFailedLoginAttempt = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: {
        lockUntil: 1
      },
      $set: {
        loginAttempts: 1
      }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we have hit max attempts and it's not locked already, lock the account
  const maxLoginAttempts = 5;
  const lockTime = 30 * 60 * 1000; // 30 minutes
  
  if (this.loginAttempts + 1 >= maxLoginAttempts && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + lockTime
    };
  }
  
  return this.updateOne(updates);
};

/**
 * Handle successful login
 * @function handleSuccessfulLogin
 */
userSchema.methods.handleSuccessfulLogin = function() {
  // If we have a lock or failed attempts, remove them
  if (this.loginAttempts > 0 || this.lockUntil) {
    return this.updateOne({
      $unset: {
        loginAttempts: 1,
        lockUntil: 1
      },
      $set: {
        lastLogin: new Date()
      }
    });
  }
  
  return this.updateOne({
    $set: {
      lastLogin: new Date()
    }
  });
};

/**
 * Check if user has specific permission
 * @function hasPermission
 * @param {string} permission - Permission to check
 * @returns {boolean} Whether user has permission
 */
userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @function hasAnyPermission
 * @param {Array<string>} permissions - Permissions to check
 * @returns {boolean} Whether user has any of the permissions
 */
userSchema.methods.hasAnyPermission = function(permissions) {
  return permissions.some(permission => this.permissions.includes(permission));
};

/**
 * Static method to find user by email
 * @function findByEmail
 * @param {string} email - User email
 * @returns {Promise<User>} User document
 */
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Static method to find user by email with password
 * @function findByEmailWithPassword
 * @param {string} email - User email
 * @returns {Promise<User>} User document with password
 */
userSchema.statics.findByEmailWithPassword = function(email) {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ lockUntil: 1 }, { sparse: true });

/**
 * User Model
 * @type {mongoose.Model}
 */
const User = mongoose.model('User', userSchema);

module.exports = User;