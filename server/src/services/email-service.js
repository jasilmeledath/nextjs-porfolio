/**
 * @fileoverview Email Service - Professional email handling with Nodemailer
 * @author jasilmeledath@gmail.com
 * @created 2025-08-03
 * @version 1.0.0
 */

const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

/**
 * Email Service Class
 * @class EmailService
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.setupTransporter();
  }

  /**
   * Setup email transporter
   * @private
   */
  setupTransporter() {
    // Configure based on environment variables
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  /**
   * Send email
   * @param {Object} options - Email options
   * @returns {Promise<Object>} Email result
   */
  async sendEmail(options) {
    try {
      const mailOptions = {
        from: {
          name: process.env.EMAIL_FROM_NAME || 'Jasil M',
          address: process.env.EMAIL_FROM || 'noreply@jasilm.dev'
        },
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`[EmailService] Email sent successfully to ${options.to}`);
      
      return {
        success: true,
        messageId: result.messageId,
        preview: nodemailer.getTestMessageUrl(result) // Only for Ethereal
      };
    } catch (error) {
      console.error('[EmailService] Failed to send email:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  /**
   * Send subscription confirmation email
   * @param {Object} subscriber - Subscriber object
   * @param {string} confirmationToken - Confirmation token
   * @returns {Promise<Object>} Email result
   */
  async sendSubscriptionConfirmation(subscriber, confirmationToken) {
    const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription/confirm/${confirmationToken}`;
    
    const html = this.generateConfirmationEmailTemplate(subscriber, confirmationUrl);
    const text = this.generateConfirmationEmailText(subscriber, confirmationUrl);

    return this.sendEmail({
      to: subscriber.email,
      subject: '🎉 Welcome! Please confirm your subscription',
      html,
      text
    });
  }

  /**
   * Send welcome email after confirmation
   * @param {Object} subscriber - Subscriber object
   * @returns {Promise<Object>} Email result
   */
  async sendWelcomeEmail(subscriber) {
    const html = this.generateWelcomeEmailTemplate(subscriber);
    const text = this.generateWelcomeEmailText(subscriber);

    return this.sendEmail({
      to: subscriber.email,
      subject: '🚀 Welcome to the community!',
      html,
      text
    });
  }

  /**
   * Send new blog notification to a single subscriber
   * @param {Object} subscriber - Subscriber object
   * @param {Object} blog - Blog object
   * @returns {Promise<Object>} Email result
   */
  async sendSingleBlogNotification(subscriber, blog) {
      subscriberEmail: subscriber?.email,
      blogTitle: blog?.title,
      blogSlug: blog?.slug,
      blogExists: !!blog,
      subscriberExists: !!subscriber
    });
    
    if (!subscriber || !blog) {
      console.error('[EmailService] Missing data:', { subscriber: !!subscriber, blog: !!blog });
      throw new Error('Subscriber or blog data is missing or invalid');
    }

    if (!subscriber.email) {
      throw new Error('Subscriber email is required');
    }

    if (!blog.title || !blog.slug) {
      throw new Error('Blog title and slug are required');
    }
    
    const blogUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/blog/${blog.slug}`;
    const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription/unsubscribe/${subscriber.unsubscribeToken}`;
    
      blogUrl,
      unsubscribeUrl: unsubscribeUrl.substring(0, 50) + '...'
    });
    
    const html = this.generateBlogNotificationTemplate(subscriber, blog, blogUrl, unsubscribeUrl);
    const text = this.generateBlogNotificationText(subscriber, blog, blogUrl, unsubscribeUrl);

    return this.sendEmail({
      to: subscriber.email,
      subject: `📚 New Post: ${blog.title}`,
      html,
      text
    });
  }

  /**
   * Send blog notification to multiple subscribers
   * @param {Object} data - Notification data
   * @param {Object} data.blog - Blog object with title, excerpt, slug, etc.
   * @param {Array} data.subscribers - Array of subscriber objects with email, firstName
   * @returns {Promise<Array>} Array of email results
   */
  static async sendBlogNotification(data) {
    
    if (!data) {
      console.error('[EmailService] Data parameter is missing');
      return [];
    }
    
    const { blog, subscribers } = data;
    const results = [];
    
    
    if (!blog) {
      console.error('[EmailService] Blog data is missing or undefined');
      return results;
    }
    
    if (!blog.slug) {
      console.error('[EmailService] Blog slug is missing:', blog);
      return results;
    }
    
    if (!subscribers || subscribers.length === 0) {
      return results;
    }


    // Create an instance of EmailService for sending emails
    const emailService = new EmailService();

    // Send emails to subscribers (with rate limiting to avoid spam detection)
    for (const subscriber of subscribers) {
      try {
        // Create subscriber object with unsubscribe token if needed
        const subscriberData = {
          ...subscriber,
          unsubscribeToken: subscriber.unsubscribeToken || 'temp-token' // fallback for existing subscribers
        };

        // Sending blog notification

        const result = await emailService.sendSingleBlogNotification(subscriberData, blog);
        results.push({ success: true, result });
        
        // Small delay to avoid overwhelming the email server
        if (subscribers.length > 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`[EmailService] Failed to send to subscriber:`, error?.message || 'Unknown error');
        results.push({ success: false, error: error?.message || 'Send failed' });
      }
    }

    const successCount = results.filter(r => r.success).length;
    // Blog notification sent to subscribers
    
    return results;
  }

  /**
   * Generate confirmation email HTML template
   * @private
   */
  generateConfirmationEmailTemplate(subscriber, confirmationUrl) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirm Your Subscription</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; font-size: 14px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to the Community!</h1>
                <p>Thanks for subscribing to my blog</p>
            </div>
            <div class="content">
                <p>Hi ${subscriber.firstName || 'there'}! 👋</p>
                <p>Thank you for subscribing to my blog newsletter. I'm excited to share my latest insights on web development, technology, and programming with you.</p>
                <p>To complete your subscription and start receiving updates, please confirm your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationUrl}" class="button">Confirm Subscription</a>
                </div>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">${confirmationUrl}</p>
                <p>This link will expire in 24 hours for security reasons.</p>
                <p>If you didn't subscribe to this newsletter, you can safely ignore this email.</p>
                <p>Best regards,<br>Jasil M</p>
            </div>
            <div class="footer">
                <p>This email was sent to ${subscriber.email}</p>
                <p>© 2025 Jasil M. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Generate confirmation email text template
   * @private
   */
  generateConfirmationEmailText(subscriber, confirmationUrl) {
    return `
Welcome to the Community!

Hi ${subscriber.firstName || 'there'}!

Thank you for subscribing to my blog newsletter. I'm excited to share my latest insights on web development, technology, and programming with you.

To complete your subscription and start receiving updates, please confirm your email address by visiting this link:

${confirmationUrl}

This link will expire in 24 hours for security reasons.

If you didn't subscribe to this newsletter, you can safely ignore this email.

Best regards,
Jasil M

This email was sent to ${subscriber.email}
© 2025 Jasil M. All rights reserved.
    `;
  }

  /**
   * Generate welcome email HTML template
   * @private
   */
  generateWelcomeEmailTemplate(subscriber) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to the Community!</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; font-size: 14px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 You're All Set!</h1>
                <p>Welcome to the community</p>
            </div>
            <div class="content">
                <p>Hi ${subscriber.firstName || 'there'}! 🎉</p>
                <p>Your subscription has been confirmed successfully! You're now part of a community of developers and tech enthusiasts who love learning and growing together.</p>
                <p>Here's what you can expect:</p>
                <ul>
                    <li>📚 Latest blog posts about web development and technology</li>
                    <li>💡 Programming tips and best practices</li>
                    <li>🔧 Tutorials and code examples</li>
                    <li>📈 Career insights and industry trends</li>
                </ul>
                <p>I typically send updates when I publish new content, so you won't be overwhelmed with emails.</p>
                <p>Thank you for joining the community. I'm excited to share this journey with you!</p>
                <p>Best regards,<br>Jasil M</p>
            </div>
            <div class="footer">
                <p>This email was sent to ${subscriber.email}</p>
                <p>© 2025 Jasil M. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Generate welcome email text template
   * @private
   */
  generateWelcomeEmailText(subscriber) {
    return `
You're All Set!

Hi ${subscriber.firstName || 'there'}!

Your subscription has been confirmed successfully! You're now part of a community of developers and tech enthusiasts who love learning and growing together.

Here's what you can expect:
- Latest blog posts about web development and technology
- Programming tips and best practices  
- Tutorials and code examples
- Career insights and industry trends

I typically send updates when I publish new content, so you won't be overwhelmed with emails.

Thank you for joining the community. I'm excited to share this journey with you!

Best regards,
Jasil M

This email was sent to ${subscriber.email}
© 2025 Jasil M. All rights reserved.
    `;
  }

  /**
   * Generate blog notification HTML template
   * @private
   */
  generateBlogNotificationTemplate(subscriber, blog, blogUrl, unsubscribeUrl) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Blog Post: ${blog.title}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .blog-preview { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; font-size: 14px; color: #666; }
            .unsubscribe { color: #666; text-decoration: none; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📚 New Blog Post!</h1>
                <p>Fresh content just for you</p>
            </div>
            <div class="content">
                <p>Hi ${subscriber.firstName || 'there'}! 👋</p>
                <p>I just published a new blog post that I think you'll find interesting:</p>
                
                <div class="blog-preview">
                    <h2 style="margin-top: 0; color: #059669;">${blog.title}</h2>
                    <p style="color: #666; margin-bottom: 15px;">${blog.excerpt || blog.description}</p>
                    ${blog.categories && blog.categories.length > 0 ? `
                    <div style="margin-bottom: 15px;">
                        ${blog.categories.map(cat => `<span style="background-color: #f0f9ff; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px;">#${cat}</span>`).join('')}
                    </div>
                    ` : ''}
                    <div style="text-align: center;">
                        <a href="${blogUrl}" class="button">Read Full Article</a>
                    </div>
                </div>
                
                <p>I hope you enjoy reading it! Feel free to share your thoughts in the comments.</p>
                <p>Best regards,<br>Jasil M</p>
            </div>
            <div class="footer">
                <p>This email was sent to ${subscriber.email}</p>
                <p><a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe</a> | <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="unsubscribe">Visit Website</a></p>
                <p>© 2025 Jasil M. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Generate blog notification text template
   * @private
   */
  generateBlogNotificationText(subscriber, blog, blogUrl, unsubscribeUrl) {
    return `
New Blog Post!

Hi ${subscriber.firstName || 'there'}!

I just published a new blog post that I think you'll find interesting:

${blog.title}

${blog.excerpt || blog.description}

Read the full article: ${blogUrl}

I hope you enjoy reading it! Feel free to share your thoughts in the comments.

Best regards,
Jasil M

---
This email was sent to ${subscriber.email}
Unsubscribe: ${unsubscribeUrl}
© 2025 Jasil M. All rights reserved.
    `;
  }

  /**
   * Test email configuration
   * @returns {Promise<boolean>} Configuration test result
   */
  async testConnection() {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('[EmailService] Email configuration error:', error);
      return false;
    }
  }
}

module.exports = EmailService;
