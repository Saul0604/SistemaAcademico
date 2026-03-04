# Hooks

Custom hooks reutilizables.

## Estructura
- useFetch.js - Hook para hacer fetch de datos
- useForm.js - Hook para manejar formularios
- useLocalStorage.js - Hook para localStorage

## Ejemplo
```javascript
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // ...
  return { data, loading, error };
};
```
