const API_URL = 'http://localhost:3000/materias';

export const obtenerMaterias = async () =>{
     try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al obtener materias');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en obtenerMaterias:', error);
        throw error;
    }
}

export const crearMateria = async (nombre, semestre) => {
    try {
        // 1. Obtener materias existentes
        const materiasExistentes = await obtenerMaterias();
        
        // 2. Verificar si ya existe (ignorando mayúsculas/minúsculas)
        const yaExiste = materiasExistentes.some(
            materia => materia.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
        );
        
        if (yaExiste) {
            throw new Error(`La materia "${nombre}" ya existe`);
        }

        // 3. Si no existe, crearla
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, semestre })
        });

        if (!response.ok) {
            throw new Error('Error al crear materia');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en crearMateria:', error);
        throw error;
    }
};