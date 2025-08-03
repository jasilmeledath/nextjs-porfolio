/**
 * @fileoverview Subscriber Model - MongoDB schema for blog subscriptions
 * @author jasilmeledath@gmail.com
 * @created 2025-08-03
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * Subscriber Schema Definition
 * @description Defines the structure for subscriber documents in MongoDB
 */
const subscriberSchema = new mongoose.Schema({
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
  
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
    default: ''
  },
  
  status: {
    type: String,
    enum: ['pending', 'active', 'unsubscribed', 'bounced'],
    default: 'pending'
  },
  
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  
  confirmationToken: {
    type: String,
    default: null
  },
  
  confirmationTokenExpires: {
    type: Date,
    default: null
  },
  
  confirmedAt: {
    type: Date,
    default: null
  },
  
  unsubscribedAt: {
    type: Date,
    default: null
  },
  
  unsubscribeToken: {
    type: String,
    unique: true,
    sparse: true
  },
  
  preferences: {
    frequency: {
      type: String,
      enum: ['immediate', 'daily', 'weekly'],
      default: 'immediate'
    },
    categories: [{
      type: String,
      enum: [
        'technology',
        'web-development',
        'javascript',
        'react',
        'nextjs',
        'nodejs',
        'mongodb',
        'tutorial',
        'tips',
        'career',
        'personal',
        'general'
      ]
    }]
  },
  
  source: {
    type: String,
    enum: ['blog-footer', 'blog-modal', 'newsletter-page', 'api'],
    default: 'blog-footer'
  },
  
  ipAddress: {
    type: String,
    default: null
  },
  
  userAgent: {
    type: String,
    default: null
  },
  
  referrer: {
    type: String,
    default: null
  },
  
  lastEmailSent: {
    type: Date,
    default: null
  },
  
  emailsSent: {
    type: Number,
    default: 0
  },
  
  emailsOpened: {
    type: Number,
    default: 0
  },
  
  emailsClicked: {
    type: Number,
    default: 0
  },
  
  lastOpenedAt: {
    type: Date,
    default: null
  },
  
  lastClickedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.confirmationToken;
      delete ret.confirmationTokenExpires;
      delete ret.unsubscribeToken;
      delete ret.__v;
      return ret;
    }
  }
});

/**
 * Virtual property for engagement rate
 * @virtual
 */
subscriberSchema.virtual('engagementRate').get(function() {
  if (this.emailsSent === 0) return 0;
  return ((this.emailsOpened + this.emailsClicked) / (this.emailsSent * 2)) * 100;
});

/**
 * Generate confirmation token
 * @function generateConfirmationToken
 * @returns {string} Confirmation token
 */
subscriberSchema.methods.generateConfirmationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  
  this.confirmationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Token expires in 24 hours
  this.confirmationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  
  return token;
};

/**
 * Generate unsubscribe token
 * @function generateUnsubscribeToken
 * @returns {string} Unsubscribe token
 */
subscriberSchema.methods.generateUnsubscribeToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.unsubscribeToken = token;
  return token;
};

/**
 * Confirm subscription
 * @function confirmSubscription
 */
subscriberSchema.methods.confirmSubscription = function() {
  this.status = 'active';
  this.confirmedAt = new Date();
  this.confirmationToken = null;
  this.confirmationTokenExpires = null;
  
  // Generate unsubscribe token for future use
  this.generateUnsubscribeToken();
};

/**
 * Unsubscribe
 * @function unsubscribe
 */
subscriberSchema.methods.unsubscribe = function() {
  this.status = 'unsubscribed';
  this.unsubscribedAt = new Date();
};

/**
 * Record email sent
 * @function recordEmailSent
 */
subscriberSchema.methods.recordEmailSent = function() {
  this.emailsSent += 1;
  this.lastEmailSent = new Date();
};

/**
 * Record email opened
 * @function recordEmailOpened
 */
subscriberSchema.methods.recordEmailOpened = function() {
  this.emailsOpened += 1;
  this.lastOpenedAt = new Date();
};

/**
 * Record email clicked
 * @function recordEmailClicked
 */
subscriberSchema.methods.recordEmailClicked = function() {
  this.emailsClicked += 1;
  this.lastClickedAt = new Date();
};

/**
 * Static method to find active subscribers
 * @function findActiveSubscribers
 * @param {Object} filters - Additional filters
 * @returns {Promise<Array>} Active subscribers
 */
subscriberSchema.statics.findActiveSubscribers = function(filters = {}) {
  return this.find({
    status: 'active',
    ...filters
  });
};

/**
 * Static method to find subscribers by category preference
 * @function findByCategory
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} Subscribers interested in category
 */
subscriberSchema.statics.findByCategory = function(category) {
  return this.find({
    status: 'active',
    'preferences.categories': category
  });
};

/**
 * Static method to get subscription stats
 * @function getStats
 * @returns {Promise<Object>} Subscription statistics
 */
subscriberSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    active: 0,
    pending: 0,
    unsubscribed: 0,
    bounced: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

// Indexes for better performance
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ status: 1 });
subscriberSchema.index({ subscriptionDate: -1 });
subscriberSchema.index({ confirmationToken: 1 }, { sparse: true });
subscriberSchema.index({ unsubscribeToken: 1 }, { sparse: true });
subscriberSchema.index({ 'preferences.categories': 1 });

/**
 * Subscriber Model
 * @type {mongoose.Model}
 */
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;
