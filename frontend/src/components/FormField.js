import React from 'react';
import '../styles/forms.css';

/**
 * Form Field Component
 * Wrapper for form inputs with label, error, and helper text
 */
const FormField = ({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  autoComplete,
  helpText,
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`form-input ${error ? 'is-invalid' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <div id={`${name}-error`} className="form-error">
          {error}
        </div>
      )}
      {helpText && !error && (
        <div className="form-help-text">{helpText}</div>
      )}
    </div>
  );
};

export default FormField;
