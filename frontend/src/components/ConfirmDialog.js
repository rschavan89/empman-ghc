import React from 'react';
import '../styles/modal.css';

/**
 * ConfirmDialog Component
 * Modal for confirming delete operations
 */
const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button
            className="modal-close"
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
