import { useState } from 'react'
import styles from './TopHeader.module.css'

export default function TopHeader() {
  const [search, setSearch] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className={styles.header}>
      {/* Barra de búsqueda global */}
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar PyME, sector, municipio…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Acciones derechas */}
      <div className={styles.actions}>
        {/* Centro de notificaciones */}
        <div className={styles.notifWrapper}>
          <button
            className={styles.iconBtn}
            onClick={() => setNotifOpen(v => !v)}
            aria-label="Notificaciones"
          >
            <span>🔔</span>
            <span className={styles.badge}>2</span>
          </button>
          {notifOpen && (
            <div className={styles.notifDropdown}>
              <p className={styles.notifTitle}>Notificaciones</p>
              <div className={styles.notifItem}>
                <span className={styles.notifDot} />
                Análisis de Tortillería Jiménez listo
              </div>
              <div className={styles.notifItem}>
                <span className={styles.notifDot} />
                Nuevo reporte de viabilidad disponible
              </div>
            </div>
          )}
        </div>

        {/* Avatar de perfil */}
        <button className={styles.avatar} aria-label="Perfil">
          IN
        </button>
      </div>
    </header>
  )
}
