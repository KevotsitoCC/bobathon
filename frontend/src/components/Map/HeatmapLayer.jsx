import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet.heat'

/**
 * HeatmapLayer — Capa de calor sobre un mapa Leaflet existente.
 *
 * @param {{
 *   map:    L.Map,
 *   points: Array<{ lat: number, lng: number, intensity: number }>
 * }} props
 */
export default function HeatmapLayer({ map, points = [] }) {
  const heatRef = useRef(null)

  useEffect(() => {
    if (!map || points.length === 0) return

    // Convierte al formato [lat, lng, intensity] que espera leaflet.heat
    const data = points.map(p => [p.lat, p.lng, p.intensity])

    if (heatRef.current) {
      heatRef.current.setLatLngs(data)
    } else {
      heatRef.current = L.heatLayer(data, {
        radius:    25,
        blur:      20,
        maxZoom:   17,
        gradient: {
          0.0: '#2f3559',
          0.4: '#7272b0',
          0.7: '#b7a8bd',
          1.0: '#dcd5e5',
        },
      }).addTo(map)
    }

    return () => {
      if (heatRef.current) {
        heatRef.current.remove()
        heatRef.current = null
      }
    }
  }, [map, points])

  return null
}
