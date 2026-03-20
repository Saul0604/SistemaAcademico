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
      
      // Recargamos datos para asegurar que vengan con el populate (nombres) del backend
      await cargarDatos(); 
      
      setNuevoAlumnoId('');
      setNuevaMateriaId('');
      setNuevaNota('');
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
      // Extraemos el ID por si el backend mandó el objeto completo (populate)
      setAlumnoIdEditado(calificacion.alumnoId?.id || calificacion.alumnoId);
      setMateriaIdEditado(calificacion.materiaId?.id || calificacion.materiaId);
      setNotaEditada(calificacion.nota || calificacion.calificacion); // Respaldo por nombre de esquema
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
      
      // Recargamos para traer los nombres actualizados
      await cargarDatos();
      cerrarModal();
    } catch (err) {
      alert('Error al editar calificación: ' + err.message);
    } finally {
      setGuardandoEdicion(false);
    }
  };

  // Funciones de ayuda para mostrar nombres en la lista
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
            {alumnos.map(a => <option key={a.id} value={a.id} style={{ color: 'var(--text-color, #030202)' }}>{a.nombre}</option>)}
          </select>

          <select 
            value={nuevaMateriaId} 
            onChange={(e) => setNuevaMateriaId(e.target.value)} 
            disabled={guardando}
            style={{ color: nuevaMateriaId === '' ? '#9ca3af' : 'inherit' }}
          >
            <option value="" disabled hidden>Materia</option>
            {materias.map(m => <option key={m.id} value={m.id} style={{ color: 'var(--text-color, #000000)' }}>{m.nombre}</option>)}
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
        <ul className="alumnos-list">
          {calificaciones.map((cal) => (
            <li key={cal.id} className="alumno-item">
              <div className="alumno-info">
                <div className="alumno-nombre">
                  {obtenerNombreAlumno(cal)} - {obtenerNombreMateria(cal)}
                </div>
                <div className="alumno-matricula">
                  <strong>Nota:</strong> {cal.nota || cal.calificacion}
                </div>
              </div>
              <div className="alumno-acciones">
                <button 
                  className="btn-editar" 
                  onClick={() => abrirModalEdicion(cal.id)}
                  title="Editar calificación"
                >
                  ✏️
                </button>
                <button 
                  className="btn-eliminar" 
                  onClick={() => eliminarCalificacionHandler(cal.id)}
                  title="Eliminar calificación"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de Edición */}
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