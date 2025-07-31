/**
 * @fileoverview Experience Model - Portfolio Management
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  position: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  companyUrl: {
    type: String,
    trim: true,
    match: /^https?:\/\/.+$/
  },
  companyLogo: {
    type: String // URL to uploaded logo
  },
  technologies: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  achievements: [{
    type: String,
    maxlength: 500
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'experience'
});

// Indexes
experienceSchema.index({ userId: 1, order: 1 });
experienceSchema.index({ userId: 1, isCurrent: 1 });

// Virtual for duration
experienceSchema.virtual('duration').get(function() {
  const start = new Date(this.startDate);
  const end = this.endDate ? new Date(this.endDate) : new Date();
  const months = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }
});

// Transform output
experienceSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Experience', experienceSchema);
