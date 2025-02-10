import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../components/Pagination/Pagination';

const mockPagination = {
  currentPage: 3,
  totalPages: 5,
  itemsPerPage: 10,
  totalItems: 50,
  onPageChange: jest.fn(),
  onItemsPerPageChange: jest.fn(),
};

test('renders pagination controls correctly', () => {
  render(<Pagination {...mockPagination} />);

  expect(screen.getByText('Showing 21-30 of 50')).toBeInTheDocument();
  expect(screen.getByText('3')).toHaveClass('activePage');
  expect(screen.getAllByRole('button')).toHaveLength(7); // Prev, 1, 2, 3, 4, 5, Next
});

test('handles page navigation clicks', () => {
  render(<Pagination {...mockPagination} />);

  fireEvent.click(screen.getByText('Next'));
  expect(mockPagination.onPageChange).toHaveBeenCalledWith(4);

  fireEvent.click(screen.getByText('Previous'));
  expect(mockPagination.onPageChange).toHaveBeenCalledWith(2);

  fireEvent.click(screen.getByText('5'));
  expect(mockPagination.onPageChange).toHaveBeenCalledWith(5);
});

test('handles items per page change', () => {
  render(<Pagination {...mockPagination} />);

  fireEvent.change(screen.getByRole('combobox'), { target: { value: '20' } });
  expect(mockPagination.onItemsPerPageChange).toHaveBeenCalledWith(20);
});

test('shows correct item range for last page', () => {
  render(<Pagination {...mockPagination} itemsPerPage={15} totalItems={32} />);
  expect(screen.getByText('Showing 31-32 of 32')).toBeInTheDocument();
});

test('disables navigation buttons on boundaries', () => {
  const { rerender } = render(<Pagination {...mockPagination} currentPage={1} />);
  expect(screen.getByText('Previous')).toBeDisabled();

  rerender(<Pagination {...mockPagination} currentPage={5} />);
  expect(screen.getByText('Next')).toBeDisabled();
});
