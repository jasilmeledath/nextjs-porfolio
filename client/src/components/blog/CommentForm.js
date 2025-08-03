/**
 * @fileoverview Comment Form Component - Form for submitting comments
 * @author jasilmeledath@gmail.com
 * @created 2025-01-27
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CommentForm = ({ 
  blogId, 
  parentComment = null, 
  onSuccess, 
  onCancel,
  isReply = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Comment is required';
    } else if (formData.content.length < 5) {
      newErrors.content = 'Comment must be at least 5 characters long';
    } else if (formData.content.length > 1000) {
      newErrors.content = 'Comment cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/v1/comments/blog/${blogId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            website: formData.website.trim()
          },
          content: formData.content.trim(),
          parentComment
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          website: '',
          content: ''
        });
        
        if (onSuccess) {
          onSuccess(data.message);
        }
      } else {
        setErrors({ submit: data.message || 'Failed to submit comment' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {isReply ? 'Reply to Comment' : 'Leave a Comment'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Website Field */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Website (Optional)
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://yourwebsite.com"
          />
        </div>

        {/* Comment Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Comment *
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            value={formData.content}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-vertical ${
              errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Share your thoughts..."
          />
          <div className="flex justify-between items-center mt-1">
            {errors.content && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.content}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
              {formData.content.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Form Buttons */}
        <div className="flex justify-end space-x-3">
          {isReply && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              isSubmitting
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Comment'
            )}
          </button>
        </div>
      </form>

      {/* Moderation Notice */}
      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Your comment will be reviewed before being published.
        </p>
      </div>
    </motion.div>
  );
};

export default CommentForm;