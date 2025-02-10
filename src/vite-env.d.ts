/// <reference types="vite/client" />
/// <reference types="leaflet" />

// Leaflet CSS type declaration
declare module 'leaflet/dist/leaflet.css' {
  const css: string;
  export default css;
}

// Remove all other CSS declarations - Vite handles these by default
