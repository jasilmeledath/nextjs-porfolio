/**
 * @fileoverview Subscription Controller - Handles newsletter subscription operations
 * @author jasilmeledath@gmail.com
 * @created 2025-08-03
 * @version 1.0.0
 */

const Subscriber = require('../models/Subscriber');
const EmailService = require('../services/email-service');
const { HTTP_STATUS } = require('../constants/http-status');
const { 
  API_RESPONSE_STATUS, 
  API_MESSAGES,
  API_ERROR_CODES 
} = require('../constants/api-response');
const ApiResponse = require('../utils/ApiResponse');
const { 
  ValidationError, 
  NotFoundError,
  ConflictError 
} = require('../errors/custom-errors');
const crypto = require('crypto');

/**
 * Subscription Controller Class
 * @class SubscriptionController
 */
class SubscriptionController {

  /**
   * Subscribe to newsletter (Public endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async subscribe(req, res, next) {
    try {
      const { email, firstName, source = 'blog-footer', preferences = {} } = req.body;

      // Validate required fields
      if (!email) {
        throw new ValidationError('Email is required');
      }

      // Check if subscriber already exists
      let subscriber = await Subscriber.findOne({ email: email.toLowerCase() });
      
      if (subscriber) {
        if (subscriber.status === 'active') {
          const response = ApiResponse.success(
            { message: 'You are already subscribed!' },
            'Already subscribed'
          );
          return res.status(response.statusCode).json(response);
        } else if (subscriber.status === 'pending') {
          // Resend confirmation email
          const confirmationToken = subscriber.generateConfirmationToken();
          await subscriber.save();
          
          const emailServiceInstance = new EmailService();
          await emailServiceInstance.sendSubscriptionConfirmation(subscriber, confirmationToken);
          
          const response = ApiResponse.success(
            { message: 'Confirmation email resent!' },
            'Confirmation email sent'
          );
          return res.status(response.statusCode).json(response);
        } else if (subscriber.status === 'unsubscribed') {
          // Reactivate subscription
          subscriber.status = 'pending';
          subscriber.subscriptionDate = new Date();
          subscriber.firstName = firstName || subscriber.firstName;
          subscriber.preferences = { ...subscriber.preferences, ...preferences };
        }
      } else {
        // Create new subscriber
        subscriber = new Subscriber({
          email: email.toLowerCase(),
          firstName: firstName || '',
          source,
          preferences: {
            frequency: preferences.frequency || 'immediate',
            categories: preferences.categories || []
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          referrer: req.get('Referer')
        });
      }

      // Generate confirmation token
      const confirmationToken = subscriber.generateConfirmationToken();
      await subscriber.save();

      // Send confirmation email
      try {
        const emailServiceInstance = new EmailService();
        await emailServiceInstance.sendSubscriptionConfirmation(subscriber, confirmationToken);
      } catch (emailError) {
        console.error('[Subscription] Email sending failed:', emailError);
        // Don't fail the subscription if email fails
      }

      const response = ApiResponse.success(
        { 
          message: 'Subscription successful! Please check your email to confirm.',
          email: subscriber.email
        },
        'Subscription created successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Confirm subscription (Public endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async confirmSubscription(req, res, next) {
    try {
      const { token } = req.params; // Changed from req.query to req.params

      if (!token) {
        throw new ValidationError('Confirmation token is required');
      }

      // Hash the token to match stored value
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Find subscriber with valid token
      const subscriber = await Subscriber.findOne({
        confirmationToken: hashedToken,
        confirmationTokenExpires: { $gt: Date.now() }
      });

      if (!subscriber) {
        throw new NotFoundError('Invalid or expired confirmation token');
      }

      // Confirm subscription
      subscriber.confirmSubscription();
      await subscriber.save();

      // Send welcome email
      try {
        const emailServiceInstance = new EmailService();
        await emailServiceInstance.sendWelcomeEmail(subscriber);
      } catch (emailError) {
        console.error('[Subscription] Welcome email failed:', emailError);
      }

      const response = ApiResponse.success(
        { 
          message: 'Subscription confirmed successfully!',
          subscriber: {
            email: subscriber.email,
            confirmedAt: subscriber.confirmedAt
          }
        },
        'Subscription confirmed'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unsubscribe from newsletter (Public endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async unsubscribe(req, res, next) {
    try {
      const { token } = req.params; // Changed from req.query to req.params

      if (!token) {
        throw new ValidationError('Unsubscribe token is required');
      }

      // Find subscriber with valid unsubscribe token
      const subscriber = await Subscriber.findOne({
        unsubscribeToken: token
      });

      if (!subscriber) {
        throw new NotFoundError('Invalid unsubscribe token');
      }

      // Unsubscribe
      subscriber.unsubscribe();
      await subscriber.save();

      const response = ApiResponse.success(
        { 
          message: 'You have been unsubscribed successfully.',
          email: subscriber.email
        },
        'Unsubscribed successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all subscribers (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getSubscribers(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status = 'all',
        sortBy = 'subscriptionDate',
        sortOrder = 'desc',
        search = ''
      } = req.query;

      // Build filter
      const filter = {};
      if (status !== 'all') {
        filter.status = status;
      }
      if (search) {
        filter.$or = [
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const skip = (page - 1) * limit;
      const [subscribers, totalCount] = await Promise.all([
        Subscriber.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .select('-confirmationToken -confirmationTokenExpires'),
        Subscriber.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      const response = ApiResponse.success({
        subscribers,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalCount,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }, 'Subscribers retrieved successfully');

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get subscription statistics (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async getSubscriptionStats(req, res, next) {
    try {
      const stats = await Subscriber.getStats();
      
      // Get additional analytics
      const [recentSubscriptions, topSources] = await Promise.all([
        Subscriber.aggregate([
          {
            $match: {
              subscriptionDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            }
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$subscriptionDate" } },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]),
        Subscriber.aggregate([
          {
            $group: {
              _id: '$source',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ])
      ]);

      const response = ApiResponse.success({
        stats,
        recentSubscriptions,
        topSources,
        generatedAt: new Date()
      }, 'Subscription statistics retrieved');

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send newsletter to all active subscribers (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async sendNewsletter(req, res, next) {
    try {
      const { blogId, testEmail } = req.body;

      if (!blogId) {
        throw new ValidationError('Blog ID is required');
      }

      // Get blog details
      const Blog = require('../models/Blog');
      const blog = await Blog.findById(blogId).populate('author', 'firstName lastName');

      if (!blog) {
        throw new NotFoundError('Blog not found');
      }

      if (blog.status !== 'published') {
        throw new ValidationError('Only published blogs can be sent as newsletter');
      }

      let recipients;
      if (testEmail) {
        // Send test email
        recipients = [{ email: testEmail, firstName: 'Test User', unsubscribeToken: 'test' }];
      } else {
        // Get active subscribers
        const filters = {};
        if (blog.categories && blog.categories.length > 0) {
          filters.$or = [
            { 'preferences.categories': { $size: 0 } }, // Users with no category preferences (get all)
            { 'preferences.categories': { $in: blog.categories } } // Users interested in blog categories
          ];
        }

        recipients = await Subscriber.findActiveSubscribers(filters);
      }

      if (recipients.length === 0) {
        const response = ApiResponse.success(
          { message: 'No active subscribers found' },
          'No recipients'
        );
        return res.status(response.statusCode).json(response);
      }

      // Send emails in batches to avoid overwhelming the email service
      const batchSize = 10;
      let sentCount = 0;
      let errorCount = 0;

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        const emailPromises = batch.map(async (subscriber) => {
          try {
            const emailServiceInstance = new EmailService();
            await emailServiceInstance.sendBlogNotification(subscriber, blog);
            if (!testEmail) {
              subscriber.recordEmailSent();
              await subscriber.save();
            }
            sentCount++;
          } catch (error) {
            console.error(`Failed to send email to subscriber:`, error?.message || 'Unknown error');
            errorCount++;
          }
        });

        await Promise.all(emailPromises);
        
        // Small delay between batches
        if (i + batchSize < recipients.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const response = ApiResponse.success({
        message: testEmail ? 'Test email sent successfully' : 'Newsletter sent successfully',
        totalRecipients: recipients.length,
        sentCount,
        errorCount,
        blogTitle: blog.title
      }, 'Newsletter delivery completed');

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update subscriber preferences (Public endpoint with token)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  static async updatePreferences(req, res, next) {
    try {
      const { token } = req.params;
      const { preferences } = req.body;

      const subscriber = await Subscriber.findOne({
        unsubscribeToken: token
      });

      if (!subscriber) {
        throw new NotFoundError('Invalid token');
      }

      if (subscriber.status !== 'active') {
        throw new ValidationError('Subscription is not active');
      }

      // Update preferences
      subscriber.preferences = {
        ...subscriber.preferences,
        ...preferences
      };

      await subscriber.save();

      const response = ApiResponse.success(
        { 
          message: 'Preferences updated successfully',
          preferences: subscriber.preferences
        },
        'Preferences updated'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SubscriptionController;
