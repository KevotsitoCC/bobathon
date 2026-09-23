import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MapView from '../components/Map/MapView.jsx'
import HeatmapLayer from '../components/Map/HeatmapLayer.jsx'
import ScoreCard from '../components/ScoreCard/ScoreCard.jsx'
import { getResults, getPymes, postInvest } from '../services/api.js'
import styles from './Results.module.css'

// Datos de demo usados mientras el backend no está disponible
const DEMO_DATA = {
  score: 74,
  riesgos: [
    'Alta competencia en el sector en un radio de 500m',
    'Zona con flujo peatonal medio-bajo en horario nocturno',
  ],
  oportunidades: [
    'Creciente demanda de delivery en la colonia',
    'Bajo índice de negocios del mismo rubro en la zona norte',
    'Proximidad a centros de trabajo con poder adquisitivo medio-alto',
  ],
  heatmap: [
    { lat: 32.525, lng: -117.032, intensity: 0.9 },
    { lat: 32.518, lng: -117.041, intensity: 0.7 },
    { lat: 32.510, lng: -117.028, intensity: 0.5 },
    { lat: 32.530, lng: -117.050, intensity: 0.4 },
  ],
}

const DEMO_PYMES = [
  { id: 1, nombre: 'Tortillería Jiménez', lat: 32.520, lng: -117.038, sector: 'Alimentos', score: 81 },
  { id: 2, nombre: 'TechBaja Solutions',  lat: 32.515, lng: -117.043, sector: 'Tecnología', score: 66 },
  { id: 3, nombre: 'Ferretería del Norte',lat: 32.527, lng: -117.030, sector: 'Comercio',  score: 57 },
]

export default function Results() {
  const { session_id } = useParams()
  const navigate       = useNavigate()
  const mapRef         = useRef(null)

  const [data,    setData]    = useState(null)
  const [pymes,   setPymes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [invModal, setInvModal] = useState(false)
  const [selectedPyme, setSelectedPyme] = useState(null)

  // Callback para recibir instancia del mapa de MapView
  const handleMapReady = (map) => { mapRef.current = map }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [results, pymesData] = await Promise.all([
          getResults(session_id),
          getPymes(),
        ])
        setData(results)
        setPymes(pymesData)
      } catch {
        // En demo / sin backend, usar datos mock
        setData(DEMO_DATA)
        setPymes(DEMO_PYMES)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [session_id])

  const handleInvest = (pyme) => {
    setSelectedPyme(pyme)
    setInvModal(true)
  }

  const confirmInvest = async (monto) => {
    try {
      await postInvest({ pyme_id: selectedPyme.id, monto })
      alert(`Inversión de ${monto} MXN en ${selectedPyme.nombre} registrada.`)
    } catch {
      alert('Error al registrar inversión (demo mode).')
    } finally {
      setInvModal(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <span className={styles.spinner} />
        <p>Cargando resultados…</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Encabezado */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Resultados de Viabilidad</h1>
          <p className={styles.sub}>
            Sesión: <code className={styles.sessionId}>{session_id}</code>
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/onboarding')}>
          ← Nuevo análisis
        </button>
      </div>

      {/* Contenido principal */}
      <div className={styles.grid}>
        {/* Columna izquierda: Score + Mapa */}
        <div className={styles.leftCol}>
          <ScoreCard
            score={data?.score ?? 0}
            riesgos={data?.riesgos ?? []}
            oportunidades={data?.oportunidades ?? []}
          />

          <div className={styles.mapSection}>
            <p className={styles.sectionLabel}>Mapa de Calor — Tijuana</p>
            <MapView pymes={pymes} onMapReady={handleMapReady} />
            {mapRef.current && data?.heatmap?.length > 0 && (
              <HeatmapLayer map={mapRef.current} points={data.heatmap} />
            )}
          </div>
        </div>

        {/* Columna derecha: PyMEs similares */}
        <div className={styles.rightCol}>
          <p className={styles.sectionLabel}>PyMEs en la zona</p>
          {pymes.map(pyme => (
            <div key={pyme.id} className={`card ${styles.pymeCard}`}>
              <div className={styles.pymeHeader}>
                <div>
                  <p className={styles.pymeName}>{pyme.nombre}</p>
                  <p className={styles.pymeSector}>{pyme.sector}</p>
                </div>
                <span className={styles.pymeScore}>{pyme.score}</span>
              </div>
              <button
                className={`btn btn-primary ${styles.investBtn}`}
                onClick={() => handleInvest(pyme)}
              >
                Invertir
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de inversión */}
      {invModal && selectedPyme && (
        <InvestModal
          pyme={selectedPyme}
          onConfirm={confirmInvest}
          onClose={() => setInvModal(false)}
        />
      )}
    </div>
  )
}

/* ── Modal de inversión ─────────────────────────────────── */
function InvestModal({ pyme, onConfirm, onClose }) {
  const [monto, setMonto] = useState('')
  return (
    <div className={styles.overlay}>
      <div className={`card ${styles.modal}`}>
        <p className={styles.modalTitle}>Invertir en {pyme.nombre}</p>
        <input
          className={styles.montoInput}
          type="number"
          placeholder="Monto en MXN"
          value={monto}
          onChange={e => setMonto(e.target.value)}
          min={1000}
        />
        <div className={styles.modalActions}>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button
            className="btn btn-primary"
            disabled={!monto || Number(monto) <= 0}
            onClick={() => onConfirm(Number(monto))}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
