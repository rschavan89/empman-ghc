import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmployeeList from '../EmployeeList';

describe('EmployeeList Component - Integration Tests', () => {
  const mockEmployees = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Engineering',
      salary: '50000',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      department: 'HR',
      salary: '45000',
    },
  ];

  test('renders employee list with cards', () => {
    render(
      <EmployeeList
        employees={mockEmployees}
        onView={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('displays empty state when no employees', () => {
    render(
      <EmployeeList
        employees={[]}
        isEmpty={true}
        onView={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(
      <EmployeeList
        employees={[]}
        isLoading={true}
        onView={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText(/loading employees/i)).toBeInTheDocument();
  });

  test('renders action buttons for each employee', () => {
    const { container } = render(
      <EmployeeList
        employees={mockEmployees}
        onView={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    expect(viewButtons).toHaveLength(2);
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });
});
