import { useState, useEffect } from 'react'
import { initRealtimeConnection, VehiclePosition } from './services/hslApi'
import MapView from './components/MapView/MapView'
import DataTable from './components/DataTable/DataTable'
import SearchFilters from './components/SearchFilters/SearchFilters'
import Loader from './components/Loader/Loader'
import styles from './App.module.scss'

function App() {
  const [vehicles, setVehicles] = useState<VehiclePosition[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    routeFilter: '',
    vehicleType: 'all'
  })

  useEffect(() => {
    const cleanup = initRealtimeConnection(vehicle => {
      setVehicles(prev => {
        const existing = prev.find(v => v.id === vehicle.id)
        return existing ? prev.map(v => v.id === vehicle.id ? vehicle : v) : [...prev, vehicle]
      })
      setLoading(false)
    })

    return () => {
      cleanup();
    }
  }, [])

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesRoute = vehicle.route.toLowerCase().includes(filters.routeFilter.toLowerCase())
    const matchesType = filters.vehicleType === 'all' || vehicle.vehicleType === filters.vehicleType
    return matchesRoute && matchesType
  })

  return (
      <div className={styles.appContainer}>
        <h1>HSL Real-Time Tracker</h1>
        <SearchFilters filters={filters} onFilterChange={setFilters} />
        
        {loading ? (
          <Loader />
        ) : (
          <div className={styles.contentWrapper}>
            <div className={styles.mapContainer} data-testid="map-container">
              <MapView vehicles={filteredVehicles} />
            </div>
            <div className={styles.tableContainer}>
              <DataTable vehicles={filteredVehicles} />
            </div>
          </div>
        )}
      </div>
  )
}

export default App
