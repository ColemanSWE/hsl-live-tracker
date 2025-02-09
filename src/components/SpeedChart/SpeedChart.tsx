import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Text, Cell } from 'recharts'
import { VehiclePosition } from '../../services/hslApi'
import styles from './SpeedChart.module.scss'

const VEHICLE_COLORS: Record<string, string> = {
  bus: '#007ac9',
  tram: '#00985f',
  metro: '#ff6319',
  train: '#8c4799',
  default: '#666666'
}

// Add data processing function
const processData = (rawData: Array<{ vehicleType: string; speed: number }>) => {
  const averages: Record<string, { count: number; total: number }> = {};

  // Calculate averages
  rawData.forEach(({ vehicleType, speed }) => {
    if (!averages[vehicleType]) {
      averages[vehicleType] = { count: 0, total: 0 };
    }
    averages[vehicleType].count++;
    averages[vehicleType].total += speed;
  });

  // Convert to chart format
  return Object.entries(averages).map(([type, { count, total }]) => ({
    vehicleType: type,
    speed: total / count
  }));
};

export default function SpeedChart({ vehicles }: { vehicles: VehiclePosition[] }) {
  const chartData = processData(vehicles.map(vehicle => ({
    vehicleType: vehicle.vehicleType,
    speed: vehicle.speed || 0
  })));

  return (
    <div className={styles.chartContainer}>
      <h3>Average Speed by Vehicle Type</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
        >
          <XAxis 
            dataKey="vehicleType"
            style={{ textTransform: 'capitalize' }}
            tick={{ fill: '#fff', fontSize: 14 }}
            label={
              <Text
                x={400}
                y={325}
                textAnchor="middle"
                style={{ textTransform: 'capitalize' }}
                fill="#fff"
                fontSize={14}
                dy={30}
              >
                Vehicle Type
              </Text>
            }
          />
          <YAxis
            tick={{ fill: '#fff', fontSize: 14 }}
            label={{
              value: 'Average Speed (m/s)',
              angle: -90,
              position: 'left',
              fill: '#fff',
              fontSize: 14,
              dx: -35
            }}
          />
          <Bar dataKey="speed" isAnimationActive={false}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={VEHICLE_COLORS[entry.vehicleType as keyof typeof VEHICLE_COLORS] || VEHICLE_COLORS.default}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 