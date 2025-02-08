import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import MapView from '../components/MapView/MapView'

jest.mock('leaflet', () => ({
  map: jest.fn().mockReturnValue({ setView: jest.fn(), remove: jest.fn() }),
  tileLayer: jest.fn().mockReturnValue({ addTo: jest.fn() }),
  layerGroup: jest.fn().mockReturnValue({ clearLayers: jest.fn(), addTo: jest.fn() }),
  marker: jest.fn().mockReturnValue({ bindPopup: jest.fn(), addTo: jest.fn() })
}))

jest.mock('leaflet/dist/leaflet.css', () => '');

test('initializes map container', () => {
  render(<MapView vehicles={[]} />)
  expect(document.getElementById('map')).toBeInTheDocument()
}) 