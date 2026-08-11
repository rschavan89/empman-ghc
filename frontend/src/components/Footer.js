import React from 'react';
import '../styles/footer.css';

/**
 * Footer Component
 * Application footer
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <p>&copy; {currentYear} Employee Manager. All rights reserved.</p>
        <p className="footer-version">v1.0.0</p>
      </div>
    </footer>
  );
};

export default Footer;
