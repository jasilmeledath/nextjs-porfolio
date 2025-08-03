/**
 * @fileoverview Comment Moderation Card - Individual comment card for moderation
 * @author jasilmeledath@gmail.com
 * @created 2025-08-03
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCheck, 
  FiX, 
  FiClock, 
  FiUser, 
  FiMail, 
  FiGlobe,
  FiMessageCircle,
  FiCalendar,
  FiExternalLink,
  FiTrash2,
  FiEdit
} from 'react-icons/fi';

const CommentModerationCard = ({ 
  comment, 
  onApprove, 
  onReject, 
  onDelete,
  isLoading,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [moderatorNote, setModeratorNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleApprove = async () => {
    await onApprove(comment.blogId, comment.comment._id, {
      status: 'approved',
      moderatorNote: moderatorNote || undefined
    });
    setShowNoteInput(false);
    setModeratorNote('');
  };

  const handleReject = async () => {
    await onReject(comment.blogId, comment.comment._id, {
      status: 'rejected',
      moderatorNote: moderatorNote || undefined
    });
    setShowNoteInput(false);
    setModeratorNote('');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this comment?')) {
      await onDelete(comment.blogId, comment.comment._id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-green-500/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Blog Info */}
            <div className="flex items-center gap-2 mb-2">
              <FiMessageCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-green-400 font-mono text-sm truncate">
                {comment.blogTitle}
              </span>
              <a 
                href={`/blog/${comment.blogSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <FiExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <FiUser className="w-4 h-4 text-gray-400" />
                <span className="text-white font-medium text-sm">
                  {comment.comment.author.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm font-mono">
                  {comment.comment.author.email}
                </span>
              </div>
              {comment.comment.author.website && (
                <div className="flex items-center gap-2">
                  <FiGlobe className="w-4 h-4 text-gray-400" />
                  <a 
                    href={comment.comment.author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
                  >
                    Website
                  </a>
                </div>
              )}
            </div>

            {/* Date and Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-xs font-mono">
                  {formatDate(comment.comment.createdAt)}
                </span>
              </div>
              <div className={`px-2 py-1 rounded-full border text-xs font-mono uppercase tracking-wider ${getStatusColor(comment.comment.status)}`}>
                {comment.comment.status}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleApprove}
              disabled={isLoading}
              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Approve Comment"
            >
              <FiCheck className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReject}
              disabled={isLoading}
              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Reject Comment"
            >
              <FiX className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNoteInput(!showNoteInput)}
              disabled={isLoading}
              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add Moderator Note"
            >
              <FiEdit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              disabled={isLoading}
              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete Comment"
            >
              <FiTrash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Comment Content */}
      <div className="p-4">
        <div 
          className="text-gray-100 leading-relaxed cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? comment.comment.content : truncateContent(comment.comment.content)}
          {comment.comment.content.length > 150 && (
            <button className="text-green-400 hover:text-green-300 ml-2 text-sm font-medium">
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Parent Comment Info */}
        {comment.comment.parentComment && (
          <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border-l-2 border-blue-400/30">
            <span className="text-blue-400 text-xs font-mono uppercase tracking-wider">
              Reply to comment
            </span>
          </div>
        )}

        {/* Moderator Note Input */}
        {showNoteInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-600/30"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Moderator Note (Optional)
            </label>
            <textarea
              value={moderatorNote}
              onChange={(e) => setModeratorNote(e.target.value)}
              placeholder="Add a note about this moderation action..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-colors resize-none"
            />
            <div className="flex justify-end gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowNoteInput(false);
                  setModeratorNote('');
                }}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApprove}
                disabled={isLoading}
                className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Approve with Note
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReject}
                disabled={isLoading}
                className="px-4 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Reject with Note
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-green-400 font-mono text-sm">Processing...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CommentModerationCard;
