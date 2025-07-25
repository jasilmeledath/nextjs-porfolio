/**
 * @fileoverview API Response Constants and Types
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

/**
 * API Response Status Types
 * @constant {Object} API_RESPONSE_STATUS
 */
const API_RESPONSE_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    PENDING: 'pending',
    PROCESSING: 'processing',
    WARNING: 'warning',
    INFO: 'info'
};

/**
 * API Response Message Types
 * @constant {Object} API_MESSAGES
 */
const API_MESSAGES = {
    // Authentication Messages
    AUTH_SUCCESS: 'Authentication successful',
    AUTH_FAILED: 'Authentication failed',
    AUTH_REQUIRED: 'Authentication required',
    TOKEN_INVALID: 'Invalid or expired token',
    TOKEN_MISSING: 'Authorization token missing',
    
    // CRUD Operation Messages
    RESOURCE_CREATED: 'Resource created successfully',
    RESOURCE_UPDATED: 'Resource updated successfully',
    RESOURCE_DELETED: 'Resource deleted successfully',
    RESOURCE_FOUND: 'Resource retrieved successfully',
    RESOURCE_NOT_FOUND: 'Resource not found',
    RESOURCES_FOUND: 'Resources retrieved successfully',
    
    // Validation Messages
    VALIDATION_ERROR: 'Validation error occurred',
    INVALID_INPUT: 'Invalid input provided',
    REQUIRED_FIELDS_MISSING: 'Required fields are missing',
    
    // File Upload Messages
    FILE_UPLOADED: 'File uploaded successfully',
    FILE_UPLOAD_ERROR: 'File upload failed',
    FILE_SIZE_EXCEEDED: 'File size exceeds limit',
    FILE_TYPE_INVALID: 'Invalid file type',
    
    // Database Messages
    DB_CONNECTION_ERROR: 'Database connection failed',
    DB_OPERATION_ERROR: 'Database operation failed',
    
    // Server Messages
    SERVER_ERROR: 'Internal server error occurred',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
    
    // Blog Messages
    BLOG_POST_PUBLISHED: 'Blog post published successfully',
    BLOG_POST_DRAFTED: 'Blog post saved as draft',
    COMMENT_ADDED: 'Comment added successfully',
    COMMENT_APPROVED: 'Comment approved',
    COMMENT_REJECTED: 'Comment rejected',
    
    // Portfolio Messages
    PORTFOLIO_UPDATED: 'Portfolio updated successfully',
    PROJECT_ADDED: 'Project added successfully',
    SKILL_ADDED: 'Skill added successfully',
    EXPERIENCE_ADDED: 'Experience added successfully'
};

/**
 * API Error Codes
 * @constant {Object} API_ERROR_CODES
 */
const API_ERROR_CODES = {
    // Authentication Errors
    AUTH_001: 'INVALID_CREDENTIALS',
    AUTH_002: 'TOKEN_EXPIRED',
    AUTH_003: 'TOKEN_MALFORMED',
    AUTH_004: 'INSUFFICIENT_PERMISSIONS',
    
    // Validation Errors
    VAL_001: 'REQUIRED_FIELD_MISSING',
    VAL_002: 'INVALID_EMAIL_FORMAT',
    VAL_003: 'INVALID_URL_FORMAT',
    VAL_004: 'INVALID_DATE_FORMAT',
    VAL_005: 'VALUE_TOO_LONG',
    VAL_006: 'VALUE_TOO_SHORT',
    
    // Database Errors
    DB_001: 'CONNECTION_FAILED',
    DB_002: 'QUERY_FAILED',
    DB_003: 'DUPLICATE_ENTRY',
    DB_004: 'CONSTRAINT_VIOLATION',
    
    // File Upload Errors
    FILE_001: 'UNSUPPORTED_FILE_TYPE',
    FILE_002: 'FILE_SIZE_EXCEEDED',
    FILE_003: 'UPLOAD_FAILED',
    FILE_004: 'FILE_NOT_FOUND',
    
    // Business Logic Errors
    BL_001: 'BLOG_POST_NOT_FOUND',
    BL_002: 'COMMENT_NOT_FOUND',
    BL_003: 'PROJECT_NOT_FOUND',
    BL_004: 'SKILL_NOT_FOUND',
    BL_005: 'EXPERIENCE_NOT_FOUND',
    
    // Rate Limiting
    RL_001: 'TOO_MANY_REQUESTS',
    RL_002: 'API_QUOTA_EXCEEDED'
};

module.exports = {
    API_RESPONSE_STATUS,
    API_MESSAGES,
    API_ERROR_CODES
};