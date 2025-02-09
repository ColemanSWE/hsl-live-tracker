import { useState, useEffect, useMemo } from 'react'
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
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

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

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredVehicles.slice(start, start + itemsPerPage)
  }, [filteredVehicles, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)

  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize)
    setCurrentPage(1)
  }

  const getVisiblePages = (current: number, total: number) => {
    const visiblePages = 3;
    let start = Math.max(1, current - 1);
    const end = Math.min(total, start + visiblePages - 1);

    if (end - start < visiblePages - 1) {
      start = Math.max(1, end - visiblePages + 1);
    }

    return { 
      pages: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      start, 
      end 
    };
  };

  return (
    <div className={styles.appContainer}>
      <h1>HSL Real-Time Tracker</h1>
      
      <div className={styles.mainContent}>
        <div className={styles.mapChartRow}>
          <div className={styles.mapContainer} data-testid="map-container">
            <MapView vehicles={filteredVehicles} />
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.chartPlaceholder}>Chart Component</div>
          </div>
        </div>

        <SearchFilters filters={filters} onFilterChange={setFilters} />

        <div className={styles.tableContainer}>
          <DataTable vehicles={paginatedVehicles} />
          
          <div className={styles.paginationContainer}>
            <div className={styles.paginationInfo}>
              Showing {paginatedVehicles.length ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {(currentPage - 1) * itemsPerPage + paginatedVehicles.length} of {filteredVehicles.length}
            </div>
            
            <div className={styles.paginationControls}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>

              {(() => {
                const { pages, start, end } = getVisiblePages(currentPage, totalPages);
                return (
                  <>
                    {!pages.includes(1) && (
                      <button
                        onClick={() => setCurrentPage(1)}
                        className={styles.pageNumber}
                      >
                        1
                      </button>
                    )}

                    {start > 2 && <span className={styles.paginationEllipsis}>...</span>}

                    {pages.map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ''}`}
                      >
                        {page}
                      </button>
                    ))}

                    {end < totalPages - 1 && <span className={styles.paginationEllipsis}>...</span>}

                    {!pages.includes(totalPages) && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={styles.pageNumber}
                      >
                        {totalPages}
                      </button>
                    )}
                  </>
                )
              })()}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
            
            <select 
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className={styles.pageSizeSelect}
            >
              {[10, 20, 50].map(size => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {loading && <Loader />}
    </div>
  )
}

export default App
