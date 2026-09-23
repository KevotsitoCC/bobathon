import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopHeader from './TopHeader.jsx'
import styles from './AppShell.module.css'

export default function AppShell() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <TopHeader />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
