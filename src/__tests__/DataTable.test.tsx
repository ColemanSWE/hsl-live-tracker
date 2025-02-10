import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DataTable from '../components/DataTable/DataTable';
import { VehiclePosition } from '../services/hslApi';

const mockVehicles: VehiclePosition[] = [
  {
    id: '1',
    route: '550',
    direction: 1,
    lat: 60.1699,
    long: 24.9384,
    speed: 12.3,
    timestamp: Date.now(),
    operator: 'HSL',
    vehicleType: 'bus',
  },
];

const mockPagination = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 1,
  totalPages: 1,
};

const mockCallbacks = {
  onFilterChange: jest.fn(),
  onPageChange: jest.fn(),
  onItemsPerPageChange: jest.fn(),
};

test('displays vehicle data correctly', () => {
  render(
    <DataTable
      vehicles={mockVehicles}
      filters={{ routeFilter: '', vehicleType: 'all' }}
      pagination={mockPagination}
      {...mockCallbacks}
    />,
  );

  expect(screen.getByText('550')).toBeInTheDocument();
  expect(screen.getByText('bus')).toBeInTheDocument();
  expect(screen.getByText('12.3')).toBeInTheDocument();
});

test('handles missing speed values', () => {
  const vehicles = [
    {
      ...mockVehicles[0],
      speed: null,
    },
  ];

  render(
    <DataTable
      vehicles={vehicles}
      filters={{ routeFilter: '', vehicleType: 'all' }}
      pagination={mockPagination}
      {...mockCallbacks}
    />,
  );
  expect(screen.getByText('N/A')).toBeInTheDocument();
});
