/**
 * @fileoverview Global Error Handling Middleware
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

const { HTTP_STATUS } = require('../constants/http-status');
const { API_RESPONSE_STATUS, API_MESSAGES } = require('../constants/api-response');
const {
    CustomError,
    ValidationError,
    DatabaseError,
    AuthenticationError,
    AuthorizationError,
    FileUploadError,
    NotFoundError,
    RateLimitError
} = require('../errors/custom-errors');

/**
 * Handles Mongoose validation errors
 * @function handleValidationError
 * @param {Error} error - Mongoose validation error
 * @returns {Object} Formatted error response
 */
const handleValidationError = (error) => {
    const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
    }));

    return {
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.VALIDATION_ERROR,
        error: {
            code: 'VAL_001',
            type: 'ValidationError',
            details: validationErrors
        }
    };
};

/**
 * Handles Mongoose cast errors (invalid ObjectId, etc.)
 * @function handleCastError
 * @param {Error} error - Mongoose cast error
 * @returns {Object} Formatted error response
 */
const handleCastError = (error) => {
    return {
        status: API_RESPONSE_STATUS.ERROR,
        message: `Invalid ${error.path}: ${error.value}`,
        error: {
            code: 'VAL_002',
            type: 'CastError',
            details: {
                field: error.path,
                value: error.value,
                expectedType: error.kind
            }
        }
    };
};

/**
 * Handles MongoDB duplicate key errors
 * @function handleDuplicateKeyError
 * @param {Error} error - MongoDB duplicate key error
 * @returns {Object} Formatted error response
 */
const handleDuplicateKeyError = (error) => {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];

    return {
        status: API_RESPONSE_STATUS.ERROR,
        message: `${field} '${value}' already exists`,
        error: {
            code: 'DB_003',
            type: 'DuplicateKeyError',
            details: {
                field,
                value
            }
        }
    };
};

/**
 * Handles JWT errors
 * @function handleJWTError
 * @param {Error} error - JWT error
 * @returns {Object} Formatted error response
 */
const handleJWTError = (error) => {
    let message = 'Invalid token';
    let code = 'AUTH_003';

    if (error.name === 'TokenExpiredError') {
        message = 'Token has expired';
        code = 'AUTH_002';
    } else if (error.name === 'JsonWebTokenError') {
        message = 'Malformed token';
        code = 'AUTH_003';
    }

    return {
        status: API_RESPONSE_STATUS.ERROR,
        message,
        error: {
            code,
            type: 'JWTError',
            details: error.message
        }
    };
};

/**
 * Handles Multer file upload errors
 * @function handleMulterError
 * @param {Error} error - Multer error
 * @returns {Object} Formatted error response
 */
const handleMulterError = (error) => {
    let message = 'File upload error';
    let code = 'FILE_003';

    switch (error.code) {
        case 'LIMIT_FILE_SIZE':
            message = 'File size exceeds limit';
            code = 'FILE_002';
            break;
        case 'LIMIT_FILE_COUNT':
            message = 'Too many files uploaded';
            code = 'FILE_004';
            break;
        case 'LIMIT_UNEXPECTED_FILE':
            message = 'Unexpected file field';
            code = 'FILE_005';
            break;
        default:
            message = error.message || 'File upload failed';
    }

    return {
        status: API_RESPONSE_STATUS.ERROR,
        message,
        error: {
            code,
            type: 'MulterError',
            details: error.message
        }
    };
};

/**
 * Logs error details for debugging and monitoring
 * @function logError
 * @param {Error} error - Error to log
 * @param {Object} req - Express request object
 */
const logError = (error, req) => {
    const errorLog = {
        timestamp: new Date().toISOString(),
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack
        },
        request: {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body,
            params: req.params,
            query: req.query,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        }
    };

    // In production, you would send this to a logging service
    if (process.env.NODE_ENV === 'development') {
        console.error('🚨 Error Details:', JSON.stringify(errorLog, null, 2));
    } else {
        console.error('🚨 Error:', error.message);
        // TODO: Send to logging service (Winston, LogRocket, Sentry, etc.)
    }
};

/**
 * Global error handling middleware
 * @function errorHandler
 * @param {Error} error - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (error, req, res, next) => {
    // Log error for debugging
    logError(error, req);

    let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let errorResponse = {
        status: API_RESPONSE_STATUS.ERROR,
        message: API_MESSAGES.SERVER_ERROR,
        error: {
            code: 'SRV_001',
            type: 'InternalServerError'
        }
    };

    // Handle specific error types
    if (error instanceof CustomError) {
        statusCode = error.statusCode;
        errorResponse = {
            status: API_RESPONSE_STATUS.ERROR,
            message: error.message,
            error: {
                code: error.errorCode,
                type: error.type || error.constructor.name,
                ...(error.validationErrors && { details: error.validationErrors }),
                ...(error.operation && { operation: error.operation }),
                ...(error.requiredPermission && { requiredPermission: error.requiredPermission }),
                ...(error.fileName && { fileName: error.fileName }),
                ...(error.serviceName && { serviceName: error.serviceName }),
                ...(error.resource && { resource: error.resource }),
                ...(error.retryAfter && { retryAfter: error.retryAfter }),
                ...(error.businessRule && { businessRule: error.businessRule })
            }
        };
    } else if (error.name === 'ValidationError') {
        // Mongoose validation error
        statusCode = HTTP_STATUS.BAD_REQUEST;
        errorResponse = handleValidationError(error);
    } else if (error.name === 'CastError') {
        // Mongoose cast error
        statusCode = HTTP_STATUS.BAD_REQUEST;
        errorResponse = handleCastError(error);
    } else if (error.code === 11000) {
        // MongoDB duplicate key error
        statusCode = HTTP_STATUS.CONFLICT;
        errorResponse = handleDuplicateKeyError(error);
    } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        // JWT errors
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        errorResponse = handleJWTError(error);
    } else if (error.name === 'MulterError') {
        // Multer file upload errors
        statusCode = HTTP_STATUS.BAD_REQUEST;
        errorResponse = handleMulterError(error);
    } else if (error.type === 'entity.parse.failed') {
        // JSON parsing error
        statusCode = HTTP_STATUS.BAD_REQUEST;
        errorResponse = {
            status: API_RESPONSE_STATUS.ERROR,
            message: 'Invalid JSON format',
            error: {
                code: 'VAL_003',
                type: 'JSONParseError',
                details: 'Request body contains invalid JSON'
            }
        };
    }

    // Add request ID for tracing (if available)
    if (req.requestId) {
        errorResponse.requestId = req.requestId;
    }

    // Add timestamp
    errorResponse.timestamp = new Date().toISOString();

    // Remove sensitive information in production
    if (process.env.NODE_ENV === 'production') {
        delete errorResponse.error.stack;
        
        // Don't expose internal server errors in production
        if (statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
            errorResponse.message = API_MESSAGES.SERVER_ERROR;
            errorResponse.error = {
                code: 'SRV_001',
                type: 'InternalServerError'
            };
        }
    } else {
        // Include stack trace in development
        errorResponse.error.stack = error.stack;
    }

    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;