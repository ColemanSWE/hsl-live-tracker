import { render } from '@testing-library/react'
import SpeedChart from '../components/SpeedChart/SpeedChart'
import { VehiclePosition } from '../services/hslApi'
import React from 'react'

// Mock ResponsiveContainer with fixed dimensions
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">
      {children && React.cloneElement(children as React.ReactElement)}
    </div>
  )
}))

const mockVehicles: VehiclePosition[] = [
  { vehicleType: 'bus', speed: 10, id: '1', route: '550', direction: 1, lat: 60.1, long: 24.9, timestamp: Date.now(), operator: 'HSL' },
  { vehicleType: 'bus', speed: 20, id: '2', route: '551', direction: 1, lat: 60.2, long: 24.8, timestamp: Date.now(), operator: 'HSL' },
  { vehicleType: 'tram', speed: 15, id: '3', route: '9', direction: 1, lat: 60.3, long: 24.7, timestamp: Date.now(), operator: 'HSL' },
  { vehicleType: 'tram', speed: 25, id: '4', route: '6', direction: 1, lat: 60.4, long: 24.6, timestamp: Date.now(), operator: 'HSL' },
]

// Add to top of file
class ResizeObserverMock {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

global.ResizeObserver = ResizeObserverMock;

describe('SpeedChart processData', () => {
  test('calculates correct averages', () => {
    const processedData = SpeedChart({ vehicles: mockVehicles }).props.children[1].props.children.props.data
    expect(processedData).toEqual([
      { vehicleType: 'bus', speed: 15 },
      { vehicleType: 'tram', speed: 20 }
    ])
  })

  test('handles empty input', () => {
    const processedData = SpeedChart({ vehicles: [] }).props.children[1].props.children.props.data
    expect(processedData).toEqual([])
  })

  test('handles single entry', () => {
    const singleVehicle = [mockVehicles[0]]
    const processedData = SpeedChart({ vehicles: singleVehicle }).props.children[1].props.children.props.data
    expect(processedData).toEqual([{ vehicleType: 'bus', speed: 10 }])
  })
})

describe('SpeedChart component', () => {
  test('matches snapshot', () => {
    const { container } = render(<SpeedChart vehicles={mockVehicles} />)
    expect(container).toMatchSnapshot()
  })
}) 