/**
 * @fileoverview Personal Information Model - Portfolio Management
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed, // Allow both String and ObjectId
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  avatar: {
    type: String,
    default: null // URL to uploaded image
  },
  resumeUrl: {
    type: String,
    default: null // URL to uploaded resume PDF
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'personal_info'
});

// Indexes
personalInfoSchema.index({ userId: 1 });
personalInfoSchema.index({ email: 1 });

// Virtual for full profile data
personalInfoSchema.virtual('fullProfile').get(function() {
  return {
    id: this._id,
    name: this.name,
    title: this.title,
    location: this.location,
    email: this.email,
    phone: this.phone,
    description: this.description,
    avatar: this.avatar,
    resumeUrl: this.resumeUrl,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
});

// Transform output
personalInfoSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('PersonalInfo', personalInfoSchema);
