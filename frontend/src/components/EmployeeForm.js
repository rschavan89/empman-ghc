import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import Button from './Button';
import Alert from './Alert';
import { validateEmployeeForm, isFormValid } from '../utils/validation';
import { getFieldErrors, getErrorMessage } from '../utils/errorHandler';
import '../styles/forms.css';

/**
 * EmployeeForm Component
 * Handles both create and update operations
 */
const EmployeeForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    salary: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  // Initialize form with existing data for edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        department: initialData.department || '',
        salary: initialData.salary || '',
      });
    }
  }, [initialData]);

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    // Validate form
    const validationErrors = validateEmployeeForm(formData);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Get field errors from server response
      const fieldErrors = getFieldErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        setServerError(getErrorMessage(error));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {serverError && (
        <Alert
          type="danger"
          message={serverError}
          onClose={() => setServerError(null)}
        />
      )}

      <div className="form-row">
        <FormField
          label="Name"
          name="name"
          placeholder="Enter employee name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          required
          maxLength={255}
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-row">
        <FormField
          label="Department"
          name="department"
          placeholder="Enter department"
          value={formData.department}
          onChange={handleInputChange}
          error={errors.department}
          required
          maxLength={255}
        />

        <FormField
          label="Salary"
          name="salary"
          type="number"
          placeholder="Enter salary amount"
          value={formData.salary}
          onChange={handleInputChange}
          error={errors.salary}
          required
          step="0.01"
        />
      </div>

      <div className="form-actions">
        <Button
          variant="ghost"
          size="md"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
