/**
 * @fileoverview Blog Service - API calls for blog operations
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Blog Service Class
 * @class BlogService
 */
class BlogService {
  /**
   * Get authentication headers
   * @returns {Object} Headers object
   */
  static getAuthHeaders() {
    // Get token from cookies (matches AuthContext implementation)
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
          toast.error('Resource not found.');
        } else if (response.status === 422) {
          toast.error('Validation error: ' + errorMessage);
        } else if (response.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error(errorMessage);
        }
      }
      
      throw new Error(errorMessage);
    }
    
    return data;
  }

  // ==================== ADMIN/AUTHOR OPERATIONS ====================

  /**
   * Get all blogs (admin/author view)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  static async getAllBlogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/blogs${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  /**
   * Get single blog by ID
   * @param {string} id - Blog ID
   * @returns {Promise<Object>} API response
   */
  static async getBlogById(id) {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  /**
   * Create new blog
   * @param {Object} blogData - Blog data
   * @returns {Promise<Object>} API response
   */
  static async createBlog(blogData) {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(blogData)
    });
    
    const result = await this.handleResponse(response);
    
    if (result.status === 'success') {
      toast.success('Blog post created successfully!');
    }
    
    return result;
  }

  /**
   * Update blog
   * @param {string} id - Blog ID
   * @param {Object} blogData - Updated blog data
   * @returns {Promise<Object>} API response
   */
  static async updateBlog(id, blogData) {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(blogData)
    });
    
    const result = await this.handleResponse(response);
    
    if (result.status === 'success') {
      toast.success('Blog post updated successfully!');
    }
    
    return result;
  }

  /**
   * Delete blog
   * @param {string} id - Blog ID
   * @returns {Promise<Object>} API response
   */
  static async deleteBlog(id) {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    const result = await this.handleResponse(response);
    
    if (result.status === 'success') {
      toast.success('Blog post deleted successfully!');
    }
    
    return result;
  }

  /**
   * Toggle blog status
   * @param {string} id - Blog ID
   * @param {string} status - New status
   * @returns {Promise<Object>} API response
   */
  static async toggleBlogStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    
    return this.handleResponse(response);
  }

  /**
   * Get blog statistics
   * @returns {Promise<Object>} API response
   */
  static async getBlogStats() {
    const response = await fetch(`${API_BASE_URL}/blogs/stats/overview`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  /**
   * Moderate comment
   * @param {string} blogId - Blog ID
   * @param {string} commentId - Comment ID
   * @param {string} status - New status
   * @returns {Promise<Object>} API response
   */
  static async moderateComment(blogId, commentId, status) {
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments/${commentId}/moderate`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    
    return this.handleResponse(response);
  }

  // ==================== PUBLIC OPERATIONS ====================

  /**
   * Get published blogs (public)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  static async getPublishedBlogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/blogs/public${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    return this.handleResponse(response);
  }

  /**
   * Get single blog by slug (public)
   * @param {string} slug - Blog slug
   * @returns {Promise<Object>} API response
   */
  static async getBlogBySlug(slug) {
    const response = await fetch(`${API_BASE_URL}/blogs/public/${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    return this.handleResponse(response);
  }

  /**
   * Get popular blogs
   * @param {number} limit - Number of blogs to return
   * @returns {Promise<Object>} API response
   */
  static async getPopularBlogs(limit = 5) {
    const response = await fetch(`${API_BASE_URL}/blogs/popular?limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    return this.handleResponse(response);
  }

  /**
   * Get recent blogs
   * @param {number} limit - Number of blogs to return
   * @returns {Promise<Object>} API response
   */
  static async getRecentBlogs(limit = 5) {
    const response = await fetch(`${API_BASE_URL}/blogs/recent?limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    return this.handleResponse(response);
  }

  /**
   * Get all categories
   * @returns {Promise<Object>} API response
   */
  static async getCategories() {
    const response = await fetch(`${API_BASE_URL}/blogs/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    return this.handleResponse(response);
  }

  /**
   * Get all tags
   * @returns {Promise<Object>} API response
   */
  static async getTags() {
    const response = await fetch(`${API_BASE_URL}/blogs/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    return this.handleResponse(response);
  }

  /**
   * Add comment to blog
   * @param {string} blogId - Blog ID
   * @param {Object} commentData - Comment data
   * @returns {Promise<Object>} API response
   */
  static async addComment(blogId, commentData) {
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    
    return this.handleResponse(response);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Generate slug from title
   * @param {string} title - Blog title
   * @returns {string} Generated slug
   */
  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  /**
   * Calculate reading time
   * @param {string} content - Blog content
   * @returns {number} Reading time in minutes
   */
  static calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Format date
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date
   */
  static formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Truncate text
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @returns {string} Truncated text
   */
  static truncateText(text, length = 100) {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
  }
}

export default BlogService;
