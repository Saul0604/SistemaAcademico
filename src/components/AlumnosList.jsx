import { useState, useEffect } from 'react';
import './AlumnosList.css';
import { obtenerAlumnos, crearAlumno, eliminarAlumno, actualizarAlumno } from '../services/alumnoService';

function AlumnosList() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaMatricula, setNuevaMatricula] = useState('');
  const [guardando, setGuardando] = useState(false);
  
  // Estados para edición
  const [mostrarModal, setMostrarModal] = useState(false);
  const [alumnoEditando, setAlumnoEditando] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [matriculaEditada, setMatriculaEditada] = useState('');
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  // Cargar alumnos al montar el componente
  useEffect(() => {
    cargarAlumnos();
  }, []);

  const cargarAlumnos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerAlumnos();
      setAlumnos(data);
    } catch (err) {
      setError('No pudimos cargar los alumnos. Verifica que el backend esté ejecutándose.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const agregarAlumno = async () => {
    if (!nuevoNombre.trim() || !nuevaMatricula.trim()) {
      alert('Nombre y matrícula son obligatorios.');
      return;
    }

    try {
      setGuardando(true);
      const nuevoAlumno = await crearAlumno(nuevoNombre, nuevaMatricula);
      
      // Agregar el nuevo alumno a la lista
      setAlumnos([...alumnos, nuevoAlumno]);
      setNuevoNombre('');
      setNuevaMatricula('');
    } catch (err) {
      alert('Error al agregar alumno: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarAlumnoHandler = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este alumno?')) {
      return;
    }

    try {
      await eliminarAlumno(id);
      setAlumnos(alumnos.filter(alumno => alumno.id !== id));
    } catch (err) {
      alert('Error al eliminar alumno: ' + err.message);
    }
  };

  const abrirModalEdicion = (id) => {
    const alumno = alumnos.find(a => a.id === id);
    if (alumno) {
      setAlumnoEditando(alumno);
      setNombreEditado(alumno.nombre);
      setMatriculaEditada(alumno.matricula);
      setMostrarModal(true);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setAlumnoEditando(null);
    setNombreEditado('');
    setMatriculaEditada('');
  };

  const guardarEdicion = async () => {
    if (!nombreEditado.trim() || !matriculaEditada.trim()) {
      alert('Nombre y matrícula son obligatorios.');
      return;
    }

    try {
      setGuardandoEdicion(true);
      await actualizarAlumno(alumnoEditando.id, nombreEditado, matriculaEditada);
      
      // Actualizar la lista localmente
      setAlumnos(alumnos.map(alumno =>
        alumno.id === alumnoEditando.id
          ? { ...alumno, nombre: nombreEditado, matricula: matriculaEditada }
          : alumno
      ));
      
      cerrarModal();
    } catch (err) {
      alert('Error al editar alumno: ' + err.message);
    } finally {
      setGuardandoEdicion(false);
    }
  };

  if (loading) return <div className="alumnos-container"><p className="message loading-message">⏳ Cargando alumnos...</p></div>;
  if (error) return <div className="alumnos-container"><p className="message error-message">❌ {error}</p></div>;

  return (
    <div className="alumnos-container">
      <h2>Lista de Alumnos</h2>
      
      <div className="form-container">
        <h3>Agregar Nuevo Alumno</h3>
        <div className="input-group">
          <input
            type="text"
            placeholder="Nombre del alumno"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            disabled={guardando}
          />
          <input
            type="text"
            placeholder="Matrícula"
            value={nuevaMatricula}
            onChange={(e) => setNuevaMatricula(e.target.value)}
            disabled={guardando}
          />
          <button className="btn-agregar" onClick={agregarAlumno} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Agregar'}
          </button>
          
        </div>
      </div>

      {alumnos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-text">No hay alumnos registrados aún.</p>
        </div>
      ) : (
        <ul className="alumnos-list">
          {alumnos.map((alumno) => (
            <li key={alumno.id} className="alumno-item">
              <div className="alumno-info">
                <div className="alumno-nombre">{alumno.nombre}</div>
                <div className="alumno-matricula"><strong>Matricula:</strong> {alumno.matricula}</div>
              </div>
              <div className="alumno-acciones">
                <button 
                  className="btn-editar" 
                  onClick={() => abrirModalEdicion(alumno.id)}
                  title="Editar alumno"
                >
                  ✏️
                </button>
                <button 
                  className="btn-eliminar" 
                  onClick={() => eliminarAlumnoHandler(alumno.id)}
                  title="Eliminar alumno"
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
              <h3>Editar Alumno</h3>
              <button className="btn-cerrar" onClick={cerrarModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={nombreEditado}
                  onChange={(e) => setNombreEditado(e.target.value)}
                  disabled={guardandoEdicion}
                />
              </div>
              
              <div className="form-group">
                <label>Matrícula</label>
                <input
                  type="text"
                  value={matriculaEditada}
                  onChange={(e) => setMatriculaEditada(e.target.value)}
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

export default AlumnosList;
