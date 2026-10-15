import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://backend-gilt-three-74.vercel.app';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('manroz_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('manroz_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('manroz_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('manroz_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
