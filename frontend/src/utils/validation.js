/**
 * Validation utilities
 * Provides validation logic for employee form fields
 */

const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 255,
    pattern: /^[a-zA-Z\s'-]+$/, // Letters, spaces, hyphens, apostrophes
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
  },
  department: {
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  salary: {
    required: true,
    pattern: /^\d+(\.\d{1,2})?$/, // Positive decimal with up to 2 decimals
    min: 0.01,
  },
};

/**
 * Validate a single field
 * @param {string} fieldName - Field name
 * @param {any} value - Field value
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (fieldName, value) => {
  const rules = VALIDATION_RULES[fieldName];
  
  if (!rules) {
    return null;
  }

  // Required validation
  if (rules.required) {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
  }

  if (!value) {
    return null; // Skip further validation if not required and empty
  }

  // Min length validation
  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    return `${fieldName} must be at least ${rules.minLength} characters`;
  }

  // Max length validation
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    return `${fieldName} cannot exceed ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value.toString())) {
    const errorMessages = {
      name: 'Name must contain only letters, spaces, hyphens, or apostrophes',
      email: 'Email must be valid (e.g., user@example.com)',
      salary: 'Salary must be a positive number',
    };
    return errorMessages[fieldName] || `${fieldName} format is invalid`;
  }

  // Min value validation (for numbers)
  if (rules.min !== undefined && Number(value) < rules.min) {
    return `${fieldName} must be at least ${rules.min}`;
  }

  return null;
};

/**
 * Validate entire employee form
 * @param {Object} formData - Form data object
 * @returns {Object} Errors object { fieldName: 'error message' }
 */
export const validateEmployeeForm = (formData) => {
  const errors = {};

  Object.keys(VALIDATION_RULES).forEach((fieldName) => {
    const error = validateField(fieldName, formData[fieldName]);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

/**
 * Check if form is valid (no errors)
 * @param {Object} errors - Errors object
 * @returns {boolean} True if no errors
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
