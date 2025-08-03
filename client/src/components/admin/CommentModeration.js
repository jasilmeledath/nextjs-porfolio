/**
 * @fileoverview Comment Moderation - Professional comment moderation interface
 * @author jasilmeledath@gmail.com
 * @created 2025-08-03
 * @version 2.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageCircle, 
  FiCheck, 
  FiX, 
  FiClock,
  FiRefreshCw,
  FiSearch,
  FiChevronDown,
  FiCheckSquare,
  FiSquare
} from 'react-icons/fi';
import CommentService from '../../services/comment-service';
import CommentModerationCard from './CommentModerationCard';

const CommentModeration = () => {
  // State management
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  
  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedComments, setSelectedComments] = useState(new Set());

  // Fetch comments
  const fetchComments = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 10,
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus })
      };

      const response = await CommentService.getPendingComments(params);
      
      setComments(response.data.comments);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
      
      // Calculate stats from response
      const pendingCount = response.data.comments.length;
      setStats(prev => ({
        ...prev,
        pending: pendingCount,
        total: response.data.pagination.totalComments
      }));

    } catch (err) {
      console.error('Error fetching comments:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to load comments. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus, sortOrder]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await CommentService.getCommentStats();
      if (response.data?.stats) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching comment stats:', err);
      // Don't show error for stats, just use defaults
    }
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchStats(),
      fetchComments(currentPage)
    ]);
  }, [fetchStats, fetchComments, currentPage]);

  // Handle comment moderation
  const handleModerateComment = async (blogId, commentId, moderationData) => {
    try {
      setActionLoading(commentId);
      
      await CommentService.moderateComment(blogId, commentId, moderationData);
      
      // Remove from current list if it's no longer pending
      if (moderationData.status !== 'pending') {
        setComments(prev => prev.filter(c => c.comment._id !== commentId));
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          [moderationData.status]: prev[moderationData.status] + 1
        }));
      }
      
      // Clear selection if comment was selected
      setSelectedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      
    } catch (err) {
      console.error('Error moderating comment:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to moderate comment. Please try again.';
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (blogId, commentId) => {
    try {
      setActionLoading(commentId);
      
      await CommentService.deleteComment(blogId, commentId);
      
      // Remove from list
      setComments(prev => prev.filter(c => c.comment._id !== commentId));
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        total: prev.total - 1
      }));
      
      // Clear selection
      setSelectedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      
    } catch (err) {
      console.error('Error deleting comment:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to delete comment. Please try again.';
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle bulk actions
  const handleBulkModeration = async (status) => {
    if (selectedComments.size === 0) return;

    try {
      setLoading(true);
      
      const commentsToModerate = comments
        .filter(c => selectedComments.has(c.comment._id))
        .map(c => ({
          blogId: c.blogId,
          commentId: c.comment._id,
          status
        }));

      await CommentService.bulkModerateComments(commentsToModerate);
      
      // Refresh the list
      await fetchComments(currentPage);
      
      // Clear selections
      setSelectedComments(new Set());
      
    } catch (err) {
      console.error('Error bulk moderating comments:', err);
      setError('Failed to bulk moderate comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle comment selection
  const toggleCommentSelection = (commentId) => {
    setSelectedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedComments.size === comments.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(comments.map(c => c.comment._id)));
    }
  };

  // Initial load and refetch when filters change
  useEffect(() => {
    fetchStats();
    fetchComments(1);
  }, [fetchStats, fetchComments]);

  // Reset page to 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      fetchComments(1);
    }
  }, [searchTerm, filterStatus, sortOrder]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== '') {
        fetchComments(1);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-green-400">
            Comment Moderation
          </h1>
          <p className="text-gray-400 font-mono text-sm mt-1">
            Manage and moderate user comments across all blog posts
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="font-mono text-sm">Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'blue', icon: FiMessageCircle },
          { label: 'Pending', value: stats.pending, color: 'yellow', icon: FiClock },
          { label: 'Approved', value: stats.approved, color: 'green', icon: FiCheck },
          { label: 'Rejected', value: stats.rejected, color: 'red', icon: FiX },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${
              stat.color === 'blue' ? 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' :
              stat.color === 'yellow' ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30' :
              stat.color === 'green' ? 'from-green-500/20 to-emerald-500/20 border-green-500/30' :
              'from-red-500/20 to-pink-500/20 border-red-500/30'
            } backdrop-blur-xl rounded-xl border shadow-lg p-4 sm:p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className={`text-2xl sm:text-3xl font-mono font-bold ${
                  stat.color === 'blue' ? 'text-blue-400' :
                  stat.color === 'yellow' ? 'text-yellow-400' :
                  stat.color === 'green' ? 'text-green-400' :
                  'text-red-400'
                } mb-2`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${
                stat.color === 'blue' ? 'text-blue-400' :
                stat.color === 'yellow' ? 'text-yellow-400' :
                stat.color === 'green' ? 'text-green-400' :
                'text-red-400'
              }`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search comments, authors, or blog titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`appearance-none bg-gray-800/50 border rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-colors ${
                filterStatus !== 'all' 
                  ? 'border-green-500/50 bg-green-500/10' 
                  : 'border-gray-600/30'
              }`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none bg-gray-800/50 border border-gray-600/30 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-colors"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || filterStatus !== 'all' || sortOrder !== 'desc') && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setSortOrder('desc');
              }}
              className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors font-mono text-sm whitespace-nowrap"
            >
              Clear Filters
            </motion.button>
          )}
        </div>

        {/* Active Filters Display */}
        {(searchTerm || filterStatus !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-600/20">
            <span className="text-gray-400 font-mono text-xs">Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">
                Search: "{searchTerm}"
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">
                Status: {filterStatus}
              </span>
            )}
          </div>
        )}

        {/* Bulk Actions */}
        {selectedComments.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-600/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-green-400 font-mono text-sm">
                {selectedComments.size} comment{selectedComments.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkModeration('approved')}
                  className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium"
                >
                  Approve All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkModeration('rejected')}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                >
                  Reject All
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <FiX className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-100">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {/* Results Info */}
        {!loading && (
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800/30 rounded-lg">
            <div>
              <span className="text-gray-400 font-mono text-sm">
                {comments.length > 0 
                  ? `Showing ${comments.length} comment${comments.length !== 1 ? 's' : ''} ${
                      filterStatus !== 'all' ? `(${filterStatus})` : ''
                    } ${searchTerm ? `matching "${searchTerm}"` : ''}`
                  : 'No comments found'
                }
              </span>
              {comments.length > 0 && (
                <span className="text-gray-500 font-mono text-xs ml-2">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>
            {comments.length > 0 && (
              <span className="text-green-400 font-mono text-xs">
                {loading ? 'Updating...' : 'Updated'}
              </span>
            )}
          </div>
        )}

        {/* Select All */}
        {comments.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/30 rounded-lg">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
            >
              {selectedComments.size === comments.length ? (
                <FiCheckSquare className="w-4 h-4" />
              ) : (
                <FiSquare className="w-4 h-4" />
              )}
              <span className="text-sm font-mono">
                {selectedComments.size === comments.length ? 'Deselect All' : 'Select All'}
              </span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && comments.length === 0 && (
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-green-400 font-mono">Loading comments...</span>
            </div>
          </div>
        )}

        {/* No Comments */}
        {!loading && comments.length === 0 && (
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <FiMessageCircle className="w-16 h-16 text-gray-400" />
              <h3 className="text-xl font-mono font-semibold text-gray-400">
                No Comments Found
              </h3>
              <p className="text-gray-500 font-mono">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No comments are pending moderation at this time.'}
              </p>
            </div>
          </div>
        )}

        {/* Comments */}
        <AnimatePresence>
          {comments.map((comment) => (
            <div key={comment.comment._id} className="relative">
              {/* Selection Checkbox */}
              <button
                onClick={() => toggleCommentSelection(comment.comment._id)}
                className="absolute top-4 left-4 z-10 p-1 hover:bg-gray-700/50 rounded transition-colors"
              >
                {selectedComments.has(comment.comment._id) ? (
                  <FiCheckSquare className="w-4 h-4 text-green-400" />
                ) : (
                  <FiSquare className="w-4 h-4 text-gray-400" />
                )}
              </button>

              <CommentModerationCard
                comment={comment}
                onApprove={handleModerateComment}
                onReject={handleModerateComment}
                onDelete={handleDeleteComment}
                isLoading={actionLoading === comment.comment._id}
                className="ml-10" // Offset for checkbox
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchComments(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
          >
            Previous
          </motion.button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchComments(page)}
                disabled={loading}
                className={`w-10 h-10 rounded-lg font-mono text-sm transition-colors ${
                  page === currentPage
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                } disabled:opacity-50`}
              >
                {page}
              </motion.button>
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchComments(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
          >
            Next
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default CommentModeration;
