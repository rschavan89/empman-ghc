import React from 'react';
import '../styles/components.css';

/**
 * Alert Component
 * Displays success, danger, warning, or info messages
 */
const Alert = ({
  type = 'info', // 'success', 'danger', 'warning', 'info'
  message,
  onClose,
  icon = '×',
}) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close">
          {icon}
        </button>
      )}
    </div>
  );
};

export default Alert;
