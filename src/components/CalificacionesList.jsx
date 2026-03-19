import { useState, useEffect } from 'react';
import './AlumnosList.css'; 
import { obtenerCalificaciones, crearCalificacion, actualizarCalificacion, eliminarCalificacion } from '../services/calificacionesService';
import { obtenerAlumnos } from '../services/alumnoService';
import { obtenerMaterias } from '../services/materiaService';

function CalificacionesList() {
  const [calificaciones, setCalificaciones] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para creación
  const [nuevoAlumnoId, setNuevoAlumnoId] = useState('');
  const [nuevaMateriaId, setNuevaMateriaId] = useState('');
  const [nuevaNota, setNuevaNota] = useState('');
  const [guardando, setGuardando] = useState(false);
  
  // Estados para edición
  const [mostrarModal, setMostrarModal] = useState(false);
  const [calificacionEditando, setCalificacionEditando] = useState(null);
  const [alumnoIdEditado, setAlumnoIdEditado] = useState('');
  const [materiaIdEditado, setMateriaIdEditado] = useState('');
  const [notaEditada, setNotaEditada] = useState('');
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  // NUEVO: Estado para controlar qué alumnos están expandidos (acordeón)
  const [expandidos, setExpandidos] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dataCalificaciones, dataAlumnos, dataMaterias] = await Promise.all([
        obtenerCalificaciones(),
        obtenerAlumnos(),
        obtenerMaterias()
      ]);
      setCalificaciones(dataCalificaciones);
      setAlumnos(dataAlumnos);
      setMaterias(dataMaterias);
    } catch (err) {
      setError('No pudimos cargar los datos. Verifica que el backend esté ejecutándose.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const agregarCalificacion = async () => {
    if (!nuevoAlumnoId || !nuevaMateriaId || nuevaNota === '') {
      alert('Alumno, Materia y Nota son obligatorios.');
      return;
    }

    try {
      setGuardando(true);
      await crearCalificacion(nuevoAlumnoId, nuevaMateriaId, nuevaNota);
      await cargarDatos(); 
      
      setNuevoAlumnoId('');
      setNuevaMateriaId('');
      setNuevaNota('');
      
      // Expandir automáticamente al alumno al que le acabamos de agregar una calificación
      setExpandidos(prev => ({ ...prev, [nuevoAlumnoId]: true }));
    } catch (err) {
      alert('Error al agregar calificación: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarCalificacionHandler = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar esta calificación?')) {
      return;
    }

    try {
      await eliminarCalificacion(id);
      setCalificaciones(calificaciones.filter(cal => cal.id !== id));
    } catch (err) {
      alert('Error al eliminar calificación: ' + err.message);
    }
  };

  const abrirModalEdicion = (id) => {
    const calificacion = calificaciones.find(c => c.id === id);
    if (calificacion) {
      setCalificacionEditando(calificacion);
      setAlumnoIdEditado(calificacion.alumnoId?._id || calificacion.alumnoId?.id || calificacion.alumnoId);
      setMateriaIdEditado(calificacion.materiaId?._id || calificacion.materiaId?.id || calificacion.materiaId);
      setNotaEditada(calificacion.nota || calificacion.calificacion); 
      setMostrarModal(true);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCalificacionEditando(null);
    setAlumnoIdEditado('');
    setMateriaIdEditado('');
    setNotaEditada('');
  };

  const guardarEdicion = async () => {
    if (!alumnoIdEditado || !materiaIdEditado || notaEditada === '') {
      alert('Todos los campos son obligatorios.');
      return;
    }

    try {
      setGuardandoEdicion(true);
      await actualizarCalificacion(calificacionEditando.id, alumnoIdEditado, materiaIdEditado, notaEditada);
      await cargarDatos();
      cerrarModal();
    } catch (err) {
      alert('Error al editar calificación: ' + err.message);
    } finally {
      setGuardandoEdicion(false);
    }
  };

  // Funciones de ayuda
  const obtenerNombreAlumno = (calificacion) => {
    if (calificacion.alumnoId?.nombre) return calificacion.alumnoId.nombre;
    const alumno = alumnos.find(a => a.id === calificacion.alumnoId);
    return alumno ? alumno.nombre : 'Desconocido';
  };

  const obtenerNombreMateria = (calificacion) => {
    if (calificacion.materiaId?.nombre) return calificacion.materiaId.nombre;
    const materia = materias.find(m => m.id === calificacion.materiaId);
    return materia ? materia.nombre : 'Desconocida';
  };

  // NUEVO: Función para alternar el acordeón
  const toggleExpandir = (idAlumno) => {
    setExpandidos(prev => ({
      ...prev,
      [idAlumno]: !prev[idAlumno] // Si está true lo pasa a false, y viceversa
    }));
  };

  // CORRECCIÓN: Agrupar calificaciones extrayendo el ID real como String
  const calificacionesAgrupadas = calificaciones.reduce((grupos, cal) => {
    // Nos aseguramos de sacar el ID real, ya sea que venga dentro del objeto o como string directo
    const idAlumnoStr = String(cal.alumnoId?._id || cal.alumnoId?.id || cal.alumnoId);
    
    if (!grupos[idAlumnoStr]) {
      grupos[idAlumnoStr] = {
        idAlumno: idAlumnoStr,
        nombreAlumno: obtenerNombreAlumno(cal),
        calificaciones: []
      };
    }
    grupos[idAlumnoStr].calificaciones.push(cal);
    return grupos;
  }, {});

  if (loading) return <div className="alumnos-container"><p className="message loading-message">⏳ Cargando calificaciones...</p></div>;
  if (error) return <div className="alumnos-container"><p className="message error-message">❌ {error}</p></div>;

  return (
    <div className="alumnos-container">
      <h2>Lista de Calificaciones</h2>
      
      <div className="form-container">
        <h3>Registrar Calificación</h3>
        <div className="input-group">
          <select 
            value={nuevoAlumnoId} 
            onChange={(e) => setNuevoAlumnoId(e.target.value)} 
            disabled={guardando}
            style={{ color: nuevoAlumnoId === '' ? '#9ca3af' : 'inherit' }}
          >
            <option value="" disabled hidden>Alumno</option>
            {alumnos.map(a => <option key={a.id} value={a.id} style={{ color: 'var(--text-color, #ffffff)' }}>{a.nombre}</option>)}
          </select>

          <select 
            value={nuevaMateriaId} 
            onChange={(e) => setNuevaMateriaId(e.target.value)} 
            disabled={guardando}
            style={{ color: nuevaMateriaId === '' ? '#9ca3af' : 'inherit' }}
          >
            <option value="" disabled hidden>Materia</option>
            {materias.map(m => <option key={m.id} value={m.id} style={{ color: 'var(--text-color, #ffffff)' }}>{m.nombre}</option>)}
          </select>

          <input
            type="number"
            placeholder="Nota"
            min="0"
            max="100"
            value={nuevaNota}
            onChange={(e) => setNuevaNota(e.target.value)}
            disabled={guardando}
            style={{ width: '80px' }}
          />

          <button className="btn-agregar" onClick={agregarCalificacion} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Agregar'}
          </button>
        </div>
      </div>

      {calificaciones.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p className="empty-state-text">No hay calificaciones registradas aún.</p>
        </div>
      ) : (
        <div className="calificaciones-agrupadas-container">
          {Object.values(calificacionesAgrupadas).map((grupo) => (
            <div key={grupo.idAlumno} style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '8px', 
              marginBottom: '15px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden', // Mantiene los bordes redondeados limpios
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              
              {/* CABECERA DEL ACORDEÓN */}
              <div 
                onClick={() => toggleExpandir(grupo.idAlumno)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 20px',
                  backgroundColor: expandidos[grupo.idAlumno] ? '#f8fafc' : '#ffffff',
                  cursor: 'pointer',
                  borderBottom: expandidos[grupo.idAlumno] ? '1px solid #e5e7eb' : 'none',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🧑‍🎓</span>
                  <h3 style={{ margin: 0, color: '#374151', fontSize: '1.1rem' }}>
                    {grupo.nombreAlumno}
                  </h3>
                  <span style={{ 
                    backgroundColor: '#e0e7ff', 
                    color: '#4f46e5', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {grupo.calificaciones.length} materias
                  </span>
                </div>
                <div style={{ color: '#6b7280', fontSize: '1.2rem', userSelect: 'none' }}>
                  {expandidos[grupo.idAlumno] ? '🔼' : '🔽'}
                </div>
              </div>
              
              {/* CUERPO DEL ACORDEÓN (SOLO SE MUESTRA SI ESTÁ EXPANDIDO) */}
              {expandidos[grupo.idAlumno] && (
                <div style={{ padding: '0' }}>
                  {grupo.calificaciones.map((cal, index) => (
                    <div key={cal.id || cal._id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 20px', // Fila mucho más delgada
                      borderBottom: index === grupo.calificaciones.length - 1 ? 'none' : '1px solid #f3f4f6',
                      borderLeft: '4px solid #4f46e5', // Detalle de color
                      backgroundColor: '#ffffff'
                    }}>
                      {/* Materia */}
                      <div style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' }}>
                        <span>📚</span> {obtenerNombreMateria(cal)}
                      </div>
                      
                      {/* Nota */}
                      <div style={{ width: '100px', textAlign: 'center', color: '#374151' }}>
                        <strong>Nota:</strong> <span style={{ 
                          color: (cal.nota || cal.calificacion) < 70 ? '#dc2626' : '#16a34a', // Rojo si es menor a 70, Verde si aprueba
                          fontWeight: 'bold'
                        }}>
                          {cal.nota || cal.calificacion}
                        </span>
                      </div>
                      
                      {/* Botones de acción */}
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          onClick={() => abrirModalEdicion(cal.id || cal._id)}
                          title="Editar calificación"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => eliminarCalificacionHandler(cal.id || cal._id)}
                          title="Eliminar calificación"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Edición (Permanece igual) */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Calificación</h3>
              <button className="btn-cerrar" onClick={cerrarModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Alumno</label>
                <select 
                  value={alumnoIdEditado} 
                  onChange={(e) => setAlumnoIdEditado(e.target.value)} 
                  disabled={guardandoEdicion}
                  style={{ color: alumnoIdEditado === '' ? '#9ca3af' : 'inherit' }}
                >
                  <option value="" disabled hidden>Selecciona un alumno</option>
                  {alumnos.map(a => <option key={a.id} value={a.id} style={{ color: 'var(--text-color, #ffffff)' }}>{a.nombre}</option>)}
                </select>
              </div>
              
              <div className="form-group">
                <label>Materia</label>
                <select 
                  value={materiaIdEditado} 
                  onChange={(e) => setMateriaIdEditado(e.target.value)} 
                  disabled={guardandoEdicion}
                  style={{ color: materiaIdEditado === '' ? '#9ca3af' : 'inherit' }}
                >
                  <option value="" disabled hidden>Selecciona una materia</option>
                  {materias.map(m => <option key={m.id} value={m.id} style={{ color: 'var(--text-color, #ffffff)' }}>{m.nombre}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Nota</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={notaEditada}
                  onChange={(e) => setNotaEditada(e.target.value)}
                  disabled={guardandoEdicion}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarModal} disabled={guardandoEdicion}>
                Cancelar
              </button>
              <button className="btn-guardar" onClick={guardarEdicion} disabled={guardandoEdicion}>
                {guardandoEdicion ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalificacionesList;