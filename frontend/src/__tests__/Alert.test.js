import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from '../Alert';

describe('Alert Component', () => {
  test('does not render when message is empty', () => {
    const { container } = render(<Alert message="" />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  test('renders alert with message', () => {
    render(<Alert type="info" message="Test message" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('renders with success type', () => {
    render(<Alert type="success" message="Success!" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-success');
  });

  test('renders with danger type', () => {
    render(<Alert type="danger" message="Error!" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-danger');
  });

  test('renders close button when onClose provided', () => {
    const { container } = render(
      <Alert type="info" message="Test" onClose={jest.fn()} />
    );
    const closeButton = container.querySelector('.alert-close');
    expect(closeButton).toBeInTheDocument();
  });

  test('calls onClose when close button clicked', () => {
    const handleClose = jest.fn();
    render(<Alert type="info" message="Test" onClose={handleClose} />);
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('does not render close button when onClose not provided', () => {
    const { container } = render(
      <Alert type="info" message="Test" />
    );
    const closeButton = container.querySelector('.alert-close');
    expect(closeButton).not.toBeInTheDocument();
  });
});
