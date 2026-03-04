import { useState, useEffect } from 'react';
import './AlumnosList.css';

function AlumnosList() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaMatricula, setNuevaMatricula] = useState('');

  useEffect(() => {
    // Simular fetch a backend - reemplazar con URL real cuando esté disponible
    const fetchAlumnos = async () => {
      try {
        // const response = await fetch('http://localhost:3000/alumnos');
        // if (!response.ok) throw new Error('Error al obtener alumnos');
        // const data = await response.json();
        
        // Datos mock para desarrollo
        const data = [
          { nombre: 'Juan Pérez', matricula: 'A001' },
          { nombre: 'María García', matricula: 'A002' },
          { nombre: 'Carlos López', matricula: 'A003' }
        ];
        
        setAlumnos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumnos();
  }, []);

  const agregarAlumno = () => {
    if (!nuevoNombre.trim() || !nuevaMatricula.trim()) {
      alert('Nombre y matrícula son obligatorios.');
      return;
    }
    const nuevoAlumno = { nombre: nuevoNombre, matricula: nuevaMatricula };
    setAlumnos([...alumnos, nuevoAlumno]);
    setNuevoNombre('');
    setNuevaMatricula('');
  };

  if (loading) return <div className="alumnos-container"><p className="message loading-message">⏳ Cargando alumnos...</p></div>;
  if (error) return <div className="alumnos-container"><p className="message error-message">❌ Error: {error}</p></div>;

  return (
    <div className="alumnos-container">
      <h2>📚 Lista de Alumnos</h2>
      
      <div className="form-container">
        <h3>➕ Agregar Nuevo Alumno</h3>
        <div className="input-group">
          <input
            type="text"
            placeholder="Nombre del alumno"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Matrícula"
            value={nuevaMatricula}
            onChange={(e) => setNuevaMatricula(e.target.value)}
          />
          <button className="btn-agregar" onClick={agregarAlumno}>Agregar</button>
        </div>
      </div>

      {alumnos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-text">No hay alumnos registrados aún.</p>
        </div>
      ) : (
        <ul className="alumnos-list">
          {alumnos.map((alumno, index) => (
            <li key={index} className="alumno-item">
              <div className="alumno-info">
                <div className="alumno-nombre">👤 {alumno.nombre}</div>
                <div className="alumno-matricula"><strong>ID:</strong> {alumno.matricula}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AlumnosList;
