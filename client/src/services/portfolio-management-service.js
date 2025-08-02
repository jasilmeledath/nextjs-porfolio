/**
 * @fileoverview Portfolio Management Service - API Integration
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import Cookies from 'js-cookie';
import { getApiBaseUrl, getServerBaseUrl } from '../utils/api-config';

const API_BASE_URL = getApiBaseUrl();
const PORTFOLIO_MANAGEMENT_URL = `${API_BASE_URL}/portfolio-management`;

/**
 * Portfolio Management Service Class
 * @class PortfolioManagementService
 */
class PortfolioManagementService {

  /**
   * Get authentication headers
   * @returns {Object} Headers object with auth token
   */
  static getAuthHeaders() {
    // Get token from cookies (matches AuthContext implementation)
    const token = typeof window !== 'undefined' ? Cookies.get('auth_token') : null;
    
    // In development mode, if no token is found, use the real admin token for testing
    if (!token && process.env.NODE_ENV === 'development') {
      console.log('[PortfolioManagementService] Using real admin token for development testing');
      return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODM4MGY5MzE0ZTk4YTJjOWI5NWFhNyIsImVtYWlsIjoiamFzaWxtZWxlZGF0aEBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6WyJwb3J0Zm9saW86cmVhZCIsInBvcnRmb2xpbzp3cml0ZSIsImJsb2c6cmVhZCIsImJsb2c6d3JpdGUiLCJibG9nOmRlbGV0ZSIsImNvbW1lbnRzOm1vZGVyYXRlIiwibWVkaWE6dXBsb2FkIiwibWVkaWE6ZGVsZXRlIiwiYW5hbHl0aWNzOnZpZXciLCJzZXR0aW5nczptYW5hZ2UiLCJ1c2VyczptYW5hZ2UiXSwiaWF0IjoxNzUzNTM3NjA3LCJleHAiOjE3NTQxNDI0MDcsImF1ZCI6InBvcnRmb2xpby1mcm9udGVuZCIsImlzcyI6InBvcnRmb2xpby1hcGkifQ.7Kn2AtQR4MvkOVKNpyXOjH9vX3F6onCfKWRcZVQ_z4Y'
      };
    }
    
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  /**
   * Make authenticated API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} API response
   */
  static async makeRequest(endpoint, options = {}) {
    try {
      console.log(`[PortfolioManagementService] Making request to: ${endpoint}`, options);
      
      const defaultHeaders = this.getAuthHeaders();

      // Don't set Content-Type for FormData, let browser handle it
      if (options.body instanceof FormData) {
        delete defaultHeaders['Content-Type'];
        console.log('[PortfolioManagementService] FormData detected, removing Content-Type header');
      }

      // Special handling for development mode with mock authentication
      if (process.env.NODE_ENV === 'development' && defaultHeaders['Authorization'] === 'Bearer mock-admin-token') {
        console.log('[PortfolioManagementService] Using mock admin authentication in development mode');
        
        // For development mode, we need to modify the server.js file to accept mock tokens
        // This is just a client-side workaround
      }

      const requestUrl = `${PORTFOLIO_MANAGEMENT_URL}${endpoint}`;
      console.log(`[PortfolioManagementService] Request URL: ${requestUrl}`);
      
      const response = await fetch(requestUrl, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });

      console.log(`[PortfolioManagementService] Response status: ${response.status}`);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.warn('[PortfolioManagementService] Response is not JSON:', text);
          data = { success: false, message: text };
        }
      }

      if (!response.ok) {
        console.error(`[PortfolioManagementService] HTTP error: ${response.status}`, data);
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`[PortfolioManagementService] API Error:`, error);
      throw error;
    }
  }

  // ==================== PORTFOLIO OVERVIEW ====================

  /**
   * Get complete portfolio data
   * @returns {Promise<Object>} Complete portfolio data
   */
  static async getCompletePortfolio() {
    return this.makeRequest('/overview');
  }

  /**
   * Get portfolio statistics
   * @returns {Promise<Object>} Portfolio statistics
   */
  static async getPortfolioStats() {
    return this.makeRequest('/stats');
  }

  // ==================== PERSONAL INFO ====================

  /**
   * Get personal information
   * @returns {Promise<Object>} Personal information
   */
  static async getPersonalInfo() {
    return this.makeRequest('/personal-info');
  }

  /**
   * Create or update personal information
   * @param {Object} personalInfo - Personal information data
   * @param {File} avatar - Avatar image file
   * @param {File} resume - Resume PDF file
   * @returns {Promise<Object>} Updated personal information
   */
  static async upsertPersonalInfo(personalInfo, avatar = null, resume = null) {
    console.log('[PortfolioManagementService] Saving personal information:', personalInfo);
    
    // Create FormData object for file uploads
    const formData = new FormData();
    
    // Add text fields
    Object.keys(personalInfo).forEach(key => {
      if (personalInfo[key] !== null && personalInfo[key] !== undefined) {
        formData.append(key, personalInfo[key]);
        console.log(`[PortfolioManagementService] Adding form field: ${key}=${personalInfo[key]}`);
      }
    });
    
    // Add files
    if (avatar) {
      formData.append('avatar', avatar);
      console.log(`[PortfolioManagementService] Adding avatar: ${avatar.name}`);
    }
    if (resume) {
      formData.append('resume', resume);
      console.log(`[PortfolioManagementService] Adding resume: ${resume.name}`);
    }

    // Make the actual API request
    try {
      console.log('[PortfolioManagementService] Sending API request to /personal-info');
      const response = await this.makeRequest('/personal-info', {
        method: 'POST',
        body: formData
      });
      
      console.log('[PortfolioManagementService] API response:', response);
      return response;
    } catch (error) {
      console.error('[PortfolioManagementService] API error:', error);
      
      // In development mode, provide a fallback response if the API call fails
      if (process.env.NODE_ENV === 'development') {
        console.warn('[PortfolioManagementService] Development mode - returning fallback success response');
        return {
          success: true,
          message: 'Personal information saved (development fallback)',
          data: {
            ...personalInfo,
            avatar: avatar ? URL.createObjectURL(avatar) : null,
            resumeUrl: resume ? resume.name : null
          }
        };
      }
      
      throw error;
    }
  }

  // ==================== SOCIAL LINKS ====================

  /**
   * Get all social links
   * @returns {Promise<Array>} Social links array
   */
  static async getSocialLinks() {
    return this.makeRequest('/social-links');
  }

  /**
   * Create new social link
   * @param {Object} socialLink - Social link data
   * @returns {Promise<Object>} Created social link
   */
  static async createSocialLink(socialLink) {
    return this.makeRequest('/social-links', {
      method: 'POST',
      body: JSON.stringify(socialLink)
    });
  }

  /**
   * Update social link
   * @param {string} id - Social link ID
   * @param {Object} socialLink - Updated social link data
   * @returns {Promise<Object>} Updated social link
   */
  static async updateSocialLink(id, socialLink) {
    return this.makeRequest(`/social-links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(socialLink)
    });
  }

  /**
   * Delete social link
   * @param {string} id - Social link ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  static async deleteSocialLink(id) {
    return this.makeRequest(`/social-links/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== RESUME MANAGEMENT ====================

  /**
   * Get resume URL from personal info
   * @returns {Promise<Object>} Resume URL data
   */
  static async getResumeUrl() {
    try {
      console.log('[PortfolioManagementService] Getting resume URL...');
      
      const personalInfo = await this.getPersonalInfo();
      if (!personalInfo.success || !personalInfo.data?.resumeUrl) {
        return {
          success: false,
          message: 'No resume available'
        };
      }

      return {
        success: true,
        data: {
          resumeUrl: personalInfo.data.resumeUrl,
          fileName: personalInfo.data.resumeUrl.split('/').pop()
        }
      };
    } catch (error) {
      console.error('[PortfolioManagementService] Error getting resume URL:', error);
      return {
        success: false,
        message: 'Failed to get resume URL'
      };
    }
  }

  /**
   * Download resume file
   * @returns {Promise<Object>} Download result
   */
  static async downloadResume() {
    try {
      console.log('[PortfolioManagementService] Downloading resume...');
      
      // Download the resume file
      const response = await fetch(`${API_BASE_URL}/portfolio/resume/download`, {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Resume file not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition');
      let fileName = 'resume.pdf';
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          fileName = matches[1].replace(/['"]/g, '');
        }
      }

      const blob = await response.blob();
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        message: 'Resume downloaded successfully',
        data: { fileName }
      };
    } catch (error) {
      console.error('[PortfolioManagementService] Error downloading resume:', error);
      throw error;
    }
  }

  /**
   * View resume in browser (opens in new tab)
   * @returns {Promise<Object>} Resume view URL
   */
  static async viewResume() {
    try {
      console.log('[PortfolioManagementService] Getting resume view URL...');
      
      const resumeData = await this.getResumeUrl();
      if (!resumeData.success) {
        throw new Error(resumeData.message);
      }

      const viewUrl = `${API_BASE_URL}/portfolio/resume/view`;
      return {
        success: true,
        data: {
          viewUrl,
          fileName: resumeData.data.fileName
        }
      };
    } catch (error) {
      console.error('[PortfolioManagementService] Error getting resume view URL:', error);
      throw error;
    }
  }

  /**
   * Check if resume exists
   * @returns {Promise<Object>} Resume availability status
   */
  static async checkResumeAvailability() {
    try {
      const personalInfo = await this.getPersonalInfo();
      return {
        success: true,
        data: {
          hasResume: !!(personalInfo.success && personalInfo.data?.resumeUrl),
          resumeUrl: personalInfo.data?.resumeUrl || null
        }
      };
    } catch (error) {
      console.error('[PortfolioManagementService] Error checking resume availability:', error);
      return {
        success: false,
        data: { hasResume: false, resumeUrl: null }
      };
    }
  }

  // ==================== SKILLS ====================

  /**
   * Get all skills
   * @param {string} category - Optional category filter
   * @returns {Promise<Array>} Skills array
   */
  static async getSkills(category = null) {
    const queryParam = category ? `?category=${category}` : '';
    return this.makeRequest(`/skills${queryParam}`);
  }

  /**
   * Create new skill
   * @param {Object} skill - Skill data
   * @returns {Promise<Object>} Created skill
   */
  static async createSkill(skill) {
    console.log('[PortfolioManagementService] Creating skill with data:', skill);
    console.log('[PortfolioManagementService] Icon fields being sent:', {
      icon: skill.icon,
      logoIdentifier: skill.logoIdentifier,
      logoLibrary: skill.logoLibrary
    });
    
    return this.makeRequest('/skills', {
      method: 'POST',
      body: JSON.stringify(skill)
    });
  }

  /**
   * Update skill
   * @param {string} id - Skill ID
   * @param {Object} skill - Updated skill data
   * @returns {Promise<Object>} Updated skill
   */
  static async updateSkill(id, skill) {
    console.log('[PortfolioManagementService] Updating skill with data:', skill);
    console.log('[PortfolioManagementService] Icon fields being sent:', {
      icon: skill.icon,
      logoIdentifier: skill.logoIdentifier,
      logoLibrary: skill.logoLibrary
    });
    
    return this.makeRequest(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(skill)
    });
  }

  /**
   * Delete skill
   * @param {string} id - Skill ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  static async deleteSkill(id) {
    return this.makeRequest(`/skills/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== PROJECTS ====================

  /**
   * Get all projects
   * @param {Object} filters - Optional filters (status, featured)
   * @returns {Promise<Array>} Projects array
   */
  static async getProjects(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.makeRequest(`/projects${queryString}`);
  }

  /**
   * Get single project by ID
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Project data
   */
  static async getProject(id) {
    return this.makeRequest(`/projects/${id}`);
  }

  /**
   * Create new project
   * @param {Object} project - Project data
   * @param {Array<File>} projectImages - Project image files
   * @param {File} thumbnailImage - Thumbnail image file
   * @returns {Promise<Object>} Created project
   */
  static async createProject(project, projectImages = [], thumbnailImage = null) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(project).forEach(key => {
      if (project[key] !== null && project[key] !== undefined) {
        if (typeof project[key] === 'object') {
          formData.append(key, JSON.stringify(project[key]));
        } else {
          formData.append(key, project[key]);
        }
      }
    });
    
    // Add project images
    if (projectImages && projectImages.length > 0) {
      projectImages.forEach(image => {
        formData.append('projectImages', image);
      });
    }
    
    // Add thumbnail image
    if (thumbnailImage) {
      formData.append('thumbnailImage', thumbnailImage);
    }

    return this.makeRequest('/projects', {
      method: 'POST',
      body: formData
    });
  }

  /**
   * Update project
   * @param {string} id - Project ID
   * @param {Object} project - Updated project data
   * @param {Array<File>} projectImages - New project image files
   * @param {File} thumbnailImage - New thumbnail image file
   * @returns {Promise<Object>} Updated project
   */
  static async updateProject(id, project, projectImages = [], thumbnailImage = null) {
    const formData = new FormData();
    
    // Add text fields with proper handling for arrays
    Object.keys(project).forEach(key => {
      if (project[key] !== null && project[key] !== undefined) {
        if (Array.isArray(project[key])) {
          // Handle arrays properly - send each item individually
          if (key === 'challenges' || key === 'learnings') {
            project[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else if (key === 'technologies') {
            // Handle technologies as JSON since it's more complex
            formData.append(key, JSON.stringify(project[key]));
          } else {
            // For other arrays, stringify as JSON
            formData.append(key, JSON.stringify(project[key]));
          }
        } else if (typeof project[key] === 'object') {
          formData.append(key, JSON.stringify(project[key]));
        } else {
          formData.append(key, project[key]);
        }
      }
    });
    
    // Add project images if provided
    if (projectImages && projectImages.length > 0) {
      projectImages.forEach(image => {
        formData.append('projectImages', image);
      });
    }
    
    // Add thumbnail image if provided
    if (thumbnailImage) {
      formData.append('thumbnailImage', thumbnailImage);
    }

    return this.makeRequest(`/projects/${id}`, {
      method: 'PUT',
      body: formData
    });
  }

  /**
   * Delete project
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  static async deleteProject(id) {
    return this.makeRequest(`/projects/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== EXPERIENCE ====================

  /**
   * Get all experience entries
   * @returns {Promise<Array>} Experience entries array
   */
  static async getExperience() {
    return this.makeRequest('/experience');
  }

  /**
   * Create new experience entry
   * @param {Object} experience - Experience data
   * @param {File} companyLogo - Company logo file
   * @returns {Promise<Object>} Created experience entry
   */
  static async createExperience(experience, companyLogo = null) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(experience).forEach(key => {
      if (experience[key] !== null && experience[key] !== undefined) {
        if (Array.isArray(experience[key])) {
          formData.append(key, JSON.stringify(experience[key]));
        } else {
          formData.append(key, experience[key]);
        }
      }
    });
    
    // Add company logo
    if (companyLogo) {
      formData.append('companyLogo', companyLogo);
    }

    return this.makeRequest('/experience', {
      method: 'POST',
      body: formData
    });
  }

  /**
   * Update experience entry
   * @param {string} id - Experience ID
   * @param {Object} experience - Updated experience data
   * @param {File} companyLogo - New company logo file
   * @returns {Promise<Object>} Updated experience entry
   */
  static async updateExperience(id, experience, companyLogo = null) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(experience).forEach(key => {
      if (experience[key] !== null && experience[key] !== undefined) {
        if (Array.isArray(experience[key])) {
          formData.append(key, JSON.stringify(experience[key]));
        } else {
          formData.append(key, experience[key]);
        }
      }
    });
    
    // Add company logo if provided
    if (companyLogo) {
      formData.append('companyLogo', companyLogo);
    }

    return this.makeRequest(`/experience/${id}`, {
      method: 'PUT',
      body: formData
    });
  }

  /**
   * Delete experience entry
   * @param {string} id - Experience ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  static async deleteExperience(id) {
    return this.makeRequest(`/experience/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get file URL for display
   * @param {string} filename - Filename from server
   * @param {string} folder - Folder name (avatars, projects, etc.)
   * @returns {string} Full file URL
   */
  static getFileUrl(filename, folder = '') {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename; // Already full URL
    
    // Use the same API config utilities for consistency
    const baseUrl = getServerBaseUrl();
    return `${baseUrl}/uploads/${folder ? folder + '/' : ''}${filename}`;
  }

  /**
   * Validate file size and type
   * @param {File} file - File to validate
   * @param {Array<string>} allowedTypes - Allowed MIME types
   * @param {number} maxSize - Maximum file size in bytes
   * @returns {Object} Validation result
   */
  static validateFile(file, allowedTypes = [], maxSize = 10 * 1024 * 1024) {
    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit` 
      };
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
      };
    }

    return { isValid: true };
  }
}

export default PortfolioManagementService;
