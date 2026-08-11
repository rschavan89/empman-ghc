import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EmployeeProvider } from './context/EmployeeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import EmployeeListPage from './pages/EmployeeListPage';
import AddEmployeePage from './pages/AddEmployeePage';
import EditEmployeePage from './pages/EditEmployeePage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import './styles/layout.css';

/**
 * App Component
 * Main application component with routing
 */
function App() {
  return (
    <EmployeeProvider>
      <Router>
        <div className="app-container">
          <Header />
          
          <main className="app-main">
            <div className="container">
              <Routes>
                <Route path="/" element={<Navigate to="/employees" replace />} />
                <Route path="/employees" element={<EmployeeListPage />} />
                <Route path="/employees/add" element={<AddEmployeePage />} />
                <Route path="/employees/:id" element={<EmployeeDetailPage />} />
                <Route path="/employees/:id/edit" element={<EditEmployeePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>

          <Footer />
        </div>
      </Router>
    </EmployeeProvider>
  );
}

/**
 * NotFound Component
 * 404 page
 */
const NotFound = () => (
  <div className="page">
    <div className="text-center" style={{ padding: '60px 20px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <a href="/employees" className="btn btn-primary" style={{ display: 'inline-block' }}>
        Back to Employees
      </a>
    </div>
  </div>
);

export default App;
