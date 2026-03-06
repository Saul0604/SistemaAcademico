import { useState, useEffect } from 'react';
import './AlumnosList.css';
import { obtenerAlumnos, crearAlumno, eliminarAlumno } from '../services/alumnoService';

function AlumnosList() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaMatricula, setNuevaMatricula] = useState('');
  const [guardando, setGuardando] = useState(false);

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
      const response = await crearAlumno(nuevoNombre, nuevaMatricula);
      
      // Agregar el nuevo alumno a la lista
      setAlumnos([...alumnos, response.data]);
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
                <div className="alumno-matricula"><strong>ID:</strong> {alumno.matricula}</div>
              </div>
              <button 
                className="btn-eliminar" 
                onClick={() => eliminarAlumnoHandler(alumno.id)}
                title="Eliminar alumno"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AlumnosList;
