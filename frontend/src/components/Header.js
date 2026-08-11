import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

/**
 * Header Component
 * Application header with navigation
 */
const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/employees" className="header-brand">
          <span className="brand-icon">👥</span>
          Employee Manager
        </Link>
        
        <nav className="header-nav">
          <Link to="/employees" className="nav-link">
            Employees
          </Link>
          <Link to="/employees/add" className="nav-link nav-link-primary">
            + Add Employee
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
