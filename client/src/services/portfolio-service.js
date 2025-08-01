/**
 * @fileoverview Portfolio Service - API calls for portfolio operations
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { getApiBaseUrl, getServerBaseUrl, isTunneledEnvironment } from '../utils/api-config';

const API_BASE_URL = getApiBaseUrl();

/**
 * Portfolio Service Class
 * @class PortfolioService
 */
class PortfolioService {
  /**
   * Process image URLs for tunnel compatibility
   * @param {string} url - Image URL to process
   * @returns {string} Processed URL
   */
  static processImageUrl(url) {
    if (!url || url === "/placeholder.svg" || !url.startsWith('http://localhost')) {
      return url;
    }
    // Convert localhost URLs to proxy routes for tunnel environments
    if (typeof window !== 'undefined' && 
        (window.location.origin.includes('.trycloudflare.com') ||
         window.location.origin.includes('.ngrok.io') ||
         window.location.origin.includes('.loca.lt'))) {
      return url.replace('http://localhost:8000', '/api');
    }
    return url;
  }

  /**
   * Get authentication headers
   * @returns {Object} Headers object
   */
  static getAuthHeaders() {
    const token = typeof window !== 'undefined' ? Cookies.get('auth_token') : null;
    
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  /**
   * Handle API response
   * @param {Response} response - Fetch response
   * @param {boolean} showToast - Whether to show toast notifications
   * @returns {Promise<Object>} Parsed response data
   */
  static async handleResponse(response, showToast = true) {
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data.message || data.error?.details || 'An error occurred';
      
      if (showToast) {
        if (response.status === 401) {
          toast.error('Authentication required. Please login again.');
        } else if (response.status === 403) {
          toast.error('Access denied. You don\'t have permission to perform this action.');
        } else if (response.status === 404) {
          toast.error('Project not found.');
        } else {
          toast.error(errorMessage);
        }
      }
      
      throw new Error(errorMessage);
    }
    
    return data;
  }

  /**
   * Make a generic API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} API response
   */
  static async makeRequest(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      return await this.handleResponse(response, false);
    } catch (error) {
      console.error('[PortfolioService] API request error:', error);
      throw error;
    }
  }

  /**
   * Get all portfolio projects with filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response with projects and pagination
   */
  static async getAllProjects(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/portfolio${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response, false);
    } catch (error) {
      console.error('[PortfolioService] Error fetching projects:', error);
      throw error;
    }
  }

  /**
   * Get a single project by slug
   * @param {string} slug - Project slug
   * @param {boolean} incrementView - Whether to increment view count
   * @returns {Promise<Object>} API response with project data
   */
  static async getProjectBySlug(slug, incrementView = true) {
    try {
      const url = `${API_BASE_URL}/portfolio/${slug}${incrementView ? '?incrementView=true' : '?incrementView=false'}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const result = await this.handleResponse(response, false);
      
      // Process the project data if it exists
      if (result.success && result.data) {
        result.data = this.processSingleProject(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('[PortfolioService] Error fetching project:', error);
      throw error;
    }
  }

  /**
   * Get featured projects
   * @param {number} limit - Number of projects to return
   * @returns {Promise<Object>} API response with featured projects
   */
  static async getFeaturedProjects(limit = 6) {
    try {
      const url = `${API_BASE_URL}/portfolio/featured?limit=${limit}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response, false);
    } catch (error) {
      console.error('[PortfolioService] Error fetching featured projects:', error);
      throw error;
    }
  }

  /**
   * Get projects by category
   * @param {string} category - Project category
   * @param {number} limit - Number of projects to return
   * @returns {Promise<Object>} API response with category projects
   */
  static async getProjectsByCategory(category, limit = 10) {
    try {
      const url = `${API_BASE_URL}/portfolio/category/${category}?limit=${limit}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response, false);
    } catch (error) {
      console.error('[PortfolioService] Error fetching category projects:', error);
      throw error;
    }
  }

  /**
   * Get portfolio metadata (categories, technologies, etc.)
   * @returns {Promise<Object>} API response with metadata
   */
  static async getMetadata() {
    try {
      const url = `${API_BASE_URL}/portfolio/metadata`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response, false);
    } catch (error) {
      console.error('[PortfolioService] Error fetching metadata:', error);
      throw error;
    }
  }

  /**
   * Create a new project (Admin only)
   * @param {Object} projectData - Project data
   * @returns {Promise<Object>} API response with created project
   */
  static async createProject(projectData) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(projectData)
      });

      const result = await this.handleResponse(response, true);
      toast.success('Project created successfully!');
      return result;
    } catch (error) {
      console.error('[PortfolioService] Error creating project:', error);
      throw error;
    }
  }

  /**
   * Update a project (Admin only)
   * @param {string} projectId - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise<Object>} API response with updated project
   */
  static async updateProject(projectId, projectData) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${projectId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(projectData)
      });

      const result = await this.handleResponse(response, true);
      toast.success('Project updated successfully!');
      return result;
    } catch (error) {
      console.error('[PortfolioService] Error updating project:', error);
      throw error;
    }
  }

  /**
   * Delete a project (Admin only)
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} API response
   */
  static async deleteProject(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${projectId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const result = await this.handleResponse(response, true);
      toast.success('Project deleted successfully!');
      return result;
    } catch (error) {
      console.error('[PortfolioService] Error deleting project:', error);
      throw error;
    }
  }

  /**
   * Toggle project status (Admin only)
   * @param {string} projectId - Project ID
   * @param {string} status - New status
   * @returns {Promise<Object>} API response with updated project
   */
  static async toggleProjectStatus(projectId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${projectId}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status })
      });

      const result = await this.handleResponse(response, true);
      toast.success(`Project ${status} successfully!`);
      return result;
    } catch (error) {
      console.error('[PortfolioService] Error updating project status:', error);
      throw error;
    }
  }

  /**
   * Toggle featured status (Admin only)
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} API response with updated project
   */
  static async toggleFeaturedStatus(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${projectId}/featured`, {
        method: 'PATCH',
        headers: this.getAuthHeaders()
      });

      const result = await this.handleResponse(response, true);
      toast.success('Featured status updated successfully!');
      return result;
    } catch (error) {
      console.error('[PortfolioService] Error updating featured status:', error);
      throw error;
    }
  }

  /**
   * Get portfolio statistics (Admin only)
   * @returns {Promise<Object>} API response with statistics
   */
  static async getPortfolioStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response, false);
    } catch (error) {
      console.error('[PortfolioService] Error fetching portfolio stats:', error);
      throw error;
    }
  }

  /**
   * Search projects
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} API response with search results
   */
  static async searchProjects(query, filters = {}) {
    try {
      const params = {
        search: query,
        ...filters
      };

      return await this.getAllProjects(params);
    } catch (error) {
      console.error('[PortfolioService] Error searching projects:', error);
      throw error;
    }
  }

  /**
   * Get projects by technology
   * @param {string|Array} technologies - Technology name(s)
   * @param {Object} additionalParams - Additional query parameters
   * @returns {Promise<Object>} API response with projects
   */
  static async getProjectsByTechnology(technologies, additionalParams = {}) {
    try {
      const techParam = Array.isArray(technologies) 
        ? technologies.join(',') 
        : technologies;

      const params = {
        technologies: techParam,
        ...additionalParams
      };

      return await this.getAllProjects(params);
    } catch (error) {
      console.error('[PortfolioService] Error fetching projects by technology:', error);
      throw error;
    }
  }

  /**
   * Get related projects based on technologies and category
   * @param {string} currentProjectId - Current project ID to exclude
   * @param {Array} technologies - Project technologies
   * @param {string} category - Project category
   * @param {number} limit - Number of related projects to return
   * @returns {Promise<Object>} API response with related projects
   */
  static async getRelatedProjects(currentProjectId, technologies = [], category = '', limit = 4) {
    try {
      const params = {
        limit,
        status: 'published'
      };

      // Add technology filter if technologies are provided
      if (technologies.length > 0) {
        params.technologies = technologies.slice(0, 3).join(','); // Use top 3 technologies
      }

      // Add category filter if provided
      if (category) {
        params.category = category;
      }

      const response = await this.getAllProjects(params);
      
      // Filter out the current project
      if (response.data && response.data.projects) {
        response.data.projects = response.data.projects.filter(
          project => project._id !== currentProjectId
        );
      }

      return response;
    } catch (error) {
      console.error('[PortfolioService] Error fetching related projects:', error);
      throw error;
    }
  }

  // ==================== PUBLIC VISITOR METHODS ====================

  /**
   * Get complete portfolio data for visitor mode
   * @returns {Promise<Object>} Complete portfolio data
   */
  static async getVisitorPortfolio() {
    try {
      const response = await this.makeRequest('/portfolio/visitor');
      return response;
    } catch (error) {
      console.error('[PortfolioService] Error fetching visitor portfolio:', error);
      throw error;
    }
  }

  /**
   * Get public personal information
   * @returns {Promise<Object>} Personal info data
   */
  static async getPublicPersonalInfo() {
    try {
      const response = await this.makeRequest('/portfolio/personal-info');
      return this.processPersonalInfoData(response);
    } catch (error) {
      console.error('[PortfolioService] Error fetching personal info:', error);
      throw error;
    }
  }

  /**
   * Process personal info data for display
   * @param {Object} personalInfo - Raw personal info object
   * @returns {Object} Processed personal info
   */
  static processPersonalInfoData(personalInfo) {
    if (!personalInfo) return null;
    
    return {
      ...personalInfo,
      avatar: this.processImageUrl(personalInfo.avatar),
      resumeUrl: this.processImageUrl(personalInfo.resumeUrl)
    };
  }

  /**
   * Get public skills
   * @returns {Promise<Object>} Skills data
   */
  static async getPublicSkills() {
    try {
      const response = await this.makeRequest('/portfolio/skills');
      return response;
    } catch (error) {
      console.error('[PortfolioService] Error fetching skills:', error);
      throw error;
    }
  }

  /**
   * Get public experience
   * @returns {Promise<Object>} Experience data
   */
  static async getPublicExperience() {
    try {
      const response = await this.makeRequest('/portfolio/experience');
      return this.processExperienceData(response);
    } catch (error) {
      console.error('[PortfolioService] Error fetching experience:', error);
      throw error;
    }
  }

  /**
   * Get public social links
   * @returns {Promise<Object>} Social links data
   */
  static async getPublicSocialLinks() {
    try {
      const response = await this.makeRequest('/portfolio/social-links');
      return response;
    } catch (error) {
      console.error('[PortfolioService] Error fetching social links:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get file URL for uploads
   * @param {string} filename - File name
   * @param {string} folder - Folder name (avatars, projects, etc.)
   * @returns {string} Full file URL
   */
  static getFileUrl(filename, folder = '') {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename; // Already full URL
    
    const baseUrl = getServerBaseUrl();
    return `${baseUrl}/uploads/${folder ? folder + '/' : ''}${filename}`;
  }

  /**
   * Process skills data to group by category
   * @param {Array} skills - Raw skills array
   * @returns {Object} Grouped skills by category
   */
  static processSkillsData(skills) {
    if (!Array.isArray(skills)) return {};
    
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push({
        name: skill.name,
        level: skill.level,
        icon: skill.icon || '🔧'
      });
      return acc;
    }, {});
  }

  /**
   * Parse array field that might be a stringified JSON
   * @param {string|Array} field - Field to parse
   * @returns {Array} Parsed array
   */
  static parseArrayField(field) {
    if (!field) return [];
    
    // If it's already an array, return it
    if (Array.isArray(field)) return field;
    
    // If it's a string, try to parse it
    if (typeof field === 'string') {
      try {
        // Handle the case where the field is a stringified array of stringified JSON
        // e.g., "[\"[\\\"item1\\\",\\\"item2\\\"]\"]"
        let parsed = JSON.parse(field);
        
        // If the parsed result is an array with one string element that looks like JSON
        if (Array.isArray(parsed) && parsed.length === 1 && typeof parsed[0] === 'string') {
          try {
            const innerParsed = JSON.parse(parsed[0]);
            if (Array.isArray(innerParsed)) {
              return innerParsed;
            }
          } catch (e) {
            // If inner parsing fails, return the outer parsed array
            return parsed;
          }
        }
        
        // If the parsed result is already a proper array
        if (Array.isArray(parsed)) {
          return parsed;
        }
        
        // If it's a single string that should be an array
        return [parsed];
      } catch (error) {
        console.warn('Failed to parse array field:', field, error);
        // If parsing fails, try to split by comma or return as single item array
        if (field.includes(',')) {
          return field.split(',').map(item => item.trim());
        }
        return [field];
      }
    }
    
    return [];
  }

  /**
   * Process single project data for display
   * @param {Object} project - Raw project object
   * @returns {Object} Processed project
   */
  static processSingleProject(project) {
    if (!project) return null;
    
    const processedProject = {
      id: project._id || project.id,
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      tech: (project.technologies || []).map(tech => typeof tech === 'string' ? tech : tech.name),
      technologies: project.technologies || [],
      image: this.processImageUrl(project.thumbnailImage) || "/placeholder.svg",
      images: project.images && project.images.length > 0 ? 
        project.images.map(img => this.processImageUrl(img)) : 
        [this.processImageUrl(project.thumbnailImage) || "/placeholder.svg"],
      thumbnailImage: this.processImageUrl(project.thumbnailImage) || "/placeholder.svg",
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      caseStudyUrl: project.caseStudyUrl,
      featured: project.isFeatured,
      isFeatured: project.isFeatured,
      category: project.category,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      teamSize: project.teamSize,
      myRole: project.myRole,
      challenges: this.parseArrayField(project.challenges) || [],
      learnings: this.parseArrayField(project.learnings) || [],
      features: project.features || [],
      stats: project.stats || {
        users: '0',
        performance: '97%',
        rating: 5,
        uptime: '99.9%',
        githubStars: 0,
        deployments: 0
      }
    };
    
    console.log('Processed single project challenges:', processedProject.challenges);
    console.log('Processed single project learnings:', processedProject.learnings);
    
    return processedProject;
  }

  /**
   * Process projects data for display
   * @param {Array} projects - Raw projects array
   * @returns {Array} Processed projects
   */
  static processProjectsData(projects) {
    if (!Array.isArray(projects)) return [];
    
    return projects.map(project => this.processSingleProject(project)).filter(Boolean);
  }

  /**
   * Process experience data for display
   * @param {Array} experience - Raw experience array
   * @returns {Array} Processed experience
   */
  static processExperienceData(experience) {
    if (!Array.isArray(experience)) return [];
    
    return experience.map(exp => ({
      id: exp._id || exp.id,
      company: exp.company,
      position: exp.position,
      location: exp.location,
      description: exp.description,
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      companyLogo: this.processImageUrl(exp.companyLogo),
      companyUrl: exp.companyUrl,
      achievements: exp.achievements || [],
      technologies: exp.technologies || []
    }));
  }

  /**
   * Process social links data for display
   * @param {Array} socialLinks - Raw social links array
   * @returns {Array} Processed social links
   */
  static processSocialLinksData(socialLinks) {
    if (!Array.isArray(socialLinks)) return [];
    
    return socialLinks
      .filter(link => link.isActive)
      .sort((a, b) => a.order - b.order)
      .map(link => ({
        id: link._id || link.id,
        platform: link.platform,
        url: link.url,
        username: link.username
      }));
  }
}

export default PortfolioService;
