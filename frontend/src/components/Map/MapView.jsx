import { useEffect, useRef } from 'react'
import L from 'leaflet'

// Fix para los iconos por defecto de Leaflet en Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const TIJUANA_CENTER = [32.5149, -117.0382]
const INITIAL_ZOOM   = 13
const TILE_URL       = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

/**
 * MapView — Mapa base de Tijuana con pines de PyMEs
 *
 * @param {{ pymes: Array<{ id, nombre, lat, lng, sector, score }> }} props
 */
export default function MapView({ pymes = [], onMapReady }) {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const markersRef   = useRef([])

  // Inicializar mapa una sola vez
  useEffect(() => {
    if (mapRef.current) return

    mapRef.current = L.map(containerRef.current, {
      center: TIJUANA_CENTER,
      zoom:   INITIAL_ZOOM,
    })

    L.tileLayer(TILE_URL, {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current)

    onMapReady?.(mapRef.current)

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // Actualizar marcadores cuando cambian las PyMEs
  useEffect(() => {
    if (!mapRef.current) return

    // Limpiar marcadores previos
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    pymes.forEach(pyme => {
      const marker = L.marker([pyme.lat, pyme.lng])
        .addTo(mapRef.current)
        .bindPopup(`
          <strong style="color:#2f3559">${pyme.nombre}</strong><br/>
          <span style="color:#7272b0">Sector: ${pyme.sector}</span><br/>
          Score: <strong>${pyme.score ?? 'N/D'}</strong>
        `)
      markersRef.current.push(marker)
    })
  }, [pymes])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '420px', borderRadius: 'var(--radius-md)' }}
    />
  )
}
