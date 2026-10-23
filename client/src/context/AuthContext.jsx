import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('reclaim_token'));
  const [loading, setLoading] = useState(true);

  // Load current user profile on app load if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('reclaim_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (response?.data?.user) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('reclaim_token');
          setToken(null);
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        localStorage.removeItem('reclaim_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('reclaim_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('reclaim_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem('reclaim_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
