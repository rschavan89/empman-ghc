/**
 * Formatting utilities
 * Provides formatting functions for display
 */

/**
 * Format salary as currency
 * @param {number} salary - Salary amount
 * @returns {string} Formatted salary (e.g., $50,000.00)
 */
export const formatCurrency = (salary) => {
  if (!salary) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(salary);
};

/**
 * Format date for display
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date (e.g., Aug 11, 2026)
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Format datetime for display
 * @param {string|Date} datetime - Datetime string or Date object
 * @returns {string} Formatted datetime (e.g., Aug 11, 2026, 2:30 PM)
 */
export const formatDateTime = (datetime) => {
  if (!datetime) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(datetime));
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Capitalize first letter of string
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
