/**
 * @fileoverview Project Model - Portfolio Management
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const projectTechnologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'database', 'devops', 'design', 'other'],
    lowercase: true
  },
  color: {
    type: String,
    default: '#10B981' // Default green color
  }
}, { _id: false });

const projectStatsSchema = new mongoose.Schema({
  users: {
    type: String,
    default: '0'
  },
  performance: {
    type: String,
    default: '0%'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  uptime: {
    type: String,
    default: null
  },
  githubStars: {
    type: Number,
    default: 0
  },
  deployments: {
    type: Number,
    default: 0
  }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  longDescription: {
    type: String,
    maxlength: 5000
  },
  technologies: [projectTechnologySchema],
  images: [{
    type: String, // URLs to uploaded images
    required: true
  }],
  thumbnailImage: {
    type: String,
    required: true
  },
  liveUrl: {
    type: String,
    trim: true,
    match: /^https?:\/\/.+$/
  },
  githubUrl: {
    type: String,
    trim: true,
    match: /^https?:\/\/.+$/
  },
  demoUrl: {
    type: String,
    trim: true,
    match: /^https?:\/\/.+$/
  },
  caseStudyUrl: {
    type: String,
    trim: true,
    match: /^https?:\/\/.+$/
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'in-progress', 'planned', 'archived'],
    default: 'in-progress'
  },
  stats: {
    type: projectStatsSchema,
    default: () => ({})
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  teamSize: {
    type: Number,
    min: 1,
    default: 1
  },
  myRole: {
    type: String,
    maxlength: 100
  },
  challenges: [{
    type: String,
    maxlength: 500
  }],
  learnings: [{
    type: String,
    maxlength: 500
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'projects'
});

// Indexes
projectSchema.index({ userId: 1, order: 1 });
projectSchema.index({ userId: 1, isFeatured: 1 });
projectSchema.index({ userId: 1, status: 1 });
projectSchema.index({ userId: 1, title: 1 }, { unique: true });

// Virtual for duration
projectSchema.virtual('duration').get(function() {
  if (!this.endDate) return 'Ongoing';
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  const months = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30));
  return `${months} month${months !== 1 ? 's' : ''}`;
});

// Transform output
projectSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Project', projectSchema);
