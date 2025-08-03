/**
 * @fileoverview Comment Service - Professional comment management API service
 * @author jasilmeledath@gmail.com
 * @created 2025-08-03
 * @version 1.0.0
 */

import axios from 'axios';
import Cookies from 'js-cookie';
import { getApiBaseUrl } from '../utils/api-config';

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookies (same as main auth system)
    const token = Cookies.get('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - remove token and redirect to login
      Cookies.remove('auth_token');
      
      // Redirect to login if in browser
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

class CommentService {
  /**
   * Get all pending comments for moderation
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  static async getPendingComments(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        sortOrder: params.sortOrder || 'desc',
        ...params
      }).toString();

      const response = await apiClient.get(`/comments/pending?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending comments:', error);
      throw error;
    }
  }

  /**
   * Moderate a single comment
   * @param {string} blogId - Blog ID
   * @param {string} commentId - Comment ID
   * @param {Object} moderationData - Moderation data
   * @returns {Promise<Object>} API response
   */
  static async moderateComment(blogId, commentId, moderationData) {
    try {
      const response = await apiClient.patch(
        `/comments/${blogId}/${commentId}/moderate`,
        moderationData
      );
      return response.data;
    } catch (error) {
      console.error('Error moderating comment:', error);
      throw error;
    }
  }

  /**
   * Delete a comment
   * @param {string} blogId - Blog ID
   * @param {string} commentId - Comment ID
   * @returns {Promise<Object>} API response
   */
  static async deleteComment(blogId, commentId) {
    try {
      const response = await apiClient.delete(`/comments/${blogId}/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  /**
   * Bulk moderate comments
   * @param {Array} comments - Array of comment objects with blogId and commentId
   * @returns {Promise<Object>} API response
   */
  static async bulkModerateComments(comments) {
    try {
      const response = await apiClient.patch('/comments/bulk-moderate', {
        commentIds: comments
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk moderating comments:', error);
      throw error;
    }
  }

  /**
   * Get comment statistics
   * @returns {Promise<Object>} API response
   */
  static async getCommentStats() {
    try {
      const response = await apiClient.get('/comments/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching comment stats:', error);
      throw error;
    }
  }

  /**
   * Add a comment to a blog post
   * @param {string} blogId - Blog ID
   * @param {Object} commentData - Comment data
   * @returns {Promise<Object>} API response
   */
  static async addComment(blogId, commentData) {
    try {
      const response = await apiClient.post(`/comments/blog/${blogId}`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  /**
   * Get approved comments for a blog post
   * @param {string} blogId - Blog ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  static async getBlogComments(blogId, params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        sortOrder: params.sortOrder || 'desc',
        ...params
      }).toString();

      const response = await apiClient.get(`/comments/blog/${blogId}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog comments:', error);
      throw error;
    }
  }
}

export default CommentService;
