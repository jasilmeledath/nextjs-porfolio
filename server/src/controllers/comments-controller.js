/**
 * @fileoverview Comments Controller - Dedicated controller for comment operations
 * @author jasilmeledath@gmail.com
 * @created 2025-01-27
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const Blog = require('../models/Blog');
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
 * Comments Controller Class
 * @class CommentsController
 */
class CommentsController {
  /**
   * Add comment to blog (Public endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async addComment(req, res, next) {
    try {
      const { blogId } = req.params;
      const { author, content, parentComment } = req.body;

      // Validate required fields
      if (!author?.name || !author?.email || !content) {
        throw new ValidationError('Author name, email, and content are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(author.email)) {
        throw new ValidationError('Please provide a valid email address');
      }

      // Find the blog
      const blog = await Blog.findOne({ _id: blogId, status: 'published' });

      if (!blog) {
        throw new NotFoundError('Blog not found or not published');
      }

      // If parentComment is provided, validate it exists
      if (parentComment) {
        const parentExists = blog.comments.id(parentComment);
        if (!parentExists) {
          throw new ValidationError('Parent comment not found');
        }
      }

      // Create comment object
      const comment = {
        author: {
          name: author.name.trim(),
          email: author.email.toLowerCase().trim(),
          website: author.website ? author.website.trim() : ''
        },
        content: content.trim(),
        parentComment: parentComment || null,
        status: 'pending' // Always pending for moderation
      };

      // Add comment to blog
      blog.comments.push(comment);
      await blog.save();

      // Get the newly added comment
      const newComment = blog.comments[blog.comments.length - 1];

      const response = ApiResponse.created(
        { commentId: newComment._id }, 
        'Comment submitted successfully. It will be visible after moderation.'
      );
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
   * Get approved comments for a blog (Public endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getBlogComments(req, res, next) {
    try {
      const { blogId } = req.params;
      const { page = 1, limit = 10, sortOrder = 'desc' } = req.query;

      const blog = await Blog.findOne({ _id: blogId, status: 'published' });

      if (!blog) {
        throw new NotFoundError('Blog not found');
      }

      // Filter approved comments only
      const approvedComments = blog.comments.filter(comment => comment.status === 'approved');
      
      // Sort comments
      approvedComments.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });

      // Implement pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedComments = approvedComments.slice(startIndex, endIndex);

      // Organize comments with replies
      const rootComments = [];
      const commentMap = new Map();

      // First pass: create map of all comments
      paginatedComments.forEach(comment => {
        commentMap.set(comment._id.toString(), {
          ...comment.toObject(),
          replies: []
        });
      });

      // Second pass: organize into tree structure
      paginatedComments.forEach(comment => {
        const commentObj = commentMap.get(comment._id.toString());
        
        if (comment.parentComment) {
          const parent = commentMap.get(comment.parentComment.toString());
          if (parent) {
            parent.replies.push(commentObj);
          }
        } else {
          rootComments.push(commentObj);
        }
      });

      const totalComments = approvedComments.length;
      const totalPages = Math.ceil(totalComments / limit);

      const response = ApiResponse.success({
        comments: rootComments,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalComments,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }, 'Comments retrieved successfully');

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all pending comments (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getPendingComments(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        sortOrder = 'desc',
        status = 'pending',
        search = ''
      } = req.query;

      // Build match conditions
      const matchConditions = { status: 'published' };
      
      // Comment status filter
      let commentStatusMatch;
      if (status === 'all') {
        commentStatusMatch = { 'comments.status': { $in: ['pending', 'approved', 'rejected'] } };
      } else {
        commentStatusMatch = { 'comments.status': status };
      }

      // Build the aggregation pipeline
      const pipeline = [
        { $match: matchConditions },
        { $unwind: '$comments' },
        { $match: commentStatusMatch },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'blogAuthor'
          }
        },
        {
          $project: {
            blogId: '$_id',
            blogTitle: '$title',
            blogSlug: '$slug',
            blogAuthor: { $arrayElemAt: ['$blogAuthor', 0] },
            comment: '$comments'
          }
        }
      ];

      // Add search functionality if search term is provided
      if (search && search.trim()) {
        pipeline.push({
          $match: {
            $or: [
              { 'comment.content': { $regex: search, $options: 'i' } },
              { 'comment.author.name': { $regex: search, $options: 'i' } },
              { 'comment.author.email': { $regex: search, $options: 'i' } },
              { 'blogTitle': { $regex: search, $options: 'i' } }
            ]
          }
        });
      }

      // Add sorting and pagination
      pipeline.push(
        { $sort: { 'comment.createdAt': sortOrder === 'desc' ? -1 : 1 } },
        {
          $facet: {
            data: [
              { $skip: (page - 1) * parseInt(limit) },
              { $limit: parseInt(limit) }
            ],
            totalCount: [{ $count: 'count' }]
          }
        }
      );

      const result = await Blog.aggregate(pipeline);
      const comments = result[0].data;
      const totalCount = result[0].totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      const response = ApiResponse.success({
        comments: comments,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalComments: totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }, `Comments retrieved successfully (${status === 'all' ? 'all statuses' : status})`);

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Moderate comment (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async moderateComment(req, res, next) {
    try {
      const { blogId, commentId } = req.params;
      const { status, moderatorNote } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        throw new ValidationError('Invalid status. Must be pending, approved, or rejected');
      }

      const blog = await Blog.findById(blogId);

      if (!blog) {
        throw new NotFoundError('Blog not found');
      }

      const comment = blog.comments.id(commentId);

      if (!comment) {
        throw new NotFoundError('Comment not found');
      }

      // Update comment status
      comment.status = status;
      
      // Add moderation metadata
      comment.moderatedBy = req.user._id;
      comment.moderatedAt = new Date();
      if (moderatorNote) {
        comment.moderatorNote = moderatorNote;
      }

      await blog.save();

      // Return the updated comment with blog info
      const updatedComment = {
        ...comment.toObject(),
        blogTitle: blog.title,
        blogSlug: blog.slug
      };

      const response = ApiResponse.success(
        updatedComment, 
        `Comment ${status} successfully`
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk moderate comments (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async bulkModerateComments(req, res, next) {
    try {
      const { commentIds, status, moderatorNote } = req.body;

      if (!Array.isArray(commentIds) || commentIds.length === 0) {
        throw new ValidationError('Comment IDs array is required');
      }

      if (!['approved', 'rejected'].includes(status)) {
        throw new ValidationError('Status must be approved or rejected for bulk operations');
      }

      const results = [];
      let successCount = 0;
      let errorCount = 0;

      // Process each comment
      for (const commentData of commentIds) {
        try {
          const { blogId, commentId } = commentData;
          
          const blog = await Blog.findById(blogId);
          if (!blog) {
            results.push({ commentId, status: 'error', message: 'Blog not found' });
            errorCount++;
            continue;
          }

          const comment = blog.comments.id(commentId);
          if (!comment) {
            results.push({ commentId, status: 'error', message: 'Comment not found' });
            errorCount++;
            continue;
          }

          comment.status = status;
          comment.moderatedBy = req.user._id;
          comment.moderatedAt = new Date();
          if (moderatorNote) {
            comment.moderatorNote = moderatorNote;
          }

          await blog.save();
          results.push({ commentId, status: 'success', newStatus: status });
          successCount++;
        } catch (error) {
          results.push({ commentId: commentData.commentId, status: 'error', message: error.message });
          errorCount++;
        }
      }

      const response = ApiResponse.success({
        results,
        summary: {
          total: commentIds.length,
          successful: successCount,
          failed: errorCount
        }
      }, `Bulk moderation completed. ${successCount} comments ${status}, ${errorCount} failed.`);

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete comment (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async deleteComment(req, res, next) {
    try {
      const { blogId, commentId } = req.params;

      const blog = await Blog.findById(blogId);

      if (!blog) {
        throw new NotFoundError('Blog not found');
      }

      const comment = blog.comments.id(commentId);

      if (!comment) {
        throw new NotFoundError('Comment not found');
      }

      // Check if comment has replies
      const hasReplies = blog.comments.some(c => 
        c.parentComment && c.parentComment.toString() === commentId
      );

      if (hasReplies) {
        throw new ValidationError('Cannot delete comment with replies. Please delete replies first.');
      }

      // Remove the comment
      blog.comments.pull(commentId);
      await blog.save();

      const response = ApiResponse.success(
        null, 
        'Comment deleted successfully'
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get comment statistics (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getCommentStats(req, res, next) {
    try {
      const pipeline = [
        { $match: { status: 'published' } },
        { $unwind: '$comments' },
        {
          $group: {
            _id: '$comments.status',
            count: { $sum: 1 }
          }
        }
      ];

      const statusCounts = await Blog.aggregate(pipeline);
      
      // Get total comments count
      const totalPipeline = [
        { $match: { status: 'published' } },
        { $project: { commentCount: { $size: '$comments' } } },
        { $group: { _id: null, total: { $sum: '$commentCount' } } }
      ];

      const totalResult = await Blog.aggregate(totalPipeline);
      const totalComments = totalResult[0]?.total || 0;

      // Format the response
      const stats = {
        total: totalComments,
        pending: 0,
        approved: 0,
        rejected: 0
      };

      statusCounts.forEach(stat => {
        stats[stat._id] = stat.count;
      });

      // Get recent comments activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentActivityPipeline = [
        { $match: { status: 'published' } },
        { $unwind: '$comments' },
        { $match: { 'comments.createdAt': { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$comments.createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ];

      const recentActivity = await Blog.aggregate(recentActivityPipeline);

      const response = ApiResponse.success({
        stats,
        recentActivity
      }, 'Comment statistics retrieved successfully');

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CommentsController;