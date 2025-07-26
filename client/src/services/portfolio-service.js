/**
 * @fileoverview Portfolio Service - API calls for portfolio operations
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Portfolio Service Class
 * @class PortfolioService
 */
class PortfolioService {
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

      return await this.handleResponse(response, false);
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
      return response;
    } catch (error) {
      console.error('[PortfolioService] Error fetching personal info:', error);
      throw error;
    }
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
      return response;
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
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
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
   * Process projects data for display
   * @param {Array} projects - Raw projects array
   * @returns {Array} Processed projects
   */
  static processProjectsData(projects) {
    if (!Array.isArray(projects)) return [];
    
    return projects.map(project => {
      const processedProject = {
        id: project._id || project.id,
        title: project.title,
        description: project.description,
        tech: (project.technologies || []).map(tech => typeof tech === 'string' ? tech : tech.name),
        image: project.thumbnailImage || "/placeholder.svg",
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        featured: project.isFeatured,
        category: project.category,
        status: project.status,
        stats: project.stats || {
          users: '0',
          performance: '97%',
          rating: 5,
          uptime: '99.9%',
          githubStars: 0,
          deployments: 0
        }
      };
      
      console.log('Processed project image URL:', processedProject.image);
      return processedProject;
    });
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
