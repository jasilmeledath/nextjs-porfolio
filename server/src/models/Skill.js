/**
 * @fileoverview Skills Model - Portfolio Management
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  icon: {
    type: String,
    required: true,
    maxlength: 10 // For emoji or short icon identifier (legacy support)
  },
  logoIdentifier: {
    type: String,
    maxlength: 50, // For React icon identifiers like 'SiReact', 'FaJavascript'
    trim: true
  },
  logoLibrary: {
    type: String,
    enum: ['react-icons/si', 'react-icons/fa', 'react-icons/di', 'react-icons/bs', 'react-icons/ai'],
    default: 'react-icons/si'
  },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'tools', 'design', 'other'],
    lowercase: true
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0,
    max: 50
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
  collection: 'skills'
});

// Indexes
skillSchema.index({ userId: 1, category: 1 });
skillSchema.index({ userId: 1, order: 1 });
skillSchema.index({ userId: 1, name: 1 }, { unique: true });

// Transform output
skillSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Skill', skillSchema);
