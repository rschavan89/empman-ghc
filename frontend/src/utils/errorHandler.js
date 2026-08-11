/**
 * Error handling utilities
 * Standardizes error message extraction and formatting
 */

/**
 * Extract user-friendly error message from API error
 * @param {Error} error - Axios error object
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  if (error.message) {
    return error.message;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.status === 404) {
    return 'Resource not found';
  }
  if (error.response?.status === 409) {
    return 'Email already exists';
  }
  if (error.response?.status === 400) {
    return 'Invalid input - please check your data';
  }
  if (error.response?.status === 500) {
    return 'Server error - please try again later';
  }
  return error.message || 'An error occurred';
};

/**
 * Extract field-level errors from API error
 * @param {Error} error - Axios error object
 * @returns {Object} Field errors { fieldName: 'error message' }
 */
export const getFieldErrors = (error) => {
  const fieldErrors = {};
  
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    error.response.data.errors.forEach((err) => {
      if (err.field && err.message) {
        fieldErrors[err.field] = err.message;
      }
    });
  }
  
  return fieldErrors;
};

/**
 * Check if error is a validation error
 * @param {Error} error - Axios error object
 * @returns {boolean} True if validation error
 */
export const isValidationError = (error) => {
  return error.response?.status === 400;
};

/**
 * Check if error is a conflict (duplicate email)
 * @param {Error} error - Axios error object
 * @returns {boolean} True if conflict error
 */
export const isConflictError = (error) => {
  return error.response?.status === 409;
};

/**
 * Check if error is not found
 * @param {Error} error - Axios error object
 * @returns {boolean} True if not found error
 */
export const isNotFoundError = (error) => {
  return error.response?.status === 404;
};
