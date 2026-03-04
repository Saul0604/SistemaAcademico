import { useState } from 'react'
import './styles/App.css'
import AlumnosList from './components/AlumnosList'

function App() {
  const [seccionActiva, setSeccionActiva] = useState('alumnos')

  return (
    <div className="app">
      <header className="header">
        <h1>🎓 Sistema Académico</h1>
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
                👤 Alumnos
              </button>
            </li>
            <li>
              <button 
                className={seccionActiva === 'materias' ? 'active' : ''}
                onClick={() => setSeccionActiva('materias')}
              >
                📚 Materias
              </button>
            </li>
            <li>
              <button 
                className={seccionActiva === 'calificaciones' ? 'active' : ''}
                onClick={() => setSeccionActiva('calificaciones')}
              >
                📊 Calificaciones
              </button>
            </li>
            <li>
              <button 
                className={seccionActiva === 'reportes' ? 'active' : ''}
                onClick={() => setSeccionActiva('reportes')}
              >
                📈 Reportes
              </button>
            </li>
          </ul>
        </aside>

        <div className="content-area">
          {seccionActiva === 'alumnos' && <AlumnosList />}
          {seccionActiva === 'materias' && <div className="alumnos-container"><p className="message">📚 Sección de Materias (En desarrollo)</p></div>}
          {seccionActiva === 'calificaciones' && <div className="alumnos-container"><p className="message">📊 Sección de Calificaciones (En desarrollo)</p></div>}
          {seccionActiva === 'reportes' && <div className="alumnos-container"><p className="message">📈 Sección de Reportes (En desarrollo)</p></div>}
        </div>
      </main>
      <footer className="app-footer">
        <p>© 2026 Sistema Académico Simple | Equipo de Desarrollo</p>
      </footer>
    </div>
  )
}

export default App
