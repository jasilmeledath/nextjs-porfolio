/**
 * @fileoverview Blog Controller - Handles blog-related operations
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const express = require('express');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');
const EmailService = require('../services/email-service');
const Subscriber = require('../models/Subscriber');
const { HTTP_STATUS } = require('../constants/http-status');
const { 
  API_RESPONSE_STATUS, 
  API_MESSAGES,
  API_ERROR_CODES 
} = require('../constants/api-response');
const ApiResponse = require('../utils/ApiResponse');
const { 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError,
  NotFoundError,
  ConflictError 
} = require('../errors/custom-errors');

/**
 * Blog Controller Class
 * @class BlogController
 */
class BlogController {
  /**
   * Get all blogs with filtering and pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getAllBlogs(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        category,
        tag,
        featured,
        search,
        sortBy = 'publishedAt',
        sortOrder = 'desc'
      } = req.query;

      const query = {};
      
      // Build query filters
      if (status) query.status = status;
      if (category) query.categories = category;
      if (tag) query.tags = tag;
      if (featured !== undefined) query.featured = featured === 'true';
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const blogs = await Blog.find(query)
        .populate('author', 'firstName lastName email profileImage')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean();

      // Get total count for pagination
      const totalBlogs = await Blog.countDocuments(query);
      const totalPages = Math.ceil(totalBlogs / limit);

      const response = ApiResponse.success({
        blogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBlogs,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }, 'Blogs retrieved successfully');

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get published blogs for public view
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getPublishedBlogs(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        tag,
        featured,
        search
      } = req.query;

      const blogs = await Blog.findPublished({
        page: parseInt(page),
        limit: parseInt(limit),
        category,
        tag,
        featured: featured === 'true' ? true : undefined,
        search
      });

      const totalBlogs = await Blog.countDocuments({
        status: 'published',
        ...(category && { categories: category }),
        ...(tag && { tags: tag }),
        ...(featured !== undefined && { featured: featured === 'true' })
      });

      const totalPages = Math.ceil(totalBlogs / limit);

      const response = ApiResponse.success({
        blogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBlogs,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }, 'Published blogs retrieved successfully');

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single blog by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getBlogById(req, res, next) {
    try {
      const { id } = req.params;

      const blog = await Blog.findById(id)
        .populate('author', 'firstName lastName email profileImage bio')
        .lean();

      if (!blog) {
        throw new NotFoundError('Blog not found');
      }

      const response = ApiResponse.success(blog, 'Blog retrieved successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single blog by slug (public)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getBlogBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      const blog = await Blog.findBySlug(slug);

      if (!blog) {
        throw new NotFoundError('Blog not found');
      }

      // Increment view count
      await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

      // Get related blogs
      const relatedBlogs = await Blog.getRelated(
        blog._id,
        blog.categories,
        blog.tags,
        3
      );

      const response = ApiResponse.success({
        blog,
        relatedBlogs
      }, 'Blog retrieved successfully');

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new blog
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async createBlog(req, res, next) {
    try {
      const blogData = {
        ...req.body,
        author: req.user._id  // Use _id from the authenticated user
      };

      const blog = new Blog(blogData);
      await blog.save();

      await blog.populate('author', 'firstName lastName email');

      // Send newsletter email if blog is published
      if (blog.status === 'published') {
        try {
          // Get all active subscribers
          const subscribers = await Subscriber.find({ 
            status: 'active',
            emailConfirmed: true 
          }).select('email firstName');

          if (subscribers.length > 0) {
            // Send blog notification emails in the background
            setImmediate(async () => {
              try {
                await EmailService.sendBlogNotification({
                  blog: {
                    title: blog.title,
                    excerpt: blog.excerpt || blog.content.substring(0, 200) + '...',
                    slug: blog.slug,
                    featuredImage: blog.featuredImage?.url || null,
                    publishedAt: blog.publishedAt || blog.createdAt,
                    author: {
                      name: `${blog.author.firstName} ${blog.author.lastName}`,
                      email: blog.author.email
                    }
                  },
                  subscribers: subscribers.map(sub => ({
                    email: sub.email,
                    firstName: sub.firstName
                  }))
                });
                console.log(`Newsletter sent to ${subscribers.length} subscribers for blog: ${blog.title}`);
              } catch (emailError) {
                console.error('Failed to send newsletter emails:', emailError);
                // Don't fail the blog creation if email fails
              }
            });
          }
        } catch (emailError) {
          console.error('Error preparing newsletter emails:', emailError);
          // Don't fail the blog creation if email preparation fails
        }
      }

      const response = ApiResponse.created(blog, 'Blog created successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      if (error.name === 'ValidationError') {
        next(new ValidationError(error.message));
      } else if (error.code === 11000) {
        next(new ValidationError('Blog with this slug already exists'));
      } else {
        next(error);
      }
    }
  }

  /**
   * Update blog
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async updateBlog(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError('Invalid blog ID format');
      }

      const blog = await Blog.findById(id);

      if (!blog) {
        throw new NotFoundError('Blog not found');
      }

      // Check if user is the author or has admin permissions
      if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new AuthorizationError('Unauthorized to update this blog');
      }

      // Remove sensitive fields that shouldn't be updated directly
      const { author, createdAt, updatedAt, ...allowedUpdateData } = updateData;

      // Check if blog is being published for the first time
      const wasUnpublished = blog.status !== 'published';
      const willBePublished = allowedUpdateData.status === 'published';

      // If updating status to published, ensure publishedAt is set
      if (allowedUpdateData.status === 'published' && !blog.publishedAt) {
        allowedUpdateData.publishedAt = new Date();
      }

      // Update blog with validation
      Object.assign(blog, allowedUpdateData);
      await blog.save();

      // Populate author information for response
      await blog.populate('author', 'firstName lastName email profileImage');

      // Send newsletter email if blog was just published for the first time
      if (wasUnpublished && willBePublished) {
        try {
          // Get all active subscribers
          const subscribers = await Subscriber.find({ 
            status: 'active',
            emailConfirmed: true 
          }).select('email firstName');

          if (subscribers.length > 0) {
            // Send blog notification emails in the background
            setImmediate(async () => {
              try {
                await EmailService.sendBlogNotification({
                  blog: {
                    title: blog.title,
                    excerpt: blog.excerpt || blog.content.substring(0, 200) + '...',
                    slug: blog.slug,
                    featuredImage: blog.featuredImage?.url || null,
                    publishedAt: blog.publishedAt || blog.updatedAt,
                    author: {
                      name: `${blog.author.firstName} ${blog.author.lastName}`,
                      email: blog.author.email
                    }
                  },
                  subscribers: subscribers.map(sub => ({
                    email: sub.email,
                    firstName: sub.firstName
                  }))
                });
                console.log(`Newsletter sent to ${subscribers.length} subscribers for updated blog: ${blog.title}`);
              } catch (emailError) {
                console.error('Failed to send newsletter emails:', emailError);
                // Don't fail the blog update if email fails
              }
            });
          }
        } catch (emailError) {
          console.error('Error preparing newsletter emails for update:', emailError);
          // Don't fail the blog update if email preparation fails
        }
      }

      const response = ApiResponse.success(blog, 'Blog updated successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      if (error.name === 'ValidationError') {
        next(new ValidationError(error.message));
      } else if (error.code === 11000) {
        // Handle duplicate slug error
        const field = Object.keys(error.keyPattern)[0];
        next(new ConflictError(`Blog with this ${field} already exists`));
      } else {
        next(error);
      }
    }
  }

  /**
   * Delete blog
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async deleteBlog(req, res, next) {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError('Invalid blog ID format');
      }

      const blog = await Blog.findById(id);

      if (!blog) {
        throw new NotFoundError('Blog not found');
      }

      // Check if user is the author or has admin permissions
      if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new AuthorizationError('Unauthorized to delete this blog');
      }

      // Store blog info for response (before deletion)
      const blogInfo = {
        id: blog._id,
        title: blog.title,
        slug: blog.slug
      };

      // Delete the blog
      await Blog.findByIdAndDelete(id);

      const response = ApiResponse.success(
        { deletedBlog: blogInfo }, 
        'Blog deleted successfully'
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish/Unpublish blog
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async toggleBlogStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['draft', 'published', 'archived'].includes(status)) {
        throw new ValidationError('Invalid status. Must be draft, published, or archived');
      }

      const blog = await Blog.findById(id);

      if (!blog) {
        throw new NotFoundError('Blog not found');
      }

      // Check if user is the author or admin
      if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new CustomError('Unauthorized to change blog status', HTTP_STATUS.FORBIDDEN);
      }

      blog.status = status;
      if (status === 'published' && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }

      await blog.save();
      await blog.populate('author', 'firstName lastName email');

      const response = ApiResponse.success(blog, `Blog ${status} successfully`);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get blog statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getBlogStats(req, res, next) {
    try {
      const totalBlogs = await Blog.countDocuments();
      const publishedBlogs = await Blog.countDocuments({ status: 'published' });
      const draftBlogs = await Blog.countDocuments({ status: 'draft' });
      const totalViews = await Blog.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]);
      const totalComments = await Blog.aggregate([
        { $unwind: '$comments' },
        { $match: { 'comments.status': 'approved' } },
        { $group: { _id: null, count: { $sum: 1 } } }
      ]);

      const stats = {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        archivedBlogs: totalBlogs - publishedBlogs - draftBlogs,
        totalViews: totalViews[0]?.totalViews || 0,
        totalComments: totalComments[0]?.count || 0
      };

      const response = ApiResponse.success(stats, 'Blog statistics retrieved successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get popular blogs
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getPopularBlogs(req, res, next) {
    try {
      const { limit = 5 } = req.query;

      const blogs = await Blog.getPopular(parseInt(limit));

      const response = ApiResponse.success(blogs, 'Popular blogs retrieved successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get recent blogs
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getRecentBlogs(req, res, next) {
    try {
      const { limit = 5 } = req.query;

      const blogs = await Blog.getRecent(parseInt(limit));

      const response = ApiResponse.success(blogs, 'Recent blogs retrieved successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add comment to blog
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const { author, content, parentComment } = req.body;

      const blog = await Blog.findOne({ _id: id, status: 'published' });

      if (!blog) {
        throw new NotFoundError('Blog not found');
      }

      const comment = {
        author,
        content,
        parentComment: parentComment || null,
        status: 'pending' // Default to pending for moderation
      };

      blog.comments.push(comment);
      await blog.save();

      const response = ApiResponse.created(null, 'Comment added successfully. It will be visible after moderation.');
      res.status(response.statusCode).json(response);
    } catch (error) {
      if (error.name === 'ValidationError') {
        next(new ValidationError(error.message));
      } else {
        next(error);
      }
    }
  }

  /**
   * Moderate comment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async moderateComment(req, res, next) {
    try {
      const { id, commentId } = req.params;
      const { status } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        throw new ValidationError('Invalid status. Must be pending, approved, or rejected');
      }

      const blog = await Blog.findById(id);

      if (!blog) {
        throw new NotFoundError('Blog not found');
      }

      const comment = blog.comments.id(commentId);

      if (!comment) {
        throw new NotFoundError('Comment not found');
      }

      comment.status = status;
      await blog.save();

      const response = ApiResponse.success(null, `Comment ${status} successfully`);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all categories
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getCategories(req, res, next) {
    try {
      const categories = await Blog.distinct('categories', { status: 'published' });
      
      const response = ApiResponse.success(categories, 'Categories retrieved successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all tags
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getTags(req, res, next) {
    try {
      const tags = await Blog.distinct('tags', { status: 'published' });
      
      const response = ApiResponse.success(tags, 'Tags retrieved successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BlogController;
