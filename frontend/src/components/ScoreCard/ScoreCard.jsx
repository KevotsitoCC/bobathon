import styles from './ScoreCard.module.css'

/**
 * ScoreCard — Tarjeta de resultados de viabilidad
 *
 * @param {{
 *   score:         number,           // 0 – 100
 *   riesgos:       string[],
 *   oportunidades: string[]
 * }} props
 */
export default function ScoreCard({ score = 0, riesgos = [], oportunidades = [] }) {
  const level =
    score >= 70 ? { label: 'Alta viabilidad',  color: 'success' } :
    score >= 40 ? { label: 'Viabilidad media', color: 'warning' } :
                  { label: 'Baja viabilidad',  color: 'danger'  }

  return (
    <div className={styles.card}>
      {/* Score circular */}
      <div className={styles.scoreSection}>
        <div className={`${styles.scoreRing} ${styles[level.color]}`}>
          <span className={styles.scoreValue}>{score}</span>
          <span className={styles.scoreLabel}>/ 100</span>
        </div>
        <div>
          <p className={`${styles.levelLabel} text-${level.color}`}>{level.label}</p>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>Score de viabilidad RAVENCODE</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className={styles.progressTrack}>
        <div
          className={`${styles.progressFill} ${styles[level.color]}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Riesgos y Oportunidades */}
      <div className={styles.grid}>
        {/* Riesgos */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>
            <span className="text-danger">▲</span> Riesgos detectados
          </p>
          <ul className={styles.list}>
            {riesgos.length > 0
              ? riesgos.map((r, i) => (
                  <li key={i} className={styles.listItem}>{r}</li>
                ))
              : <li className="text-muted" style={{ fontSize: '0.8rem' }}>Sin riesgos críticos detectados</li>
            }
          </ul>
        </div>

        {/* Oportunidades */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>
            <span className="text-success">◆</span> Oportunidades
          </p>
          <ul className={styles.list}>
            {oportunidades.length > 0
              ? oportunidades.map((o, i) => (
                  <li key={i} className={styles.listItem}>{o}</li>
                ))
              : <li className="text-muted" style={{ fontSize: '0.8rem' }}>Cargando oportunidades…</li>
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
