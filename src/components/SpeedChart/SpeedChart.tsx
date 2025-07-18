import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { VehiclePosition } from '../../services/hslApi';
import styles from './SpeedChart.module.scss';

const VEHICLE_COLORS: Record<string, string> = {
  bus: '#007ac9',
  tram: '#00985f',
  metro: '#ff6319',
  train: '#8c4799',
  default: '#666666',
};

const processData = (rawData: Array<{ vehicleType: string; speed: number }>) => {
  const averages: Record<string, { count: number; total: number }> = {};

  rawData.forEach(({ vehicleType, speed }) => {
    if (!averages[vehicleType]) {
      averages[vehicleType] = { count: 0, total: 0 };
    }
    averages[vehicleType].count++;
    averages[vehicleType].total += speed;
  });

  return Object.entries(averages).map(([type, { count, total }]) => ({
    vehicleType: type,
    speed: total / count,
  }));
};

type ChartData = {
  vehicleType: string;
  speed: number;
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload?.[0]?.payload) {
    const data = payload[0].payload as ChartData;
    return (
      <div className={styles.customTooltip}>
        <p>{data.vehicleType}</p>
        <p>{(data.speed || 0).toFixed(1)} m/s</p>
      </div>
    );
  }
  return null;
};

export default function SpeedChart({ vehicles }: { vehicles: VehiclePosition[] }) {
  const chartData = processData(
    vehicles.map((vehicle) => ({
      vehicleType: vehicle.vehicleType,
      speed: vehicle.speed || 0,
    })),
  );

  return (
    <div className={styles.chartContainer}>
      <h3>Average Speed by Vehicle Type</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
          <Tooltip content={<CustomTooltip />} />
          <XAxis
            dataKey="vehicleType"
            style={{ textTransform: 'capitalize' }}
            tick={{ fill: '#fff', fontSize: 14 }}
            label={{
              value: 'Vehicle Type',
              fill: '#fff',
              fontSize: 14,
              dy: 30,
            }}
          />
          <YAxis
            tick={{ fill: '#fff', fontSize: 14 }}
            label={{
              value: 'Average Speed (m/s)',
              angle: -90,
              position: 'left',
              fill: '#fff',
              fontSize: 14,
              dx: 10,
            }}
          />
          <Bar dataKey="speed" isAnimationActive={false}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  VEHICLE_COLORS[entry.vehicleType as keyof typeof VEHICLE_COLORS] ||
                  VEHICLE_COLORS.default
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
