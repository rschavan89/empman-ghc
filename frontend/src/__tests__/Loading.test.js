import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loading from '../Loading';

describe('Loading Component', () => {
  test('renders loading spinner', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  test('renders default message', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders custom message', () => {
    render(<Loading message="Loading employees..." />);
    expect(screen.getByText('Loading employees...')).toBeInTheDocument();
  });

  test('renders in loading container', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.querySelector('.loading-container');
    expect(loadingContainer).toBeInTheDocument();
  });
});
