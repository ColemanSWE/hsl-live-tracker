import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { VehiclePosition } from '../../services/hslApi'
import styles from './SpeedChart.module.scss'

const VEHICLE_COLORS: Record<string, string> = {
  bus: '#007ac9',
  tram: '#00985f',
  metro: '#ff6319',
  train: '#8c4799',
  default: '#666666'
}

export default function SpeedChart({ vehicles }: { vehicles: VehiclePosition[] }) {
  const chartData = useMemo(() => {
    const typeMap = new Map<string, { total: number; count: number }>()
    
    vehicles.forEach(vehicle => {
      if (vehicle.speed === undefined) return
      const current = typeMap.get(vehicle.vehicleType) || { total: 0, count: 0 }
      typeMap.set(vehicle.vehicleType, {
        total: current.total + (vehicle.speed || 0),
        count: current.count + 1
      })
    })

    return Array.from(typeMap.entries()).map(([vehicleType, { total, count }]) => ({
      vehicleType,
      averageSpeed: count > 0 ? total / count : 0
    }))
  }, [vehicles])

  return (
    <div className={styles.chartContainer}>
      <h3>Average Speed by Vehicle Type</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <XAxis 
            dataKey="vehicleType" 
            tick={{ fill: '#ffffff', fontSize: 14 }}
            axisLine={{ stroke: '#666' }}
            label={{ 
              value: 'Vehicle Type', 
              position: 'bottom', 
              fill: '#ffffff',
              fontSize: 14
            }}
          />
          <YAxis
            unit="m/s"
            tick={{ fill: '#ffffff', fontSize: 14 }}
            axisLine={{ stroke: '#666' }}
            tickFormatter={(value) => value.toFixed(1)}
            label={{
              value: 'Average Speed (m/s)',
              angle: -90,
              fill: '#ffffff',
              fontSize: 14
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className={styles.tooltip}>
                    <p>{payload[0].payload.vehicleType}</p>
                    <p>{Number(payload[0].value)?.toFixed(1)} m/s</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey="averageSpeed"
            name="Average Speed"
            isAnimationActive={false}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.vehicleType}
                fill={VEHICLE_COLORS[entry.vehicleType] || VEHICLE_COLORS.default}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 