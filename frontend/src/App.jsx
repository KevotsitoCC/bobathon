import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/Layout/AppShell.jsx'
import Landing from './pages/Landing.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Results from './pages/Results.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing pública — sin shell */}
        <Route path="/" element={<Landing />} />

        {/* Rutas dentro del shell de aplicación */}
        <Route element={<AppShell />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/results/:session_id" element={<Results />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
