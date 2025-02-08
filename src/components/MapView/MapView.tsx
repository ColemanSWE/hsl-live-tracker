import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { VehiclePosition } from '../../services/hslApi'

export default function MapView({ vehicles }: { vehicles: VehiclePosition[] }) {
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef(L.layerGroup());

  useEffect(() => {
    // Initialize map once
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([60.1699, 24.9384], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        updateWhenIdle: true,
        updateInterval: 200,
        keepBuffer: 5
      }).addTo(mapRef.current);
    }

    return () => {
      // Only clean up on component unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Update markers when vehicles change
    if (!mapRef.current) return;

    markerLayerRef.current.clearLayers();

    vehicles.forEach(vehicle => {
      if (vehicle.lat && vehicle.long) {
        L.marker([vehicle.lat, vehicle.long])
          .bindPopup(`Route ${vehicle.route}<br>Speed: ${vehicle.speed?.toFixed(1) ?? 'N/A'} m/s`)
          .addTo(markerLayerRef.current);
      }
    });

    markerLayerRef.current.addTo(mapRef.current);

    // Correct bounds calculation
    const markers = markerLayerRef.current.getLayers() as L.Marker[];
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vehicles]);

  return <div id="map" style={{ height: '600px', width: '100%' }} />
}