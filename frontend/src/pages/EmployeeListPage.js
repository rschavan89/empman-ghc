import React, { useState, useEffect, useContext } from 'react';
import EmployeeList from '../components/EmployeeList';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import { EmployeeContext } from '../context/EmployeeContext';
import EmployeeService from '../services/EmployeeService';
import { getErrorMessage } from '../utils/errorHandler';
import '../styles/pages.css';

/**
 * EmployeeListPage Component
 * Main page showing all employees with search, add, edit, delete functionality
 */
const EmployeeListPage = () => {
  const navigate = useNavigate();
  const {
    employees,
    loading,
    error,
    filteredEmployees,
    setIsLoading,
    setErrorMessage,
    clearError,
    updateEmployees,
    removeEmployeeFromList,
    filterEmployees,
  } = useContext(EmployeeContext);

  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    employeeId: null,
    employeeName: null,
  });

  /**
   * Load all employees on component mount
   */
  useEffect(() => {
    loadEmployees();
  }, []);

  /**
   * Fetch all employees
   */
  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await EmployeeService.getAllEmployees();
      updateEmployees(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle search
   */
  const handleSearch = (searchTerm) => {
    filterEmployees(searchTerm);
  };

  /**
   * Navigate to employee detail page
   */
  const handleView = (employeeId) => {
    navigate(`/employees/${employeeId}`);
  };

  /**
   * Navigate to edit page
   */
  const handleEdit = (employeeId) => {
    navigate(`/employees/${employeeId}/edit`);
  };

  /**
   * Open delete confirmation dialog
   */
  const handleDeleteClick = (employeeId) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (employee) {
      setDeleteConfirm({
        isOpen: true,
        employeeId,
        employeeName: employee.name,
      });
    }
  };

  /**
   * Confirm delete employee
   */
  const handleDeleteConfirm = async () => {
    const { employeeId } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, employeeId: null, employeeName: null });

    try {
      setIsLoading(true);
      await EmployeeService.deleteEmployee(employeeId);
      removeEmployeeFromList(employeeId);
      setErrorMessage(`Employee deleted successfully`); // Will show as success since context auto-clears
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancel delete
   */
  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, employeeId: null, employeeName: null });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="header-content">
          <h1>Employee Directory</h1>
          <p className="page-subtitle">
            Manage your employee information
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/employees/add')}
          disabled={loading}
        >
          + Add Employee
        </Button>
      </div>

      {error && (
        <Alert
          type="danger"
          message={error}
          onClose={clearError}
        />
      )}

      <SearchBar
        onSearch={handleSearch}
        isLoading={loading}
      />

      <EmployeeList
        employees={filteredEmployees || employees}
        isLoading={loading}
        isEmpty={employees.length === 0}
        onView={handleView}
        onEdit={handleDeleteClick}
        onDelete={handleDeleteClick}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteConfirm.employeeName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default EmployeeListPage;
