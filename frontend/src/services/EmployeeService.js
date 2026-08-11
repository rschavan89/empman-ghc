import axios from 'axios';

// API Base URL - Change this for production deployments
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Axios instance configured for Employee API calls
 * Handles:
 * - Base URL configuration
 * - Error handling
 * - Request/response transformation
 */
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/employees`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Response interceptor for handling API responses
 * Extracts data from ApiResponse wrapper
 */
apiClient.interceptors.response.use(
  (response) => {
    // Backend returns ApiResponse wrapper: { success, data, message, errors }
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Handle error responses consistently
    if (error.response && error.response.data) {
      const apiError = error.response.data;
      const errorMessage = apiError.message || 'An error occurred';
      const fieldErrors = apiError.errors || [];
      
      error.message = errorMessage;
      error.fieldErrors = fieldErrors;
    }
    return Promise.reject(error);
  }
);

/**
 * Employee Service API
 * Provides methods to interact with Employee Management backend
 */
const EmployeeService = {
  /**
   * Get all employees
   * @returns {Promise<Array>} List of all employees
   */
  getAllEmployees: () => {
    return apiClient.get('/');
  },

  /**
   * Get employee by ID
   * @param {number} id - Employee ID
   * @returns {Promise<Object>} Employee data
   * @throws {Error} If employee not found (404)
   */
  getEmployeeById: (id) => {
    return apiClient.get(`/${id}`);
  },

  /**
   * Create new employee
   * @param {Object} employeeData - Employee data (name, email, department, salary)
   * @returns {Promise<Object>} Created employee with ID
   * @throws {Error} If validation fails (400) or email already exists (409)
   */
  createEmployee: (employeeData) => {
    return apiClient.post('/', employeeData);
  },

  /**
   * Update existing employee
   * @param {number} id - Employee ID
   * @param {Object} employeeData - Employee data to update
   * @returns {Promise<Object>} Updated employee
   * @throws {Error} If employee not found (404) or validation fails (400)
   */
  updateEmployee: (id, employeeData) => {
    return apiClient.put(`/${id}`, employeeData);
  },

  /**
   * Delete employee
   * @param {number} id - Employee ID
   * @returns {Promise<void>}
   * @throws {Error} If employee not found (404)
   */
  deleteEmployee: (id) => {
    return apiClient.delete(`/${id}`);
  },

  /**
   * Search employees by name (case-insensitive)
   * @param {string} name - Search term
   * @returns {Promise<Array>} Matching employees
   */
  searchEmployeesByName: (name) => {
    return apiClient.get(`/search?name=${encodeURIComponent(name)}`);
  },
};

export default EmployeeService;
