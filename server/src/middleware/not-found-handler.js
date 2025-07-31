/**
 * @fileoverview 404 Not Found Handler Middleware
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const { HTTP_STATUS } = require('../constants/http-status');
const { API_RESPONSE_STATUS, API_MESSAGES } = require('../constants/api-response');
const { NotFoundError } = require('../errors/custom-errors');

/**
 * Handles 404 Not Found errors for undefined routes
 * @function notFoundHandler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFoundHandler = (req, res, next) => {
    const error = new NotFoundError(
        `Route ${req.method} ${req.originalUrl} not found`,
        'ROUTE',
        'NF_001'
    );

    // Add additional context
    error.method = req.method;
    error.path = req.originalUrl;
    error.timestamp = new Date().toISOString();

    // Pass to global error handler
    next(error);
};

module.exports = notFoundHandler;