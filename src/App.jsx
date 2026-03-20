import { useState } from 'react'
import './styles/App.css'
import LoginPage from './pages/LoginPage'
import AlumnosList from './components/AlumnosList'
import MateriasList from './components/MateriasList'
import ReportesDashboard from './components/Reportesdashboard'
import CalificacionesList from './components/CalificacionesList'

function App() {
  const [user, setUser] = useState(null)
  const [seccionActiva, setSeccionActiva] = useState('alumnos')

  // Si no hay sesión, mostrar login
  if (!user) {
    return <LoginPage onLogin={(userData) => setUser(userData)} />
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div className="header-user">
            <span>👤 {user.name || user.email}</span>
            <button className="logout-btn" onClick={() => setUser(null)}>
              Cerrar sesión
            </button>
          </div>
        </div>
        <h1>Sistema Académico</h1>
        <p className="subtitle">Gestión de Alumnos, Materias y Calificaciones</p>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          <h3>☰ Menú</h3>
          <ul className="sidebar-menu">
            <li>
              <button
                className={seccionActiva === 'alumnos' ? 'active' : ''}
                onClick={() => setSeccionActiva('alumnos')}
              >
                Alumnos
              </button>
            </li>
            <li>
              <button
                className={seccionActiva === 'materias' ? 'active' : ''}
                onClick={() => setSeccionActiva('materias')}
              >
                Materias
              </button>
            </li>
            <li>
              <button
                className={seccionActiva === 'calificaciones' ? 'active' : ''}
                onClick={() => setSeccionActiva('calificaciones')}
              >
                Calificaciones
              </button>
            </li>
            <li>
              <button
                className={seccionActiva === 'reportes' ? 'active' : ''}
                onClick={() => setSeccionActiva('reportes')}
              >
                Reportes
              </button>
            </li>
          </ul>
        </aside>
        {/* --------------------------------------------------- */}

        <div className="content-area">
          {seccionActiva === 'alumnos' && <AlumnosList />}
          {seccionActiva === 'materias' && <MateriasList />}
          {seccionActiva === 'calificaciones' && <CalificacionesList />}
          {seccionActiva === 'reportes' && <ReportesDashboard />}
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2026 Sistema Académico Simple | Equipo de Desarrollo</p>
      </footer>
    </div>
  )
}

export default App