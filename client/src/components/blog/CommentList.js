/**
 * @fileoverview Comment List Component - Displays approved comments with replies
 * @author jasilmeledath@gmail.com
 * @created 2025-01-27
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommentForm from './CommentForm';
import CommentService from '../../services/comment-service';

const CommentItem = ({ comment, blogId, onReplySuccess, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [likes, setLikes] = useState(comment.likes || 0);

  const handleReply = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleReplySuccess = (message) => {
    setShowReplyForm(false);
    if (onReplySuccess) {
      onReplySuccess(message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGravatarUrl = (email) => {
    // Simple gravatar implementation (you might want to use a proper hash)
    const hash = btoa(email.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${level > 0 ? 'ml-8 mt-4' : 'mb-6'}`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Comment Header */}
        <div className="flex items-start space-x-3">
          <img
            src={getGravatarUrl(comment.author.email)}
            alt={comment.author.name}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              {comment.author.website ? (
                <a
                  href={comment.author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {comment.author.name}
                </a>
              ) : (
                <span className="font-medium text-gray-900 dark:text-white">
                  {comment.author.name}
                </span>
              )}
              
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            
            {/* Comment Content */}
            <div className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
              {comment.content.split('\n').map((line, index) => (
                <p key={index} className={index > 0 ? 'mt-2' : ''}>
                  {line}
                </p>
              ))}
            </div>
            
            {/* Comment Actions */}
            <div className="flex items-center space-x-4 text-sm">
              <button
                onClick={handleReply}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                Reply
              </button>
              
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{likes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        <AnimatePresence>
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <CommentForm
                blogId={blogId}
                parentComment={comment._id}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReplyForm(false)}
                isReply={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Render Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              blogId={blogId}
              onReplySuccess={onReplySuccess}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const CommentList = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchComments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await CommentService.getBlogComments(blogId, { 
        page, 
        limit: 10,
        status: 'approved' // Only fetch approved comments for public view
      });

      if (response.data) {
        setComments(response.data.comments);
        setPagination(response.data.pagination);
        setError(null);
      } else {
        setError('Failed to load comments');
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const handleCommentSuccess = (message) => {
    setSuccessMessage(message);
    setShowCommentForm(false);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handlePageChange = (newPage) => {
    fetchComments(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Comments ({pagination.totalComments})
        </h2>
        
        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          {showCommentForm ? 'Hide Form' : 'Add Comment'}
        </button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4"
          >
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700 dark:text-green-300">{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Form */}
      <AnimatePresence>
        {showCommentForm && (
          <CommentForm
            blogId={blogId}
            onSuccess={handleCommentSuccess}
          />
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              blogId={blogId}
              onReplySuccess={handleCommentSuccess}
            />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-2">No comments yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Be the first to share your thoughts!</p>
          </div>
        )
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 py-6">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentList;