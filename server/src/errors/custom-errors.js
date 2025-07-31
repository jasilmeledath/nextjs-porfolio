/**
 * @fileoverview Custom Error Classes for Centralized Error Management
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

/**
 * Base Custom Error Class
 * @class CustomError
 * @extends Error
 */
class CustomError extends Error {
    /**
     * Creates a custom error instance
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     * @param {string} errorCode - Application-specific error code
     * @param {boolean} isOperational - Whether error is operational
     */
    constructor(message, statusCode = 500, errorCode = null, isOperational = true) {
        super(message);
        
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;
        this.timestamp = new Date().toISOString();
        
        // Maintains proper stack trace for where error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation Error Class
 * @class ValidationError
 * @extends CustomError
 */
class ValidationError extends CustomError {
    /**
     * Creates a validation error instance
     * @param {string} message - Validation error message
     * @param {Array} validationErrors - Array of validation error details
     * @param {string} errorCode - Specific validation error code
     */
    constructor(message = 'Validation failed', validationErrors = [], errorCode = 'VAL_001') {
        super(message, 400, errorCode);
        this.validationErrors = validationErrors;
        this.type = 'ValidationError';
    }
}

/**
 * Database Error Class
 * @class DatabaseError
 * @extends CustomError
 */
class DatabaseError extends CustomError {
    /**
     * Creates a database error instance
     * @param {string} message - Database error message
     * @param {string} operation - Database operation that failed
     * @param {string} errorCode - Specific database error code
     */
    constructor(message = 'Database operation failed', operation = null, errorCode = 'DB_001') {
        super(message, 500, errorCode);
        this.operation = operation;
        this.type = 'DatabaseError';
    }
}

/**
 * Authentication Error Class
 * @class AuthenticationError
 * @extends CustomError
 */
class AuthenticationError extends CustomError {
    /**
     * Creates an authentication error instance
     * @param {string} message - Authentication error message
     * @param {string} errorCode - Specific authentication error code
     */
    constructor(message = 'Authentication failed', errorCode = 'AUTH_001') {
        super(message, 401, errorCode);
        this.type = 'AuthenticationError';
    }
}

/**
 * Authorization Error Class
 * @class AuthorizationError
 * @extends CustomError
 */
class AuthorizationError extends CustomError {
    /**
     * Creates an authorization error instance
     * @param {string} message - Authorization error message
     * @param {string} requiredPermission - Required permission that was missing
     * @param {string} errorCode - Specific authorization error code
     */
    constructor(message = 'Insufficient permissions', requiredPermission = null, errorCode = 'AUTH_004') {
        super(message, 403, errorCode);
        this.requiredPermission = requiredPermission;
        this.type = 'AuthorizationError';
    }
}

/**
 * File Upload Error Class
 * @class FileUploadError
 * @extends CustomError
 */
class FileUploadError extends CustomError {
    /**
     * Creates a file upload error instance
     * @param {string} message - File upload error message
     * @param {string} fileName - Name of the file that failed to upload
     * @param {string} errorCode - Specific file upload error code
     */
    constructor(message = 'File upload failed', fileName = null, errorCode = 'FILE_003') {
        super(message, 400, errorCode);
        this.fileName = fileName;
        this.type = 'FileUploadError';
    }
}

/**
 * External Service Error Class
 * @class ExternalServiceError
 * @extends CustomError
 */
class ExternalServiceError extends CustomError {
    /**
     * Creates an external service error instance
     * @param {string} message - External service error message
     * @param {string} serviceName - Name of the external service
     * @param {string} errorCode - Specific external service error code
     */
    constructor(message = 'External service error', serviceName = null, errorCode = 'EXT_001') {
        super(message, 502, errorCode);
        this.serviceName = serviceName;
        this.type = 'ExternalServiceError';
    }
}

/**
 * Not Found Error Class
 * @class NotFoundError
 * @extends CustomError
 */
class NotFoundError extends CustomError {
    /**
     * Creates a not found error instance
     * @param {string} message - Not found error message
     * @param {string} resource - Resource that was not found
     * @param {string} errorCode - Specific not found error code
     */
    constructor(message = 'Resource not found', resource = null, errorCode = 'NF_001') {
        super(message, 404, errorCode);
        this.resource = resource;
        this.type = 'NotFoundError';
    }
}

/**
 * Rate Limit Error Class
 * @class RateLimitError
 * @extends CustomError
 */
class RateLimitError extends CustomError {
    /**
     * Creates a rate limit error instance
     * @param {string} message - Rate limit error message
     * @param {number} retryAfter - Seconds to wait before retrying
     * @param {string} errorCode - Specific rate limit error code
     */
    constructor(message = 'Rate limit exceeded', retryAfter = 60, errorCode = 'RL_001') {
        super(message, 429, errorCode);
        this.retryAfter = retryAfter;
        this.type = 'RateLimitError';
    }
}

/**
 * Business Logic Error Class
 * @class BusinessLogicError
 * @extends CustomError
 */
class BusinessLogicError extends CustomError {
    /**
     * Creates a business logic error instance
     * @param {string} message - Business logic error message
     * @param {string} businessRule - Business rule that was violated
     * @param {string} errorCode - Specific business logic error code
     */
    constructor(message = 'Business logic violation', businessRule = null, errorCode = 'BL_001') {
        super(message, 400, errorCode);
        this.businessRule = businessRule;
        this.type = 'BusinessLogicError';
    }
}

module.exports = {
    CustomError,
    ValidationError,
    DatabaseError,
    AuthenticationError,
    AuthorizationError,
    FileUploadError,
    ExternalServiceError,
    NotFoundError,
    RateLimitError,
    BusinessLogicError
};