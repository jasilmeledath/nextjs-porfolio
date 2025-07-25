const { API_RESPONSE_STATUS } = require('../constants/api-response');

/**
 * Standard API Response utility class
 * Provides consistent response formatting across all endpoints
 */
class ApiResponse {
  /**
   * Create a success response
   * @param {*} data - The response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default: 200)
   * @returns {Object} Formatted success response
   */
  static success(data = null, message = 'Operation successful', statusCode = 200) {
    return {
      success: true,
      status: API_RESPONSE_STATUS.SUCCESS,
      message,
      data,
      statusCode,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create a created response
   * @param {*} data - The response data
   * @param {string} message - Success message
   * @returns {Object} Formatted created response
   */
  static created(data = null, message = 'Resource created successfully') {
    return {
      success: true,
      status: API_RESPONSE_STATUS.SUCCESS,
      message,
      data,
      statusCode: 201,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create an error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {*} error - Additional error details
   * @returns {Object} Formatted error response
   */
  static error(message = 'Operation failed', statusCode = 500, error = null) {
    return {
      success: false,
      status: API_RESPONSE_STATUS.ERROR,
      message,
      error,
      statusCode,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create a validation error response
   * @param {string} message - Validation error message
   * @param {*} errors - Validation error details
   * @returns {Object} Formatted validation error response
   */
  static validationError(message = 'Validation failed', errors = null) {
    return {
      success: false,
      status: API_RESPONSE_STATUS.ERROR,
      message,
      errors,
      statusCode: 400,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create an unauthorized response
   * @param {string} message - Unauthorized message
   * @returns {Object} Formatted unauthorized response
   */
  static unauthorized(message = 'Unauthorized access') {
    return {
      success: false,
      status: API_RESPONSE_STATUS.ERROR,
      message,
      statusCode: 401,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create a forbidden response
   * @param {string} message - Forbidden message
   * @returns {Object} Formatted forbidden response
   */
  static forbidden(message = 'Access forbidden') {
    return {
      success: false,
      status: API_RESPONSE_STATUS.ERROR,
      message,
      statusCode: 403,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create a not found response
   * @param {string} message - Not found message
   * @returns {Object} Formatted not found response
   */
  static notFound(message = 'Resource not found') {
    return {
      success: false,
      status: API_RESPONSE_STATUS.ERROR,
      message,
      statusCode: 404,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create a pagination response
   * @param {Array} data - The paginated data
   * @param {Object} pagination - Pagination metadata
   * @param {string} message - Success message
   * @returns {Object} Formatted pagination response
   */
  static paginated(data, pagination, message = 'Data retrieved successfully') {
    return {
      success: true,
      status: API_RESPONSE_STATUS.SUCCESS,
      message,
      data,
      pagination: {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        itemsPerPage: pagination.itemsPerPage,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage
      },
      statusCode: 200,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ApiResponse;
