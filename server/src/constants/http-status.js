/**
 * @fileoverview HTTP Status Code Constants
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

/**
 * HTTP Status Code Enums
 * Centralized status code management - NO HARDCODED STATUS CODES
 * @constant {Object} HTTP_STATUS
 */
const HTTP_STATUS = {
    // Success Codes (2xx)
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    
    // Redirection Codes (3xx)
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    NOT_MODIFIED: 304,
    
    // Client Error Codes (4xx)
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    GONE: 410,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    
    // Server Error Codes (5xx)
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};

/**
 * HTTP Status Messages
 * Human-readable status messages
 * @constant {Object} HTTP_MESSAGES
 */
const HTTP_MESSAGES = {
    [HTTP_STATUS.SUCCESS]: 'Success',
    [HTTP_STATUS.CREATED]: 'Created',
    [HTTP_STATUS.ACCEPTED]: 'Accepted',
    [HTTP_STATUS.NO_CONTENT]: 'No Content',
    [HTTP_STATUS.BAD_REQUEST]: 'Bad Request',
    [HTTP_STATUS.UNAUTHORIZED]: 'Unauthorized',
    [HTTP_STATUS.FORBIDDEN]: 'Forbidden',
    [HTTP_STATUS.NOT_FOUND]: 'Not Found',
    [HTTP_STATUS.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
    [HTTP_STATUS.CONFLICT]: 'Conflict',
    [HTTP_STATUS.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
    [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Too Many Requests',
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    [HTTP_STATUS.NOT_IMPLEMENTED]: 'Not Implemented',
    [HTTP_STATUS.BAD_GATEWAY]: 'Bad Gateway',
    [HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Service Unavailable',
    [HTTP_STATUS.GATEWAY_TIMEOUT]: 'Gateway Timeout'
};

module.exports = {
    HTTP_STATUS,
    HTTP_MESSAGES
};