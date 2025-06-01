import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/check");
      login(res.data.user); 
    } catch (err) {
      try {
        await api.get("/auth/refreshToken"); 
        const res = await api.get("/auth/check"); 
        login(res.data.user);
      } catch (refreshErr) {
        logout();
      }
    }
  };

  checkAuth();
}, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
