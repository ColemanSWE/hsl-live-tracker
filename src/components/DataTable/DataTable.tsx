import { memo } from 'react';
import { VehiclePosition } from '../../services/hslApi';
import SearchFilters from '../SearchFilters/SearchFilters';
import Pagination from '../Pagination/Pagination';
import styles from './DataTable.module.scss';

interface DataTableProps {
  vehicles: VehiclePosition[];
  filters: {
    routeFilter: string;
    vehicleType: string;
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  onFilterChange: (filters: { routeFilter: string; vehicleType: string }) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

function DataTable({
  vehicles,
  filters,
  pagination,
  onFilterChange,
  onPageChange,
  onItemsPerPageChange,
}: DataTableProps) {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <SearchFilters filters={filters} onFilterChange={onFilterChange} />
      </div>

      <div className={styles.tableScrollContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Route</th>
              <th>Direction</th>
              <th>Type</th>
              <th>Speed (m/s)</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.route}</td>
                <td>{vehicle.direction}</td>
                <td className={styles['vehicle-type']}>{vehicle.vehicleType}</td>
                <td>{vehicle.speed?.toFixed(1) ?? 'N/A'}</td>
                <td>{new Date(vehicle.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        itemsPerPage={pagination.itemsPerPage}
        totalItems={pagination.totalItems}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
}

export default memo(DataTable);
