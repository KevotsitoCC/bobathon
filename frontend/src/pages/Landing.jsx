import { useNavigate } from 'react-router-dom'
import styles from './Landing.module.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      {/* Barra de marca mínima */}
      <header className={styles.topBar}>
        <span className={styles.logo}>R</span>
        <span className={styles.brand}>RAVENCODE</span>
      </header>

      {/* Hero */}
      <main className={styles.hero}>
        <div className={styles.agentBadge}>
          <span className={styles.agentDot} />
          Agente activo — RAVENCODE Intelligence
        </div>

        <h1 className={styles.headline}>
          Descubre si tu PyME<br />
          <span className={styles.accent}>tiene el potencial</span><br />
          para crecer en Tijuana
        </h1>

        <p className={styles.sub}>
          Analizamos ubicación, sector y contexto de mercado en tiempo real para
          darte un score de viabilidad accionable, conectando tu negocio con
          inversionistas locales.
        </p>

        {/* CTA principal */}
        <div className={styles.ctaGroup}>
          <button
            className={`btn btn-primary ${styles.ctaMain}`}
            onClick={() => navigate('/onboarding')}
          >
            Analizar mi PyME
          </button>
          <button className={`btn btn-secondary ${styles.ctaSecondary}`}>
            Ver mapa de oportunidades
          </button>
        </div>

        {/* Stats rápidas */}
        <div className={styles.stats}>
          {[
            { value: '340+', label: 'PyMEs analizadas' },
            { value: '78%',  label: 'Tasa de éxito' },
            { value: '$2.4M', label: 'Capital conectado' },
          ].map(({ value, label }) => (
            <div key={label} className={styles.stat}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Categorías principales */}
      <section className={styles.categories}>
        <p className={styles.sectionLabel}>Sectores que evaluamos</p>
        <div className={styles.catGrid}>
          {[
            { icon: '🍽', name: 'Alimentos' },
            { icon: '🏪', name: 'Comercio' },
            { icon: '⚙️', name: 'Manufactura' },
            { icon: '💻', name: 'Tecnología' },
            { icon: '🏥', name: 'Servicios' },
            { icon: '🚛', name: 'Logística' },
          ].map(cat => (
            <div key={cat.name} className={styles.catCard}>
              <span className={styles.catIcon}>{cat.icon}</span>
              <span className={styles.catName}>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
