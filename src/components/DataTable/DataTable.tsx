import { VehiclePosition } from "../../services/hslApi";
import styles from './DataTable.module.scss'

export default function DataTable({ vehicles }: { vehicles: VehiclePosition[] }) {
    return (
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
          {vehicles.map(vehicle => (
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
    )
  }