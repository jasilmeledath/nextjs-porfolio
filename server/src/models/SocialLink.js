/**
 * @fileoverview Social Links Model - Portfolio Management
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['github', 'linkedin', 'twitter', 'website', 'instagram', 'dribbble'],
    lowercase: true
  },
  url: {
    type: String,
    required: true,
    trim: true,
    match: /^https?:\/\/.+$/
  },
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'social_links'
});

// Indexes
socialLinkSchema.index({ userId: 1, platform: 1 }, { unique: true });
socialLinkSchema.index({ userId: 1, order: 1 });

// Transform output
socialLinkSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('SocialLink', socialLinkSchema);
