import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const NAV_LINKS = [
  { to: '/',           icon: '⬡', label: 'Inicio' },
  { to: '/onboarding', icon: '◎', label: 'Analizar PyME' },
]

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* Logo / Brand */}
      <div className={styles.brand}>
        <span className={styles.brandIcon}>R</span>
        <span className={styles.brandName}>RAVENCODE</span>
      </div>

      {/* Navegación principal */}
      <nav className={styles.nav}>
        {NAV_LINKS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer del sidebar */}
      <div className={styles.sidebarFooter}>
        <span className={styles.version}>v0.1.0 · Hackathon</span>
      </div>
    </aside>
  )
}
