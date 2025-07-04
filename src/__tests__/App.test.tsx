import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';
import App from '../App';
import type { VehiclePosition } from '../services/hslApi';

let mockCleanup: jest.Mock;
let mockCallback: ((data: VehiclePosition) => void) | null = null;

jest.mock('../services/hslApi', () => ({
  initRealtimeConnection: jest.fn((callback: (data: VehiclePosition) => void) => {
    mockCallback = callback;
    return (mockCleanup = jest.fn());
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockCallback = null;
});

test('renders loading state initially', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /HSL Real-Time Tracker/i })).toBeInTheDocument();
  expect(screen.getByText('Tracking vehicles in real-time...')).toBeInTheDocument();
  expect(screen.getByRole('status')).toBeInTheDocument();
});

test('displays data after connection', async () => {
  const { unmount } = render(<App />);

  await act(async () => {
    // Simulate receiving vehicle data
    if (mockCallback) {
      mockCallback({
        id: '12345',
        route: '550',
        direction: 1,
        lat: 60.1699,
        long: 24.9384,
        speed: 8.5,
        vehicleType: 'bus',
        timestamp: Date.now(),
        operator: '12',
      });
    }
  });

  await waitFor(() => {
    expect(screen.queryByText('Tracking vehicles in real-time...')).not.toBeInTheDocument();
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  unmount();
  expect(mockCleanup).toHaveBeenCalled();
});
