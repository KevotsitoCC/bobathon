import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AgentChat from '../components/Chat/AgentChat.jsx'
import { postOnboarding } from '../services/api.js'
import styles from './Onboarding.module.css'

export default function Onboarding() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('idle') // idle | loading | error

  const handleComplete = async (respuestas) => {
    setStatus('loading')
    try {
      const { session_id } = await postOnboarding({ respuestas })
      navigate(`/results/${session_id}`)
    } catch (err) {
      console.error('Error en onboarding:', err)
      setStatus('error')
    }
  }

  return (
    <div className={styles.page}>
      {/* Encabezado de la sección */}
      <div className={styles.header}>
        <h1 className={styles.title}>Análisis de Viabilidad</h1>
        <p className={styles.sub}>
          Responde las preguntas del agente para recibir tu score personalizado
        </p>
      </div>

      {/* Grid: chat + info */}
      <div className={styles.grid}>
        {/* Chat principal */}
        <div className={styles.chatCol}>
          {status === 'loading' ? (
            <div className={`card ${styles.loadingCard}`}>
              <span className={styles.spinner} />
              <p>Procesando tu análisis con IA…</p>
            </div>
          ) : status === 'error' ? (
            <div className={`card ${styles.errorCard}`}>
              <p className="text-danger">Ocurrió un error al enviar tus respuestas.</p>
              <button className="btn btn-secondary" onClick={() => setStatus('idle')}>
                Reintentar
              </button>
            </div>
          ) : (
            <AgentChat onComplete={handleComplete} />
          )}
        </div>

        {/* Panel de información lateral */}
        <aside className={styles.infoCol}>
          <div className="card">
            <p className={styles.infoTitle}>¿Cómo funciona?</p>
            <ol className={styles.steps}>
              <li>Responde 5 preguntas sobre tu PyME</li>
              <li>Nuestro agente analiza tu contexto</li>
              <li>Recibe un score de viabilidad 0-100</li>
              <li>Visualiza el mapa de calor de tu zona</li>
              <li>Conéctate con inversionistas</li>
            </ol>
          </div>

          <div className="card" style={{ marginTop: '1rem' }}>
            <p className={styles.infoTitle}>Datos que evaluamos</p>
            <ul className={styles.tags}>
              {['Ubicación', 'Sector', 'Antigüedad', 'Empleados', 'Capital', 'Competencia', 'Demanda local'].map(t => (
                <li key={t} className={styles.tag}>{t}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
