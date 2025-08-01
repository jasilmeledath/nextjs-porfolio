/**
 * @fileoverview Portfolio Controller - Handles portfolio project operations
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const PersonalInfo = require('../models/PersonalInfo');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../constants/http-status');
const { CustomError } = require('../errors/custom-errors');

/**
 * Portfolio Controller Class
 * @class PortfolioController
 */
class PortfolioController {
  /**
   * Get all portfolio projects with filtering and pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getAllProjects(req, res, next) {
    try {
      const {
        page = 1,
        limit = 12,
        status = 'published',
        category,
        featured,
        search,
        sortBy = 'priority',
        sortOrder = 'desc',
        technologies
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query = {};
      
      // Status filter (public only sees published)
      if (req.user && req.user.role === 'admin') {
        if (status !== 'all') query.status = status;
      } else {
        query.status = 'published';
      }

      // Category filter
      if (category && category !== 'all') {
        query.category = category;
      }

      // Featured filter
      if (featured !== undefined) {
        query.featured = featured === 'true';
      }

      // Technology filter
      if (technologies) {
        const techArray = technologies.split(',').map(tech => tech.trim());
        query['technologies.name'] = { $in: techArray };
      }

      // Search functionality
      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { shortDescription: searchRegex },
          { 'technologies.name': searchRegex },
          { 'seo.keywords': searchRegex }
        ];
      }

      // Sort options
      const sortOptions = {};
      const validSortFields = ['priority', 'createdAt', 'title', 'views', 'likes'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'priority';
      const sortDirection = sortOrder === 'asc' ? 1 : -1;

      if (sortField === 'views' || sortField === 'likes') {
        sortOptions[`metrics.${sortField}`] = sortDirection;
      } else {
        sortOptions[sortField] = sortDirection;
      }

      // Add secondary sort by createdAt
      if (sortField !== 'createdAt') {
        sortOptions.createdAt = -1;
      }

      // Execute query
      const [projects, totalCount] = await Promise.all([
        Portfolio.find(query)
          .populate('author', 'name email profilePicture')
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Portfolio.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Projects retrieved successfully', {
          projects,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalCount,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
            limit: limitNum
          }
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single portfolio project by slug
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getProjectBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const { incrementView = true } = req.query;

      const project = await Portfolio.findOne({ 
        slug,
        ...((!req.user || req.user.role !== 'admin') && { status: 'published' })
      })
      .populate('author', 'name email profilePicture bio')
      .lean();

      if (!project) {
        throw new CustomError('Project not found', HTTP_STATUS.NOT_FOUND);
      }

      // Increment view count if requested (and not admin viewing own project)
      if (incrementView === 'true' && (!req.user || req.user._id.toString() !== project.author._id.toString())) {
        await Portfolio.findByIdAndUpdate(
          project._id,
          { $inc: { 'metrics.views': 1 } },
          { new: false }
        );
        project.metrics.views += 1;
      }

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Project retrieved successfully', { project })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get featured portfolio projects
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getFeaturedProjects(req, res, next) {
    try {
      const { limit = 6 } = req.query;
      const limitNum = parseInt(limit);

      const projects = await Portfolio.findFeatured(limitNum);

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Featured projects retrieved successfully', { projects })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get projects by category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getProjectsByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const { limit = 10 } = req.query;
      const limitNum = parseInt(limit);

      const projects = await Portfolio.findByCategory(category, limitNum);

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success(`Projects in ${category} category retrieved successfully`, { 
          projects,
          category 
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new portfolio project (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createProject(req, res, next) {
    try {
      const projectData = {
        ...req.body,
        author: req.user._id
      };

      const project = new Portfolio(projectData);
      await project.save();

      const populatedProject = await Portfolio.findById(project._id)
        .populate('author', 'name email');

      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success('Project created successfully', { project: populatedProject })
      );
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        throw new CustomError(
          `Project with ${field} '${value}' already exists`,
          HTTP_STATUS.CONFLICT
        );
      }
      next(error);
    }
  }

  /**
   * Update a portfolio project (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove sensitive fields that shouldn't be updated directly
      delete updateData._id;
      delete updateData.author;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      const project = await Portfolio.findByIdAndUpdate(
        id,
        updateData,
        { 
          new: true, 
          runValidators: true 
        }
      ).populate('author', 'name email');

      if (!project) {
        throw new CustomError('Project not found', HTTP_STATUS.NOT_FOUND);
      }

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Project updated successfully', { project })
      );
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        throw new CustomError(
          `Project with ${field} '${value}' already exists`,
          HTTP_STATUS.CONFLICT
        );
      }
      next(error);
    }
  }

  /**
   * Delete a portfolio project (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteProject(req, res, next) {
    try {
      const { id } = req.params;

      const project = await Portfolio.findByIdAndDelete(id);

      if (!project) {
        throw new CustomError('Project not found', HTTP_STATUS.NOT_FOUND);
      }

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Project deleted successfully', { 
          projectId: id,
          title: project.title 
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle project status (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['published', 'draft', 'archived', 'in-progress'];
      if (!validStatuses.includes(status)) {
        throw new CustomError('Invalid status value', HTTP_STATUS.BAD_REQUEST);
      }

      const project = await Portfolio.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      ).populate('author', 'name email');

      if (!project) {
        throw new CustomError('Project not found', HTTP_STATUS.NOT_FOUND);
      }

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Project status updated successfully', { project })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle featured status (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async toggleFeatured(req, res, next) {
    try {
      const { id } = req.params;

      const project = await Portfolio.findById(id);

      if (!project) {
        throw new CustomError('Project not found', HTTP_STATUS.NOT_FOUND);
      }

      await project.toggleFeatured();
      await project.populate('author', 'name email');

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Project featured status updated successfully', { project })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get portfolio statistics (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getPortfolioStats(req, res, next) {
    try {
      const [
        totalProjects,
        publishedProjects,
        draftProjects,
        featuredProjects,
        viewsAggregation,
        categoryStats,
        technologyStats
      ] = await Promise.all([
        Portfolio.countDocuments(),
        Portfolio.countDocuments({ status: 'published' }),
        Portfolio.countDocuments({ status: 'draft' }),
        Portfolio.countDocuments({ featured: true }),
        Portfolio.aggregate([
          { $group: { _id: null, totalViews: { $sum: '$metrics.views' } } }
        ]),
        Portfolio.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        Portfolio.aggregate([
          { $unwind: '$technologies' },
          { $group: { _id: '$technologies.name', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ])
      ]);

      const totalViews = viewsAggregation[0]?.totalViews || 0;

      const stats = {
        totalProjects,
        publishedProjects,
        draftProjects,
        archivedProjects: totalProjects - publishedProjects - draftProjects,
        featuredProjects,
        totalViews,
        categoryDistribution: categoryStats,
        topTechnologies: technologyStats
      };

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Portfolio statistics retrieved successfully', { stats })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get available categories and technologies
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getMetadata(req, res, next) {
    try {
      const [categories, technologies] = await Promise.all([
        Portfolio.distinct('category'),
        Portfolio.aggregate([
          { $unwind: '$technologies' },
          { $group: { 
            _id: '$technologies.name',
            category: { $first: '$technologies.category' },
            count: { $sum: 1 }
          }},
          { $sort: { count: -1 } }
        ])
      ]);

      const metadata = {
        categories: categories.sort(),
        technologies: technologies.map(tech => ({
          name: tech._id,
          category: tech.category,
          projectCount: tech.count
        })),
        projectTypes: ['personal', 'professional', 'open-source', 'client-work', 'learning'],
        statuses: ['published', 'draft', 'archived', 'in-progress']
      };

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Portfolio metadata retrieved successfully', { metadata })
      );
    } catch (error) {
      next(error);
    }
  }

  // ==================== PUBLIC VISITOR METHODS ====================

  /**
   * Get complete portfolio data for visitor mode
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getVisitorPortfolio(req, res, next) {
    try {
      // Get the first admin user (portfolio owner)
      const User = require('../models/User');
      const PersonalInfo = require('../models/PersonalInfo');
      const SocialLink = require('../models/SocialLink');
      const Skill = require('../models/Skill');
      const Project = require('../models/Project');
      const Experience = require('../models/Experience');

      const portfolioOwner = await User.findOne({ role: 'admin' });
      if (!portfolioOwner) {
        throw new CustomError('Portfolio owner not found', HTTP_STATUS.NOT_FOUND);
      }

      const userId = portfolioOwner._id;
      const userIdString = userId.toString();

      // Get all portfolio data
      const [
        personalInfo,
        socialLinks,
        skills,
        projects,
        experience
      ] = await Promise.all([
        PersonalInfo.findOne({ userId: userIdString }), // Use string for PersonalInfo
        SocialLink.find({ userId: userIdString, isActive: true }).sort({ order: 1 }),
        Skill.find({ userId: userIdString, isActive: true }).sort({ proficiency: -1, name: 1 }),
        Project.find({ userId: userIdString, isActive: true }).sort({ priority: -1, createdAt: -1 }),
        Experience.find({ userId: userIdString }).sort({ startDate: -1 })
      ]);

      const portfolioData = {
        personalInfo,
        socialLinks,
        skills,
        projects,
        experience
      };

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success(portfolioData, 'Visitor portfolio data retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get public personal information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getPublicPersonalInfo(req, res, next) {
    try {
      const User = require('../models/User');
      const PersonalInfo = require('../models/PersonalInfo');

      const portfolioOwner = await User.findOne({ role: 'admin' });
      if (!portfolioOwner) {
        throw new CustomError('Portfolio owner not found', HTTP_STATUS.NOT_FOUND);
      }

      const personalInfo = await PersonalInfo.findOne({ userId: portfolioOwner._id.toString() });

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success(personalInfo, 'Personal information retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get public skills
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getPublicSkills(req, res, next) {
    try {
      const User = require('../models/User');
      const Skill = require('../models/Skill');

      const portfolioOwner = await User.findOne({ role: 'admin' });
      if (!portfolioOwner) {
        throw new CustomError('Portfolio owner not found', HTTP_STATUS.NOT_FOUND);
      }

      const skills = await Skill.find({ 
        userId: portfolioOwner._id, 
        isActive: true 
      }).sort({ proficiency: -1, name: 1 });

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success(skills, 'Skills retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get public experience
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getPublicExperience(req, res, next) {
    try {
      const User = require('../models/User');
      const Experience = require('../models/Experience');

      const portfolioOwner = await User.findOne({ role: 'admin' });
      if (!portfolioOwner) {
        throw new CustomError('Portfolio owner not found', HTTP_STATUS.NOT_FOUND);
      }

      const experience = await Experience.find({ 
        userId: portfolioOwner._id 
      }).sort({ startDate: -1 });

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success(experience, 'Experience retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get public social links
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getPublicSocialLinks(req, res, next) {
    try {
      const User = require('../models/User');
      const SocialLink = require('../models/SocialLink');

      const portfolioOwner = await User.findOne({ role: 'admin' });
      if (!portfolioOwner) {
        throw new CustomError('Portfolio owner not found', HTTP_STATUS.NOT_FOUND);
      }

      const socialLinks = await SocialLink.find({ 
        userId: portfolioOwner._id, 
        isActive: true 
      }).sort({ order: 1 });

      res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success(socialLinks, 'Social links retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Download resume file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async downloadResume(req, res, next) {
    const fs = require('fs');
    const path = require('path');
    
    try {
      // Get personal info from the PersonalInfo collection
      const personalInfo = await PersonalInfo.findOne({ isActive: true });
      
      if (!personalInfo || !personalInfo.resumeUrl) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.error('Resume not found', HTTP_STATUS.NOT_FOUND)
        );
      }

      let resumePath = personalInfo.resumeUrl;
      
      // If it's a URL, extract the file path
      if (resumePath.startsWith('http://') || resumePath.startsWith('https://')) {
        // Extract the path from the URL (e.g., /uploads/resumes/filename.pdf)
        const url = new URL(resumePath);
        resumePath = url.pathname;
      }
      
      // Construct full file path from server root
      const fullPath = path.join(__dirname, '../../', resumePath);
      
      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.error('Resume file not found', HTTP_STATUS.NOT_FOUND)
        );
      }

      // Get file stats
      const stats = fs.statSync(fullPath);
      const customFileName = 'jasil-meledath-resume.pdf';
      
      // Set headers for download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${customFileName}"`);
      res.setHeader('Content-Length', stats.size);
      
      // Create read stream and pipe to response
      const fileStream = fs.createReadStream(fullPath);
      fileStream.pipe(res);
      
    } catch (error) {
      next(error);
    }
  }

  /**
   * View resume file in browser
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async viewResume(req, res, next) {
    const fs = require('fs');
    const path = require('path');
    
    try {
      // Get personal info from the PersonalInfo collection
      const personalInfo = await PersonalInfo.findOne({ isActive: true });
      
      if (!personalInfo || !personalInfo.resumeUrl) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.error('Resume not found', HTTP_STATUS.NOT_FOUND)
        );
      }

      let resumePath = personalInfo.resumeUrl;
      
      // If it's a URL, extract the file path
      if (resumePath.startsWith('http://') || resumePath.startsWith('https://')) {
        // Extract the path from the URL (e.g., /uploads/resumes/filename.pdf)
        const url = new URL(resumePath);
        resumePath = url.pathname;
      }
      
      // Construct full file path from server root
      const fullPath = path.join(__dirname, '../../', resumePath);
      
      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.error('Resume file not found', HTTP_STATUS.NOT_FOUND)
        );
      }

      // Get file stats
      const stats = fs.statSync(fullPath);
      const customFileName = 'jasil-meledath-resume.pdf';
      
      // Set headers for inline viewing
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${customFileName}"`);
      res.setHeader('Content-Length', stats.size);
      
      // Create read stream and pipe to response
      const fileStream = fs.createReadStream(fullPath);
      fileStream.pipe(res);
      
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PortfolioController;
