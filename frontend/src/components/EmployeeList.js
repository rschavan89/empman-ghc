import React from 'react';
import EmployeeCard from './EmployeeCard';
import Loading from './Loading';
import '../styles/employee-list.css';

/**
 * EmployeeList Component
 * Displays list of employees in card view
 */
const EmployeeList = ({
  employees,
  isLoading = false,
  isEmpty = false,
  onView,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return <Loading message="Loading employees..." />;
  }

  if (isEmpty || employees.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-message">No employees found.</p>
        <p className="empty-state-hint">
          Click the "Add Employee" button to create your first employee.
        </p>
      </div>
    );
  }

  return (
    <div className="employee-list">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default EmployeeList;
