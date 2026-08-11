import React, { createContext, useState, useCallback, useEffect } from 'react';

/**
 * EmployeeContext
 * Manages global employee data and operations
 * Provides: employees list, loading state, error state, and action methods
 */
export const EmployeeContext = createContext();

/**
 * EmployeeProvider Component
 * Wraps application to provide employee context to all child components
 */
export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  /**
   * Set loading state
   */
  const setIsLoading = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  /**
   * Set error message
   */
  const setErrorMessage = useCallback((message) => {
    setError(message);
    // Auto-clear error after 5 seconds
    if (message) {
      setTimeout(() => setError(null), 5000);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Update employees list
   */
  const updateEmployees = useCallback((employeesList) => {
    setEmployees(employeesList);
  }, []);

  /**
   * Add employee to list
   */
  const addEmployee = useCallback((employee) => {
    setEmployees((prev) => [...prev, employee]);
  }, []);

  /**
   * Update single employee in list
   */
  const updateEmployeeInList = useCallback((id, updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? updatedEmployee : emp))
    );
  }, []);

  /**
   * Remove employee from list
   */
  const removeEmployeeFromList = useCallback((id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  }, []);

  /**
   * Filter employees by search term
   */
  const filterEmployees = useCallback((term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(term.toLowerCase()) ||
          emp.email.toLowerCase().includes(term.toLowerCase()) ||
          emp.department.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [employees]);

  /**
   * Initialize filteredEmployees when employees change
   */
  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

  const value = {
    // State
    employees,
    loading,
    error,
    selectedEmployee,
    searchTerm,
    filteredEmployees,
    
    // Actions
    setIsLoading,
    setErrorMessage,
    clearError,
    updateEmployees,
    addEmployee,
    updateEmployeeInList,
    removeEmployeeFromList,
    setSelectedEmployee,
    filterEmployees,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};
