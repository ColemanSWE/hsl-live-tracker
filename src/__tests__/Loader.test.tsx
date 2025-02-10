import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Loader from '../components/Loader/Loader';

test('displays loading spinner and text', () => {
  render(<Loader />);
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.getByText(/Tracking vehicles/i)).toBeInTheDocument();
});
