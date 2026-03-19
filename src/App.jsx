import { useState } from 'react'
import './App.css' // Importación ajustada a tu estructura
import AlumnosList from './components/AlumnosList'
import MateriasList from './components/MateriasList'
import CalificacionesList from './components/CalificacionesList'

function App() {
  const [seccionActiva, setSeccionActiva] = useState('alumnos')

  return (
    <div className="app">
      <header className="header">
        <h1>Sistema Académico</h1>
        <p className="subtitle">Gestión de Alumnos, Materias y Calificaciones</p>
      </header>
      <main className="main-content">
        
        {/* --- SIDEBAR CON ESTILOS INYECTADOS DIRECTAMENTE --- */}
        <aside className="sidebar" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          
          height: '600px', // <-- ¡AQUÍ CONTROLAS EL LARGO! Cambia '600px' a tu gusto.
          position: 'sticky', // Esto hace que te siga al hacer scroll
          top: '2rem'
        }}>
          <div className="sidebar-nav">
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
          </div>

          {/* CONTENEDOR DEL LOGO (Fondo de la barra) */}
          <div style={{
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '20px',
            borderTop: '1px solid #f0f0f0'
          }}>
            <img 
              src="/Logo_sas.png"
              alt="Logo del Sistema Académico" 
              style={{
                width: '140px', // DOMAMOS EL LOGO GIGANTE AQUÍ
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
        </aside>
        {/* --------------------------------------------------- */}

        <div className="content-area">
          {seccionActiva === 'alumnos' && <AlumnosList />}
          {seccionActiva === 'materias' && <MateriasList />}
          {seccionActiva === 'calificaciones' && <CalificacionesList />}
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