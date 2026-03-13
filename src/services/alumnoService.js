const API_URL = 'http://localhost:3000/alumnos';

const parseJsonResponse = async (response) => {
  const json = await response.json();
  // Algunos endpoints devuelven la información dentro de { message, data }
  // otros devuelven directamente el dato útil (ej: arreglo de alumnos).
  return json && typeof json === 'object' && 'data' in json ? json.data : json;
};

/**
 * Obtiene la lista de todos los alumnos
 */
export const obtenerAlumnos = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener alumnos');
    }
    return await parseJsonResponse(response);
  } catch (error) {
    console.error('Error en obtenerAlumnos:', error);
    throw error;
  }
};

/**
 * Crea un nuevo alumno
 */
export const crearAlumno = async (nombre, matricula) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, matricula })
    });

    if (!response.ok) {
      throw new Error('Error al crear alumno');
    }

    return await parseJsonResponse(response);
  } catch (error) {
    console.error('Error en crearAlumno:', error);
    throw error;
  }
};

/**
 * Actualiza un alumno existente
 */
export const actualizarAlumno = async (id, nombre, matricula) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, matricula })
    });

    if (!response.ok) {
      throw new Error('Error al actualizar alumno');
    }

    return await parseJsonResponse(response);
  } catch (error) {
    console.error('Error en actualizarAlumno:', error);
    throw error;
  }
};

/**
 * Elimina un alumno
 */
export const eliminarAlumno = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Error al eliminar alumno');
    }

    return await parseJsonResponse(response);
  } catch (error) {
    console.error('Error en eliminarAlumno:', error);
    throw error;
  }
};
