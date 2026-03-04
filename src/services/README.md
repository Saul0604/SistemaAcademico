# Services

Servicios para comunicación con el backend.

## Estructura
- alumnosService.js - API calls para alumnos
- materiasService.js - API calls para materias
- calificacionesService.js - API calls para calificaciones

## Ejemplo
```javascript
export const getAlumnos = async () => {
  const response = await fetch('http://localhost:3000/api/alumnos');
  return response.json();
};
```
