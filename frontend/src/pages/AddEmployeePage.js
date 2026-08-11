import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import Button from '../components/Button';
import { EmployeeContext } from '../context/EmployeeContext';
import EmployeeService from '../services/EmployeeService';
import { getErrorMessage } from '../utils/errorHandler';
import '../styles/pages.css';

/**
 * AddEmployeePage Component
 * Page for creating new employees
 */
const AddEmployeePage = () => {
  const navigate = useNavigate();
  const { setIsLoading, setErrorMessage, clearError, addEmployee } = useContext(EmployeeContext);
  const [localError, setLocalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setLocalError(null);
      const newEmployee = await EmployeeService.createEmployee(formData);
      addEmployee(newEmployee);
      setErrorMessage('Employee created successfully!');
      navigate('/employees');
    } catch (error) {
      throw error; // Let form handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  return (
    <div className="page">
      <div className="page-header">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
        >
          ← Back to Employees
        </Button>
        <h1>Add New Employee</h1>
      </div>

      {localError && (
        <Alert
          type="danger"
          message={localError}
          onClose={() => setLocalError(null)}
        />
      )}

      <div className="form-container">
        <EmployeeForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddEmployeePage;
