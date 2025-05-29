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

  // Optional: Check auth status on mount
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await fetch('http://localhost:8080/api/v1/auth/me', {
  //         method: 'GET',
  //         credentials: 'include',
  //       });

  //       if (!res.ok) throw new Error("Not logged in");

  //       const data = await res.json();
  //       login({ name: data.name, email: data.email });
  //     } catch (err) {
  //       logout();
  //     }
  //   };

  //   checkAuth();
  // }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
