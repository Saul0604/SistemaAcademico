# Utils

Funciones utilitarias y helpers.

## Estructura
- formatters.js - Funciones para dar formato a datos
- validators.js - Funciones para validar datos
- helpers.js - Funciones auxiliares generales

## Ejemplo
```javascript
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-MX');
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```
