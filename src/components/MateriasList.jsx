import { useState, useEffect } from 'react';
import './AlumnosList.css';
import { obtenerMaterias, crearMateria} from '../services/materiaService'

function MateriasList() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoSemestre, setNuevoSemestre] = useState('');
  const [guardando, setGuardando] = useState(false);
  
//   // Estados para edición
//   const [mostrarModal, setMostrarModal] = useState(false);
//   const [materiaEditando, setMateriaEditando] = useState(null);
//   const [nombreEditado, setNombreEditado] = useState('');
//   const [semestreEditado, setSemestreEditado] = useState('');
//   const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  // Cargar materias al montar el componente
  useEffect(() => {
    cargarAlumnos();
  }, []);

  const cargarAlumnos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerMaterias();
      setMaterias(data);
    } catch (err) {
      setError('No pudimos cargar las materias. Verifica que el backend esté ejecutándose.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const agregarMateria = async () => {
    if (!nuevoNombre.trim() || !nuevoSemestre.trim()) {
      alert('Nombre y semestre son obligatorios.');
      return;
    }

    try {
      setGuardando(true);
      const response = await crearMateria(nuevoNombre, nuevoSemestre);
      
      // Agregar la nueva materia a la lista
      setMaterias([...materias, response.data]);
      setNuevoNombre('');
      setNuevoSemestre('');
    } catch (err) {
      alert('Error al agregar materia: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };


  if (loading) return <div className="alumnos-container"><p className="message loading-message">⏳ Cargando alumnos...</p></div>;
  if (error) return <div className="alumnos-container"><p className="message error-message">❌ {error}</p></div>;

  return (
    <div className="alumnos-container">
      <h2>Lista de Materias</h2>
      
      <div className="form-container">
        <h3>Agregar Nueva Materia</h3>
        <div className="input-group">
          <input
            type="text"
            placeholder="Nombre de la materia"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            disabled={guardando}
          />
          <input
            type="text"
            placeholder="Semestre"
            value={nuevoSemestre}
            onChange={(e) => setNuevoSemestre(e.target.value)}
            disabled={guardando}
          />
          <button className="btn-agregar" onClick={agregarMateria} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Agregar'}
          </button>
          
        </div>
      </div>

      {materias.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-text">No hay materias registradas aún.</p>
        </div>
      ) : (
        <ul className="alumnos-list">
          {materias.map((materia) => (
            <li key={materia.id} className="alumno-item">
              <div className="alumno-info">
                <div className="alumno-nombre">{materia.nombre}</div>
                <div className="alumno-matricula"><strong>Semestre:</strong> {materia.semestre}</div>
              </div>
              <div className="alumno-acciones">
                {/* <button 
                  className="btn-editar" 
                  onClick={() => abrirModalEdicion(materia.id)}
                  title="Editar materia"
                > */}
                
                {/* </button> */}
                {/* <button 
                  className="btn-eliminar" 
                  onClick={() => eliminarMateriaHandler(materia.id)}
                  title="Eliminar materia"
                >
                  🗑️
                </button> */}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de Edición
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
      )} */}
    </div>
  );
};

export default MateriasList;
