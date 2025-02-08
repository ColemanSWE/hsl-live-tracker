import '@testing-library/jest-dom'
import { render, screen, waitFor, act } from '@testing-library/react'
import App from '../App'

type MessageHandler = (topic: string, message: Buffer) => void
let mockMessageHandler: MessageHandler | null = null

jest.mock('mqtt', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(() => ({
      on: jest.fn((event: string, cb: MessageHandler) => {
        if (event === 'message') mockMessageHandler = cb
      }),
      subscribe: jest.fn(),
      end: jest.fn()
    }))
  }
}))

test('renders loading state initially', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /HSL Real-Time Tracker/i })).toBeInTheDocument()
})

test('displays data after connection', async () => {
  render(<App />)
  
  // Simulate successful connection
  await waitFor(() => {
    expect(mockMessageHandler).toBeTruthy()
  }, { timeout: 1000 })

  // Create valid test data matching your VehiclePosition interface
  const mockData = JSON.stringify({
    id: '12345',
    route: '550',
    lat: 60.1699,
    long: 24.9384,
    speed: 8.5,
    vehicleType: 'bus',
    timestamp: Date.now()
  })

  // Update state in act block
  act(() => {
    mockMessageHandler?.(
      'hfp/v2/journey/ongoing/vp/bus/+/+/550/+/#',
      Buffer.from(mockData)
    )
  })

  // Wait for UI updates
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    expect(screen.getByTestId('map-container')).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
  }, { timeout: 5000 })
}) 