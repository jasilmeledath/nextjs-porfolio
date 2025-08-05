/**
 * @fileoverview Portfolio Management Controller - Complete CRUD Operations
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 2.0.0
 */

const mongoose = require('mongoose');
const PersonalInfo = require('../models/PersonalInfo');
const SocialLink = require('../models/SocialLink');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../constants/http-status');
const { CustomError } = require('../errors/custom-errors');
const { getFileUrl, deleteOldFiles } = require('../middleware/upload-enhanced');
const { deleteImage } = require('../config/cloudinary');

/**
 * Portfolio Management Controller Class
 * @class PortfolioManagementController
 */
class PortfolioManagementController {
  
  // ==================== PORTFOLIO OVERVIEW ====================
  
  /**
   * Get complete portfolio data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getCompletePortfolio(req, res, next) {
    try {
      const userId = req.user.id;
      
      // Get all portfolio data
      const [
        personalInfo,
        socialLinks,
        skills,
        projects,
        experience
      ] = await Promise.all([
        PersonalInfo.findOne({ userId }),
        SocialLink.find({ userId }).sort({ order: 1 }),
        Skill.find({ userId, isActive: true }).sort({ proficiency: -1, name: 1 }),
        Project.find({ userId, isActive: true }).sort({ priority: -1, createdAt: -1 }),
        Experience.find({ userId }).sort({ startDate: -1 })
      ]);

      const portfolioData = {
        personalInfo,
        socialLinks,
        skills,
        projects,
        experience
      };
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success(portfolioData, 'Portfolio data retrieved successfully')
      );
    } catch (error) {
      console.error('[PortfolioController] Get complete portfolio error:', error);
      next(new CustomError('Failed to retrieve portfolio data', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Get portfolio statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getPortfolioStats(req, res, next) {
    try {
      const userId = req.user.id;
      
      const [
        personalInfoCount,
        socialLinksCount,
        skillsCount,
        projectsCount,
        experienceCount,
        featuredProjectsCount,
        activeSkillsCount,
        currentExperienceCount
      ] = await Promise.all([
        PersonalInfo.countDocuments({ userId }),
        SocialLink.countDocuments({ userId, isActive: true }),
        Skill.countDocuments({ userId, isActive: true }),
        Project.countDocuments({ userId, isActive: true }),
        Experience.countDocuments({ userId }),
        Project.countDocuments({ userId, isFeatured: true, isActive: true }),
        Skill.countDocuments({ userId, isActive: true }),
        Experience.countDocuments({ userId, isCurrent: true })
      ]);

      const stats = {
        personalInfo: personalInfoCount > 0,
        socialLinks: socialLinksCount,
        skills: skillsCount,
        projects: projectsCount,
        experience: experienceCount,
        featuredProjects: featuredProjectsCount,
        activeSkills: activeSkillsCount,
        currentExperience: currentExperienceCount,
        completionPercentage: Math.round(
          ((personalInfoCount > 0 ? 20 : 0) +
           (socialLinksCount > 0 ? 15 : 0) +
           (skillsCount > 0 ? 20 : 0) +
           (projectsCount > 0 ? 25 : 0) +
           (experienceCount > 0 ? 20 : 0)) 
        )
      };
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success(stats, 'Portfolio statistics retrieved successfully')
      );
    } catch (error) {
      console.error('[PortfolioController] Get portfolio stats error:', error);
      next(new CustomError('Failed to retrieve portfolio statistics', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  // ==================== PERSONAL INFO CRUD ====================
  
  /**
   * Get personal information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getPersonalInfo(req, res, next) {
    try {
      const userId = req.user.id;
      
      // In development mode, just get the first personal info record
      if (process.env.NODE_ENV === 'development') {
        const personalInfo = await PersonalInfo.findOne();
        
        return res.status(HTTP_STATUS.SUCCESS).json(
          ApiResponse.success(
            personalInfo, 
            personalInfo ? 'Personal information retrieved successfully' : 'No personal information found'
          )
        );
      } else {
        // Production mode - find by user ID
        const personalInfo = await PersonalInfo.findOne({ userId });
        
        return res.status(HTTP_STATUS.SUCCESS).json(
          ApiResponse.success(
            personalInfo, 
            personalInfo ? 'Personal information retrieved successfully' : 'No personal information found'
          )
        );
      }
    } catch (error) {
      console.error('[PortfolioController] Get personal info error:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        ApiResponse.error('Failed to retrieve personal information', HTTP_STATUS.INTERNAL_SERVER_ERROR)
      );
    }
  }

  /**
   * Create or update personal information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async upsertPersonalInfo(req, res, next) {
    try {
      
      // Get user ID from authenticated user
      const userId = req.user.id;
      
      // Extract form data
      const { name, title, location, email, phone, description } = req.body;
      
      // Handle file uploads from Cloudinary processing
      let avatar = null;
      let avatarPublicId = null;
      let avatarThumbnail = null;
      let resumeUrl = null;
      
      if (req.uploadResults) {
        if (req.uploadResults.avatar) {
          avatar = req.uploadResults.avatar.url;
          avatarPublicId = req.uploadResults.avatar.publicId;
          avatarThumbnail = req.uploadResults.avatar.thumbnailUrl;
        }
        if (req.uploadResults.resume) {
          resumeUrl = req.uploadResults.resume.url;
        }
      }
      
      // Prepare update data
      const updateData = {
        userId,
        name,
        title,
        location,
        email,
        phone,
        description
      };
      
      if (avatar) {
        updateData.avatar = avatar;
        updateData.avatarPublicId = avatarPublicId;
        updateData.avatarThumbnail = avatarThumbnail;
      }
      if (resumeUrl) updateData.resumeUrl = resumeUrl;
      
      
      // Find existing personal info
      const existingPersonalInfo = await PersonalInfo.findOne({ userId });
      
      let result;
      
      if (existingPersonalInfo) {
        
        // Delete old Cloudinary image if new one is uploaded
        if (avatar && existingPersonalInfo.avatarPublicId) {
          try {
            await deleteImage(existingPersonalInfo.avatarPublicId);
            console.log('✅ Deleted old avatar from Cloudinary');
          } catch (error) {
            console.error('⚠️ Failed to delete old avatar:', error.message);
          }
        }
        
        // Delete old resume file if new one is uploaded
        if (resumeUrl && existingPersonalInfo.resumeUrl) {
          deleteOldFiles([existingPersonalInfo.resumeUrl], 'resumes');
        }
        
        // Update existing
        result = await PersonalInfo.findOneAndUpdate(
          { userId },
          updateData,
          { new: true, runValidators: true }
        );
        
        
        return res.status(HTTP_STATUS.SUCCESS).json(
          ApiResponse.success('Personal information updated successfully', result)
        );
      } else {
        // Create new
        const newPersonalInfo = new PersonalInfo(updateData);
        
        // Save with explicit error handling
        try {
          result = await newPersonalInfo.save();
        } catch (saveError) {
          console.error('[PortfolioController] Error saving new record:', saveError);
          throw saveError;
        }
        
        return res.status(HTTP_STATUS.CREATED).json(
          ApiResponse.success('Personal information created successfully', result)
        );
      }
    } catch (error) {
      console.error('[PortfolioController] Upsert personal info error:', error);
      
      if (error.name === 'ValidationError') {
        const errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
        console.error('[PortfolioController] Validation error:', errorMessage);
        
        return next(new CustomError(
          errorMessage,
          HTTP_STATUS.BAD_REQUEST
        ));
      }
      
      next(new CustomError('Failed to save personal information', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  // ==================== SOCIAL LINKS CRUD ====================
  
  /**
   * Get all social links
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getSocialLinks(req, res, next) {
    try {
      const userId = req.user.id;
      
      const socialLinks = await SocialLink.find({ userId }).sort({ order: 1 });
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success(socialLinks, 'Social links retrieved successfully')
      );
    } catch (error) {
      console.error('[PortfolioController] Get social links error:', error);
      next(new CustomError('Failed to retrieve social links', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Create new social link
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createSocialLink(req, res, next) {
    try {
      const userId = req.user.id;
      const { platform, url, username, isActive, order } = req.body;
      
      const newSocialLink = new SocialLink({
        userId,
        platform,
        url,
        username,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      });
      
      await newSocialLink.save();
      
      return res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success(newSocialLink, 'Social link created successfully')
      );
    } catch (error) {
      console.error('[PortfolioController] Create social link error:', error);
      
      if (error.code === 11000) {
        return next(new CustomError('Social link platform already exists', HTTP_STATUS.CONFLICT));
      }
      
      if (error.name === 'ValidationError') {
        return next(new CustomError(
          Object.values(error.errors).map(err => err.message).join(', '),
          HTTP_STATUS.BAD_REQUEST
        ));
      }
      
      next(new CustomError('Failed to create social link', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Update social link
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateSocialLink(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { platform, url, username, isActive, order } = req.body;
      
      const updatedSocialLink = await SocialLink.findOneAndUpdate(
        { _id: id, userId },
        { platform, url, username, isActive, order },
        { new: true, runValidators: true }
      );
      
      if (!updatedSocialLink) {
        return next(new CustomError('Social link not found', HTTP_STATUS.NOT_FOUND));
      }
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success(updatedSocialLink, 'Social link updated successfully')
      );
    } catch (error) {
      console.error('[PortfolioController] Update social link error:', error);
      
      if (error.name === 'ValidationError') {
        return next(new CustomError(
          Object.values(error.errors).map(err => err.message).join(', '),
          HTTP_STATUS.BAD_REQUEST
        ));
      }
      
      next(new CustomError('Failed to update social link', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Delete social link
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteSocialLink(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const deletedSocialLink = await SocialLink.findOneAndDelete({ _id: id, userId });
      
      if (!deletedSocialLink) {
        return next(new CustomError('Social link not found', HTTP_STATUS.NOT_FOUND));
      }
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Social link deleted successfully')
      );
    } catch (error) {
      console.error('[PortfolioController] Delete social link error:', error);
      next(new CustomError('Failed to delete social link', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  // ==================== SKILLS CRUD ====================
  
  /**
   * Get all skills
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getSkills(req, res, next) {
    try {
      const userId = req.user.id;
      const { category } = req.query;
      
      const query = { userId };
      if (category) query.category = category;
      
      const skills = await Skill.find(query).sort({ category: 1, order: 1 });
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Skills retrieved successfully', skills)
      );
    } catch (error) {
      console.error('[PortfolioController] Get skills error:', error);
      next(new CustomError('Failed to retrieve skills', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Create new skill
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createSkill(req, res, next) {
    try {
      const userId = req.user.id;
      const { name, level, icon, logoIdentifier, logoLibrary, category, yearsOfExperience, isActive, order } = req.body;
      
      
      const newSkill = new Skill({
        userId,
        name,
        level,
        icon,
        logoIdentifier,
        logoLibrary,
        category,
        yearsOfExperience,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      });
      
      await newSkill.save();
      
      
      return res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success('Skill created successfully', newSkill)
      );
    } catch (error) {
      console.error('[PortfolioController] Create skill error:', error);
      
      if (error.code === 11000) {
        return next(new CustomError('Skill with this name already exists', HTTP_STATUS.CONFLICT));
      }
      
      if (error.name === 'ValidationError') {
        return next(new CustomError(
          Object.values(error.errors).map(err => err.message).join(', '),
          HTTP_STATUS.BAD_REQUEST
        ));
      }
      
      next(new CustomError('Failed to create skill', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Update skill
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateSkill(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { name, level, icon, logoIdentifier, logoLibrary, category, yearsOfExperience, isActive, order } = req.body;
      
      
      const updatedSkill = await Skill.findOneAndUpdate(
        { _id: id, userId },
        { name, level, icon, logoIdentifier, logoLibrary, category, yearsOfExperience, isActive, order },
        { new: true, runValidators: true }
      );
      
      if (!updatedSkill) {
        return next(new CustomError('Skill not found', HTTP_STATUS.NOT_FOUND));
      }

      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Skill updated successfully', updatedSkill)
      );
    } catch (error) {
      console.error('[PortfolioController] Update skill error:', error);
      
      if (error.name === 'ValidationError') {
        return next(new CustomError(
          Object.values(error.errors).map(err => err.message).join(', '),
          HTTP_STATUS.BAD_REQUEST
        ));
      }
      
      next(new CustomError('Failed to update skill', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Delete skill
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteSkill(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const deletedSkill = await Skill.findOneAndDelete({ _id: id, userId });
      
      if (!deletedSkill) {
        return next(new CustomError('Skill not found', HTTP_STATUS.NOT_FOUND));
      }
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Skill deleted successfully')
      );
    } catch (error) {
      console.error('[PortfolioController] Delete skill error:', error);
      next(new CustomError('Failed to delete skill', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  // ==================== PROJECTS CRUD ====================
  
  /**
   * Get all projects
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getProjects(req, res, next) {
    try {
      const userId = req.user.id;
      const { status, featured } = req.query;
      
      const query = { userId };
      if (status) query.status = status;
      if (featured !== undefined) query.isFeatured = featured === 'true';
      
      const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success({ projects }, 'Projects retrieved successfully')
      );
    } catch (error) {
      console.error('[PortfolioController] Get projects error:', error);
      next(new CustomError('Failed to retrieve projects', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Get single project by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getProject(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const project = await Project.findOne({ _id: id, userId });
      
      if (!project) {
        return next(new CustomError('Project not found', HTTP_STATUS.NOT_FOUND));
      }
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Project retrieved successfully', project)
      );
    } catch (error) {
      console.error('[PortfolioController] Get project error:', error);
      next(new CustomError('Failed to retrieve project', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Create new project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createProject(req, res, next) {
    try {
      const userId = req.user.id;
      const {
        title, description, longDescription, technologies, liveUrl, githubUrl,
        demoUrl, caseStudyUrl, isFeatured, status, stats, startDate, endDate,
        teamSize, myRole, challenges, learnings, order
      } = req.body;
      
      // Handle file uploads
      let images = [];
      let thumbnailImage = null;
      
      if (req.files) {
        if (req.files.projectImages) {
          images = req.files.projectImages.map(file => 
            getFileUrl(req, file.filename, 'projects')
          );
        }
        if (req.files.thumbnailImage && req.files.thumbnailImage[0]) {
          thumbnailImage = getFileUrl(req, req.files.thumbnailImage[0].filename, 'projects');
        }
      }
      
      // Parse technologies if it's a string
      let parsedTechnologies = technologies;
      if (typeof technologies === 'string') {
        try {
          parsedTechnologies = JSON.parse(technologies);
        } catch (e) {
          parsedTechnologies = [];
        }
      }
      
      // Parse stats if it's a string
      let parsedStats = stats;
      if (typeof stats === 'string') {
        try {
          parsedStats = JSON.parse(stats);
        } catch (e) {
          parsedStats = {};
        }
      }
      
      const newProject = new Project({
        userId,
        title,
        description,
        longDescription,
        technologies: parsedTechnologies || [],
        images: images.length > 0 ? images : ['/placeholder.svg'],
        thumbnailImage: thumbnailImage || '/placeholder.svg',
        liveUrl,
        githubUrl,
        demoUrl,
        caseStudyUrl,
        isFeatured: isFeatured || false,
        status: status || 'in-progress',
        stats: parsedStats || {},
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        teamSize: teamSize || 1,
        myRole,
        challenges: challenges || [],
        learnings: learnings || [],
        order: order || 0
      });
      
      await newProject.save();
      
      return res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success('Project created successfully', newProject)
      );
    } catch (error) {
      console.error('[PortfolioController] Create project error:', error);
      
      if (error.code === 11000) {
        return next(new CustomError('Project with this title already exists', HTTP_STATUS.CONFLICT));
      }
      
      if (error.name === 'ValidationError') {
        return next(new CustomError(
          Object.values(error.errors).map(err => err.message).join(', '),
          HTTP_STATUS.BAD_REQUEST
        ));
      }
      
      next(new CustomError('Failed to create project', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Update project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateProject(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const {
        title, description, longDescription, technologies, liveUrl, githubUrl,
        demoUrl, caseStudyUrl, isFeatured, status, stats, startDate, endDate,
        teamSize, myRole, challenges, learnings, order
      } = req.body;
      
      // Find existing project
      const existingProject = await Project.findOne({ _id: id, userId });
      if (!existingProject) {
        return next(new CustomError('Project not found', HTTP_STATUS.NOT_FOUND));
      }
      
      // Handle file uploads
      let images = existingProject.images || ['/placeholder.svg'];
      let thumbnailImage = existingProject.thumbnailImage || '/placeholder.svg';
      
      if (req.files) {
        if (req.files.projectImages) {
          // Delete old images (but not placeholder)
          if (existingProject.images && existingProject.images.length > 0 && 
              !existingProject.images.includes('/placeholder.svg')) {
            deleteOldFiles(existingProject.images, 'projects');
          }
          images = req.files.projectImages.map(file => 
            getFileUrl(req, file.filename, 'projects')
          );
        }
        if (req.files.thumbnailImage && req.files.thumbnailImage[0]) {
          // Delete old thumbnail (but not placeholder)
          if (existingProject.thumbnailImage && 
              existingProject.thumbnailImage !== '/placeholder.svg') {
            deleteOldFiles([existingProject.thumbnailImage], 'projects');
          }
          thumbnailImage = getFileUrl(req, req.files.thumbnailImage[0].filename, 'projects');
        }
      }
      
      // Parse technologies if it's a string
      let parsedTechnologies = technologies;
      if (typeof technologies === 'string') {
        try {
          parsedTechnologies = JSON.parse(technologies);
        } catch (e) {
          parsedTechnologies = existingProject.technologies;
        }
      }
      
      // Parse stats if it's a string
      let parsedStats = stats;
      if (typeof stats === 'string') {
        try {
          parsedStats = JSON.parse(stats);
        } catch (e) {
          parsedStats = existingProject.stats;
        }
      }
      
      // Parse challenges array from FormData format
      let parsedChallenges = challenges;
      if (req.body && typeof req.body === 'object') {
        const challengeKeys = Object.keys(req.body).filter(key => key.startsWith('challenges['));
        if (challengeKeys.length > 0) {
          parsedChallenges = challengeKeys.map(key => req.body[key]).filter(item => item && item.trim());
        } else if (typeof challenges === 'string') {
          try {
            parsedChallenges = JSON.parse(challenges);
          } catch (e) {
            parsedChallenges = existingProject.challenges || [];
          }
        } else if (!Array.isArray(challenges)) {
          parsedChallenges = existingProject.challenges || [];
        }
      }
      
      // Parse learnings array from FormData format
      let parsedLearnings = learnings;
      if (req.body && typeof req.body === 'object') {
        const learningKeys = Object.keys(req.body).filter(key => key.startsWith('learnings['));
        if (learningKeys.length > 0) {
          parsedLearnings = learningKeys.map(key => req.body[key]).filter(item => item && item.trim());
        } else if (typeof learnings === 'string') {
          try {
            parsedLearnings = JSON.parse(learnings);
          } catch (e) {
            parsedLearnings = existingProject.learnings || [];
          }
        } else if (!Array.isArray(learnings)) {
          parsedLearnings = existingProject.learnings || [];
        }
      }
      
      const updateData = {
        title,
        description,
        longDescription,
        technologies: parsedTechnologies,
        images: images && images.length > 0 ? images : ['/placeholder.svg'],
        thumbnailImage: thumbnailImage || '/placeholder.svg',
        liveUrl,
        githubUrl,
        demoUrl,
        caseStudyUrl,
        isFeatured,
        status,
        stats: parsedStats,
        startDate: startDate ? new Date(startDate) : existingProject.startDate,
        endDate: endDate ? new Date(endDate) : null,
        teamSize,
        myRole,
        challenges: parsedChallenges,
        learnings: parsedLearnings,
        order
      };
      
      const updatedProject = await Project.findOneAndUpdate(
        { _id: id, userId },
        updateData,
        { new: true, runValidators: true }
      );
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success(updatedProject, 'Project updated successfully')
      );
    } catch (error) {
      console.error('[PortfolioController] Update project error:', error);
      
      if (error.name === 'ValidationError') {
        return next(new CustomError(
          Object.values(error.errors).map(err => err.message).join(', '),
          HTTP_STATUS.BAD_REQUEST
        ));
      }
      
      next(new CustomError('Failed to update project', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Delete project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteProject(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const deletedProject = await Project.findOneAndDelete({ _id: id, userId });
      
      if (!deletedProject) {
        return next(new CustomError('Project not found', HTTP_STATUS.NOT_FOUND));
      }
      
      // Delete associated files
      if (deletedProject.images && deletedProject.images.length > 0) {
        deleteOldFiles(deletedProject.images, 'projects');
      }
      if (deletedProject.thumbnailImage) {
        deleteOldFiles([deletedProject.thumbnailImage], 'projects');
      }
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Project deleted successfully')
      );
    } catch (error) {
      console.error('[PortfolioController] Delete project error:', error);
      next(new CustomError('Failed to delete project', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  // ==================== EXPERIENCE CRUD ====================
  
  /**
   * Get all experience entries
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getExperience(req, res, next) {
    try {
      const userId = req.user.id;
      
      const experience = await Experience.find({ userId }).sort({ order: 1, startDate: -1 });
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Experience retrieved successfully', experience)
      );
    } catch (error) {
      console.error('[PortfolioController] Get experience error:', error);
      next(new CustomError('Failed to retrieve experience', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Create new experience entry
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createExperience(req, res, next) {
    try {
      const userId = req.user.id;
      const {
        company, position, description, startDate, endDate, isCurrent,
        location, companyUrl, technologies, achievements, order
      } = req.body;
      
      // Parse JSON strings for arrays (sent from FormData)
      let parsedTechnologies = [];
      let parsedAchievements = [];
      
      if (technologies) {
        try {
          parsedTechnologies = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
        } catch (e) {
          console.warn('[Experience] Failed to parse technologies:', technologies);
          parsedTechnologies = [];
        }
      }
      
      if (achievements) {
        try {
          parsedAchievements = typeof achievements === 'string' ? JSON.parse(achievements) : achievements;
        } catch (e) {
          console.warn('[Experience] Failed to parse achievements:', achievements);
          parsedAchievements = [];
        }
      }
      
      // Handle file uploads
      let companyLogo = null;
      
      if (req.files && req.files.companyLogo && req.files.companyLogo[0]) {
        companyLogo = getFileUrl(req, req.files.companyLogo[0].filename, 'company-logos');
      }
      
      const newExperience = new Experience({
        userId,
        company,
        position,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent === 'true' || isCurrent === true,
        location,
        companyUrl,
        companyLogo,
        technologies: parsedTechnologies,
        achievements: parsedAchievements,
        order: parseInt(order) || 0
      });
      
      await newExperience.save();
      
      return res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success('Experience created successfully', newExperience)
      );
    } catch (error) {
      console.error('[PortfolioController] Create experience error:', error);
      
      if (error.name === 'ValidationError') {
        return next(new CustomError(
          Object.values(error.errors).map(err => err.message).join(', '),
          HTTP_STATUS.BAD_REQUEST
        ));
      }
      
      next(new CustomError('Failed to create experience', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Update experience entry
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateExperience(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const {
        company, position, description, startDate, endDate, isCurrent,
        location, companyUrl, technologies, achievements, order
      } = req.body;
      
      // Parse JSON strings for arrays (sent from FormData)
      let parsedTechnologies = [];
      let parsedAchievements = [];
      
      if (technologies) {
        try {
          parsedTechnologies = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
        } catch (e) {
          console.warn('[Experience] Failed to parse technologies:', technologies);
          parsedTechnologies = [];
        }
      }
      
      if (achievements) {
        try {
          parsedAchievements = typeof achievements === 'string' ? JSON.parse(achievements) : achievements;
        } catch (e) {
          console.warn('[Experience] Failed to parse achievements:', achievements);
          parsedAchievements = [];
        }
      }
      
      // Find existing experience
      const existingExperience = await Experience.findOne({ _id: id, userId });
      if (!existingExperience) {
        return next(new CustomError('Experience not found', HTTP_STATUS.NOT_FOUND));
      }
      
      // Handle file uploads
      let companyLogo = existingExperience.companyLogo;
      
      if (req.files && req.files.companyLogo && req.files.companyLogo[0]) {
        // Delete old logo
        if (existingExperience.companyLogo) {
          deleteOldFiles([existingExperience.companyLogo], 'company-logos');
        }
        companyLogo = getFileUrl(req, req.files.companyLogo[0].filename, 'company-logos');
      }
      
      const updateData = {
        company,
        position,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent === 'true' || isCurrent === true,
        location,
        companyUrl,
        companyLogo,
        technologies: parsedTechnologies,
        achievements: parsedAchievements,
        order: parseInt(order) || 0
      };
      
      const updatedExperience = await Experience.findOneAndUpdate(
        { _id: id, userId },
        updateData,
        { new: true, runValidators: true }
      );
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Experience updated successfully', updatedExperience)
      );
    } catch (error) {
      console.error('[PortfolioController] Update experience error:', error);
      
      if (error.name === 'ValidationError') {
        return next(new CustomError(
          Object.values(error.errors).map(err => err.message).join(', '),
          HTTP_STATUS.BAD_REQUEST
        ));
      }
      
      next(new CustomError('Failed to update experience', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Delete experience entry
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteExperience(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const deletedExperience = await Experience.findOneAndDelete({ _id: id, userId });
      
      if (!deletedExperience) {
        return next(new CustomError('Experience not found', HTTP_STATUS.NOT_FOUND));
      }
      
      // Delete associated logo file
      if (deletedExperience.companyLogo) {
        deleteOldFiles([deletedExperience.companyLogo], 'company-logos');
      }
      
      return res.status(HTTP_STATUS.SUCCESS).json(
        ApiResponse.success('Experience deleted successfully')
      );
    } catch (error) {
      console.error('[PortfolioController] Delete experience error:', error);
      next(new CustomError('Failed to delete experience', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  // ==================== RESUME MANAGEMENT ====================

  /**
   * Download resume file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async downloadResume(req, res, next) {
    try {
      const userId = req.user.id;
      
      
      // Get personal info with resume URL
      const personalInfo = await PersonalInfo.findOne({ userId });
      if (!personalInfo || !personalInfo.resumeUrl) {
        return next(new CustomError('Resume not found', HTTP_STATUS.NOT_FOUND));
      }
      
      // Extract filename from URL
      const resumeFileName = personalInfo.resumeUrl.split('/').pop();
      const fs = require('fs');
      const path = require('path');
      
      // Construct file path
      const resumeFilePath = path.join(process.cwd(), 'uploads', 'resumes', resumeFileName);
      
      // Check if file exists
      if (!fs.existsSync(resumeFilePath)) {
        console.error(`[PortfolioController] Resume file not found at: ${resumeFilePath}`);
        return next(new CustomError('Resume file not found on server', HTTP_STATUS.NOT_FOUND));
      }
      
      // Set appropriate headers for download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${resumeFileName}"`);
      res.setHeader('Cache-Control', 'no-cache');
      
      // Stream the file
      const fileStream = fs.createReadStream(resumeFilePath);
      fileStream.pipe(res);
      
      fileStream.on('error', (error) => {
        console.error('[PortfolioController] File stream error:', error);
        next(new CustomError('Error reading resume file', HTTP_STATUS.INTERNAL_SERVER_ERROR));
      });
      
      
    } catch (error) {
      console.error('[PortfolioController] Download resume error:', error);
      next(new CustomError('Failed to download resume', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * View resume in browser
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async viewResume(req, res, next) {
    try {
      const userId = req.user.id;
      
      
      // Get personal info with resume URL
      const personalInfo = await PersonalInfo.findOne({ userId });
      if (!personalInfo || !personalInfo.resumeUrl) {
        return next(new CustomError('Resume not found', HTTP_STATUS.NOT_FOUND));
      }
      
      // Extract filename from URL
      const resumeFileName = personalInfo.resumeUrl.split('/').pop();
      const fs = require('fs');
      const path = require('path');
      
      // Construct file path
      const resumeFilePath = path.join(process.cwd(), 'uploads', 'resumes', resumeFileName);
      
      // Check if file exists
      if (!fs.existsSync(resumeFilePath)) {
        console.error(`[PortfolioController] Resume file not found at: ${resumeFilePath}`);
        return next(new CustomError('Resume file not found on server', HTTP_STATUS.NOT_FOUND));
      }
      
      // Set appropriate headers for inline viewing
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${resumeFileName}"`);
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      
      // Stream the file
      const fileStream = fs.createReadStream(resumeFilePath);
      fileStream.pipe(res);
      
      fileStream.on('error', (error) => {
        console.error('[PortfolioController] File stream error:', error);
        next(new CustomError('Error reading resume file', HTTP_STATUS.INTERNAL_SERVER_ERROR));
      });
      
      
    } catch (error) {
      console.error('[PortfolioController] View resume error:', error);
      next(new CustomError('Failed to view resume', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = PortfolioManagementController;
