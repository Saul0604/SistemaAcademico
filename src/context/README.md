# Context

Context API y proveedores globales.

## Estructura
- AuthContext.js - Contexto de autenticación
- AppContext.js - Contexto global de la app

## Ejemplo
```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // ...
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```
