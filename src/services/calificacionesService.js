const API_URL = 'http://localhost:3000/calificaciones';// Ajusta la URL base si la manejas en un archivo de entorno o constante

export const obtenerCalificaciones = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener las calificaciones');
    return await response.json();
};

export const crearCalificacion = async (alumnoId, materiaId, nota) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alumnoId, materiaId, calificacion: Number(nota) }),
    });
    if (!response.ok) throw new Error('Error al crear la calificación');
    return await response.json();
};

export const actualizarCalificacion = async (id, alumnoId, materiaId, nota) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH', // <--- El método que coincide con tu backend
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alumnoId, materiaId, calificacion: Number(nota) }),
    });
    if (!response.ok) throw new Error('Error al actualizar la calificación');
    return await response.json();
};

export const eliminarCalificacion = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar la calificación');
    return await response.json();
};