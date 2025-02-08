import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchFilters from '../components/SearchFilters/SearchFilters'

test('updates filter inputs and applies changes', async () => {
  const mockOnChange = jest.fn()
  render(<SearchFilters filters={{ routeFilter: '', vehicleType: 'all' }} onFilterChange={mockOnChange} />)

  fireEvent.change(screen.getByPlaceholderText(/Filter by route/i), {
    target: { value: '550' }
  })
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: 'bus' }
  })
  fireEvent.click(screen.getByText(/Apply Filters/i))

  expect(mockOnChange).toHaveBeenCalledWith({
    routeFilter: '550',
    vehicleType: 'bus'
  })
}) 