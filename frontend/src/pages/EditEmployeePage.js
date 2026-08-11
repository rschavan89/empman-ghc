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
 * EditEmployeePage Component
 * Page for editing existing employees
 */
const EditEmployeePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { employees, setIsLoading, updateEmployeeInList } = useContext(EmployeeContext);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Load employee data
   */
  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true);
        const data = await EmployeeService.getEmployeeById(id);
        setEmployee(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [id]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const updatedEmployee = await EmployeeService.updateEmployee(id, formData);
      updateEmployeeInList(id, updatedEmployee);
      navigate('/employees');
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  if (loading) {
    return <Loading message="Loading employee..." />;
  }

  if (error) {
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
          <h1>Edit Employee</h1>
        </div>
        <Alert type="danger" message={error} />
      </div>
    );
  }

  if (!employee) {
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
          <h1>Edit Employee</h1>
        </div>
        <Alert type="warning" message="Employee not found" />
      </div>
    );
  }

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
        <h1>Edit Employee: {employee.name}</h1>
      </div>

      <div className="form-container">
        <EmployeeForm
          initialData={employee}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditEmployeePage;
