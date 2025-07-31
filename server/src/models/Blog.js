/**
 * @fileoverview Blog Model - MongoDB schema for blog posts
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const mongoose = require('mongoose');

/**
 * Blog Schema Definition
 * @description Defines the structure for blog post documents in MongoDB
 */
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    minlength: [5, 'Title must be at least 5 characters long']
  },

  slug: {
    type: String,
    required: [true, 'Blog slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ]
  },

  content: {
    type: String,
    required: [true, 'Blog content is required'],
    minlength: [50, 'Content must be at least 50 characters long']
  },

  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    trim: true,
    maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    minlength: [20, 'Excerpt must be at least 20 characters long']
  },

  featuredImage: {
    url: {
      type: String,
      default: '/placeholder.svg'
    },
    alt: {
      type: String,
      default: 'Blog post featured image'
    },
    caption: {
      type: String,
      default: ''
    }
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },

  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },

  categories: [{
    type: String,
    trim: true,
    lowercase: true,
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
  }],

  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],

  publishedAt: {
    type: Date,
    default: null
  },

  readTime: {
    type: Number, // in minutes
    default: 1
  },

  views: {
    type: Number,
    default: 0
  },

  likes: {
    type: Number,
    default: 0
  },

  comments: [{
    author: {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
      },
      website: {
        type: String,
        default: '',
        trim: true
      }
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      minlength: [5, 'Comment must be at least 5 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    likes: {
      type: Number,
      default: 0
    }
  }],

  seo: {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    ogImage: {
      type: String,
      default: ''
    }
  },

  featured: {
    type: Boolean,
    default: false
  },

  sticky: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Indexes for better query performance
 */
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ author: 1 });
blogSchema.index({ categories: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ featured: 1, publishedAt: -1 });
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

/**
 * Virtual for full author name
 */
blogSchema.virtual('fullTitle').get(function() {
  return this.title;
});

/**
 * Virtual for comment count
 */
blogSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.filter(comment => comment.status === 'approved').length : 0;
});

/**
 * Virtual for approved comments only
 */
blogSchema.virtual('approvedComments').get(function() {
  return this.comments ? this.comments.filter(comment => comment.status === 'approved') : [];
});

/**
 * Pre-save middleware
 */
blogSchema.pre('save', function(next) {
  // Generate slug if not provided
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Calculate read time based on content length
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }

  // Set published date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Generate SEO fields if not provided
  if (this.isModified('title') && !this.seo.metaTitle) {
    this.seo.metaTitle = this.title.substring(0, 60);
  }

  if (this.isModified('excerpt') && !this.seo.metaDescription) {
    this.seo.metaDescription = this.excerpt.substring(0, 160);
  }

  next();
});

/**
 * Static methods
 */

/**
 * Find published blogs with pagination
 * @param {Object} options - Query options
 * @returns {Promise} Paginated blog results
 */
blogSchema.statics.findPublished = function(options = {}) {
  const {
    page = 1,
    limit = 10,
    category,
    tag,
    featured,
    search
  } = options;

  const query = { status: 'published' };

  if (category) query.categories = category;
  if (tag) query.tags = tag;
  if (featured !== undefined) query.featured = featured;
  if (search) {
    query.$text = { $search: search };
  }

  return this.find(query)
    .populate('author', 'firstName lastName email')
    .sort({ sticky: -1, publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

/**
 * Find blog by slug with author details
 * @param {String} slug - Blog slug
 * @returns {Promise} Blog document
 */
blogSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, status: 'published' })
    .populate('author', 'firstName lastName email profileImage bio')
    .lean();
};

/**
 * Get popular blogs based on views
 * @param {Number} limit - Number of blogs to return
 * @returns {Promise} Popular blogs
 */
blogSchema.statics.getPopular = function(limit = 5) {
  return this.find({ status: 'published' })
    .sort({ views: -1, publishedAt: -1 })
    .limit(limit)
    .select('title slug excerpt featuredImage views publishedAt readTime')
    .lean();
};

/**
 * Get recent blogs
 * @param {Number} limit - Number of blogs to return
 * @returns {Promise} Recent blogs
 */
blogSchema.statics.getRecent = function(limit = 5) {
  return this.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .select('title slug excerpt featuredImage publishedAt readTime')
    .populate('author', 'firstName lastName')
    .lean();
};

/**
 * Get related blogs based on categories and tags
 * @param {String} blogId - Current blog ID
 * @param {Array} categories - Blog categories
 * @param {Array} tags - Blog tags
 * @param {Number} limit - Number of related blogs
 * @returns {Promise} Related blogs
 */
blogSchema.statics.getRelated = function(blogId, categories = [], tags = [], limit = 3) {
  return this.find({
    _id: { $ne: blogId },
    status: 'published',
    $or: [
      { categories: { $in: categories } },
      { tags: { $in: tags } }
    ]
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .select('title slug excerpt featuredImage publishedAt readTime')
    .lean();
};

/**
 * Instance methods
 */

/**
 * Increment view count
 * @returns {Promise} Updated blog
 */
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

/**
 * Add comment to blog
 * @param {Object} commentData - Comment data
 * @returns {Promise} Updated blog
 */
blogSchema.methods.addComment = function(commentData) {
  this.comments.push(commentData);
  return this.save();
};

/**
 * Update comment status
 * @param {String} commentId - Comment ID
 * @param {String} status - New status
 * @returns {Promise} Updated blog
 */
blogSchema.methods.updateCommentStatus = function(commentId, status) {
  const comment = this.comments.id(commentId);
  if (comment) {
    comment.status = status;
    return this.save();
  }
  throw new Error('Comment not found');
};

/**
 * Create the model
 */
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
