import { useState } from 'react'

type Filters = {
  routeFilter: string
  vehicleType: string
}

export default function SearchFilters({ 
  filters,
  onFilterChange
}: {
  filters: Filters
  onFilterChange: (filters: Filters) => void
}) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleApply = () => onFilterChange(localFilters)

  return (
    <div className="filters-container">
      <input
        type="text"
        placeholder="Filter by route..."
        value={localFilters.routeFilter}
        onChange={e => setLocalFilters(prev => ({...prev, routeFilter: e.target.value}))}
      />
      
      <select 
        value={localFilters.vehicleType}
        onChange={e => setLocalFilters(prev => ({...prev, vehicleType: e.target.value}))}
      >
        <option value="all">All Vehicles</option>
        <option value="bus">Buses</option>
        <option value="tram">Trams</option>
        <option value="metro">Metro</option>
        <option value="train">Trains</option>
      </select>

      <button onClick={handleApply}>Apply Filters</button>
    </div>
  )
}