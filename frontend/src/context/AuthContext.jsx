import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('atelier_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('atelier_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data?.user) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('atelier_token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.warn('Session expired or invalid token:', error.message);
          localStorage.removeItem('atelier_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data?.token) {
        localStorage.setItem('atelier_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showToast(`Welcome back, ${res.data.user.name}!`, 'success');
        return res.data.user;
      }
    } catch (error) {
      showToast(error.message || 'Login failed. Please check credentials.', 'error');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.success && res.data?.token) {
        localStorage.setItem('atelier_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showToast('Registration successful! Welcome to Atelier & Co.', 'success');
        return res.data.user;
      }
    } catch (error) {
      showToast(error.message || 'Registration failed.', 'error');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('atelier_token');
    setToken(null);
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser
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
