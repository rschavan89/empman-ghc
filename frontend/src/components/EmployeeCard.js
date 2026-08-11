import React from 'react';
import Button from './Button';
import { formatCurrency, formatDate } from '../utils/formatting';
import '../styles/employee-card.css';

/**
 * EmployeeCard Component
 * Displays individual employee information
 */
const EmployeeCard = ({
  employee,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  return (
    <div className="employee-card">
      <div className="employee-card-body">
        <h3 className="employee-name">{employee.name}</h3>
        
        <div className="employee-details">
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <a href={`mailto:${employee.email}`} className="detail-value">
              {employee.email}
            </a>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Department:</span>
            <span className="detail-value">{employee.department}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Salary:</span>
            <span className="detail-value salary">
              {formatCurrency(employee.salary)}
            </span>
          </div>

          {employee.createdAt && (
            <div className="detail-row">
              <span className="detail-label">Created:</span>
              <span className="detail-value">{formatDate(employee.createdAt)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="employee-card-actions">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onView(employee.id)}
          disabled={isLoading}
        >
          View
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onEdit(employee.id)}
          disabled={isLoading}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(employee.id)}
          disabled={isLoading}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default EmployeeCard;
