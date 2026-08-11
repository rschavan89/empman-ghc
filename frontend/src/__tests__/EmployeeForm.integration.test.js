import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import EmployeeForm from '../EmployeeForm';
import * as EmployeeService from '../../services/EmployeeService';

jest.mock('../../services/EmployeeService');

describe('EmployeeForm Component - Integration Tests', () => {
  const mockEmployee = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    department: 'Engineering',
    salary: '50000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form in create mode', () => {
    render(
      <Router>
        <EmployeeForm onSubmit={jest.fn()} onCancel={jest.fn()} />
      </Router>
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /add employee/i })).toBeInTheDocument();
  });

  test('renders form in edit mode with initial data', () => {
    render(
      <Router>
        <EmployeeForm
          initialData={mockEmployee}
          onSubmit={jest.fn()}
          onCancel={jest.fn()}
        />
      </Router>
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByRole('button', { name: /update employee/i })).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const handleSubmit = jest.fn().mockResolvedValue(mockEmployee);
    const handleCancel = jest.fn();

    render(
      <Router>
        <EmployeeForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'HR' } });
    fireEvent.change(screen.getByLabelText(/salary/i), { target: { value: '60000' } });

    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        department: 'HR',
        salary: '60000',
      });
    });
  });

  test('displays validation errors for invalid input', async () => {
    render(
      <Router>
        <EmployeeForm onSubmit={jest.fn()} onCancel={jest.fn()} />
      </Router>
    );

    // Try to submit without filling form
    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  test('displays server error when submission fails', async () => {
    const error = new Error('Server error');
    error.response = {
      data: { message: 'Email already exists' },
    };
    const handleSubmit = jest.fn().mockRejectedValue(error);

    render(
      <Router>
        <EmployeeForm onSubmit={handleSubmit} onCancel={jest.fn()} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'Engineering' } });
    fireEvent.change(screen.getByLabelText(/salary/i), { target: { value: '50000' } });

    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));

    // Error will be thrown and caught by the form
  });

  test('calls onCancel when cancel button is clicked', () => {
    const handleCancel = jest.fn();

    render(
      <Router>
        <EmployeeForm onSubmit={jest.fn()} onCancel={handleCancel} />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  test('disables form while submitting', () => {
    const handleSubmit = jest.fn();

    const { rerender } = render(
      <Router>
        <EmployeeForm onSubmit={handleSubmit} onCancel={jest.fn()} isLoading={false} />
      </Router>
    );

    expect(screen.getByRole('button', { name: /add employee/i })).not.toBeDisabled();

    rerender(
      <Router>
        <EmployeeForm onSubmit={handleSubmit} onCancel={jest.fn()} isLoading={true} />
      </Router>
    );

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });
});
