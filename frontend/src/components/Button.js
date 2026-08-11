import React from 'react';
import '../styles/buttons.css';

/**
 * Button Component
 * Reusable button with multiple variants
 */
const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'success', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
