import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { VehiclePosition } from '../../services/hslApi'
import styles from './MapView.module.scss'

const VEHICLE_ICONS: Record<string, { color: string; symbol: string }> = {
  bus: { color: '#007ac9', symbol: '🚌' },
  tram: { color: '#00985f', symbol: '🚋' },
  metro: { color: '#ff6319', symbol: '🚇' },
  train: { color: '#8c4799', symbol: '🚆' },
  ferry: { color: '#666666', symbol: '⛴' },
  default: { color: '#94a3b8', symbol: '🚦' }
}

const createVehicleIcon = (vehicleType: string) => {
  const { color, symbol } = VEHICLE_ICONS[vehicleType] || VEHICLE_ICONS.default
  
  return L.divIcon({
    className: 'vehicle-marker',
    html: `
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="12" fill="${color}" class="marker-icon"/>
        <text 
          x="20" 
          y="20" 
          class="marker-text"
          dominant-baseline="middle"
          text-anchor="middle"
          font-size="16"
        >${symbol}</text>
      </svg>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })
}

export default function MapView({ vehicles }: { vehicles: VehiclePosition[] }) {
  const mapRef = useRef<L.Map | null>(null)
  const markerLayerRef = useRef(L.layerGroup())

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        preferCanvas: true,
        zoomControl: false
      }).setView([60.1699, 24.9384], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        updateWhenIdle: true,
        updateInterval: 200,
        keepBuffer: 5,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapRef.current)

      L.control.zoom({ position: 'topright' }).addTo(mapRef.current)
    }

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    markerLayerRef.current.clearLayers()

    vehicles.forEach(vehicle => {
      if (vehicle.lat && vehicle.long) {
        const icon = createVehicleIcon(vehicle.vehicleType)
        
        L.marker([vehicle.lat, vehicle.long], { icon })
          .bindTooltip(`
            <div class="vehicle-tooltip">
              <strong>${vehicle.route}</strong>
              <span>${vehicle.vehicleType}</span>
              <span>${vehicle.speed?.toFixed(1) ?? 'N/A'} m/s</span>
            </div>
          `, {
            direction: 'top',
            offset: [0, -10],
            permanent: false,
            sticky: true
          })
          .bindPopup(`
            <div class="vehicle-popup">
              <strong>Route ${vehicle.route}</strong>
              <p>Type: ${vehicle.vehicleType}</p>
              <p>Speed: ${vehicle.speed?.toFixed(1) ?? 'N/A'} m/s</p>
            </div>
          `)
          .addTo(markerLayerRef.current)
      }
    })

    markerLayerRef.current.addTo(mapRef.current)
  }, [vehicles])

  return <div id="map" className={styles.mapContainer} />
}