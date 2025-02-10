import { useState, useEffect, useMemo } from 'react'
import { initRealtimeConnection, VehiclePosition } from './services/hslApi'
import MapView from './components/MapView/MapView'
import DataTable from './components/DataTable/DataTable'
import Loader from './components/Loader/Loader'
import SpeedChart from './components/SpeedChart/SpeedChart'
import { throttle } from 'lodash'
import styles from './App.module.scss'

function App() {
  const [vehicles, setVehicles] = useState<VehiclePosition[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    routeFilter: '',
    vehicleType: 'all'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    const throttledSetVehicles = throttle((vehicle: VehiclePosition) => {
      setVehicles(prev => {
        const existing = prev.find(v => v.id === vehicle.id)
        return existing ? prev.map(v => v.id === vehicle.id ? vehicle : v) : [...prev, vehicle]
      })
      setLoading(false)
    }, 10)

    const cleanup = initRealtimeConnection(throttledSetVehicles)
    
    return () => {
      cleanup()
      throttledSetVehicles.cancel()
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters.routeFilter, filters.vehicleType])

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesRoute = vehicle.route.toLowerCase().includes(filters.routeFilter.toLowerCase())
    const matchesType = filters.vehicleType === 'all' || vehicle.vehicleType === filters.vehicleType
    return matchesRoute && matchesType
  })

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredVehicles.slice(start, start + itemsPerPage)
  }, [filteredVehicles, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)

  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize)
    setCurrentPage(1)
  }

  return (
    <div className={styles.appContainer}>
      <h1>HSL Real-Time Tracker</h1>
      
      <div className={styles.mainContent}>
        <div className={styles.mapChartRow}>
          <div className={styles.mapContainer} data-testid="map-container">
            <MapView vehicles={filteredVehicles} />
          </div>
          <div className={styles.chartContainer}>
            <SpeedChart vehicles={vehicles} />
          </div>
        </div>

        <DataTable
          vehicles={paginatedVehicles}
          filters={filters}
          pagination={{
            currentPage,
            itemsPerPage,
            totalItems: filteredVehicles.length,
            totalPages
          }}
          onFilterChange={setFilters}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
      
      {loading && <Loader />}
    </div>
  )
}

export default App
