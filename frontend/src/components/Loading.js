import React from 'react';
import '../styles/loading.css';

/**
 * Loading Component
 * Displays a loading spinner
 */
const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default Loading;
