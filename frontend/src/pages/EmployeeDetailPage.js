import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import Button from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import EmployeeService from '../services/EmployeeService';
import { getErrorMessage } from '../utils/errorHandler';
import { formatCurrency, formatDateTime } from '../utils/formatting';
import '../styles/pages.css';

/**
 * EmployeeDetailPage Component
 * Page for viewing single employee details
 */
const EmployeeDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
   * Handle delete confirmation
   */
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await EmployeeService.deleteEmployee(id);
      navigate('/employees');
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading employee details..." />;
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-header">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/employees')}
          >
            ← Back to Employees
          </Button>
          <h1>Employee Details</h1>
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
            onClick={() => navigate('/employees')}
          >
            ← Back to Employees
          </Button>
          <h1>Employee Details</h1>
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
          onClick={() => navigate('/employees')}
        >
          ← Back to Employees
        </Button>
        <h1>{employee.name}</h1>
      </div>

      <div className="employee-detail">
        <div className="detail-section">
          <div className="detail-group">
            <span className="detail-group-label">Name</span>
            <span className="detail-group-value">{employee.name}</span>
          </div>

          <div className="detail-group">
            <span className="detail-group-label">Email</span>
            <a href={`mailto:${employee.email}`} className="detail-group-value">
              {employee.email}
            </a>
          </div>

          <div className="detail-group">
            <span className="detail-group-label">Department</span>
            <span className="detail-group-value">{employee.department}</span>
          </div>

          <div className="detail-group">
            <span className="detail-group-label">Salary</span>
            <span className="detail-group-value">
              {formatCurrency(employee.salary)}
            </span>
          </div>
        </div>

        {(employee.createdAt || employee.updatedAt) && (
          <div className="detail-section">
            {employee.createdAt && (
              <div className="detail-group">
                <span className="detail-group-label">Created</span>
                <span className="detail-group-value">
                  {formatDateTime(employee.createdAt)}
                </span>
              </div>
            )}

            {employee.updatedAt && (
              <div className="detail-group">
                <span className="detail-group-label">Last Updated</span>
                <span className="detail-group-value">
                  {formatDateTime(employee.updatedAt)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="detail-actions">
          <Button
            variant="ghost"
            size="md"
            onClick={() => navigate('/employees')}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/employees/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => setDeleteConfirm(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employee.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(false)}
      />
    </div>
  );
};

export default EmployeeDetailPage;
