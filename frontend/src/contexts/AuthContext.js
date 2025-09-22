import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import apiService from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    try {
      return typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : null;
    } catch {
      return null;
    }
  });

  // Memoized function to refresh token
  const refreshTokenIfNeeded = useCallback(async () => {
    try {
      const newToken = await apiService.refreshToken();
      if (newToken) {
        setToken(newToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Try to get user profile with current token
        const profile = await apiService.getProfile();
        setUser(profile);
      } catch (error) {
        // Token might be expired, try refreshing
        const refreshed = await refreshTokenIfNeeded();
        if (refreshed) {
          try {
            const profile = await apiService.getProfile();
            setUser(profile);
          } catch {
            // Refresh failed, clear auth state
            setToken(null);
            setUser(null);
            apiService.setAuthToken(null);
            try {
              if (typeof window !== 'undefined') {
                window.localStorage.removeItem('accessToken');
                window.localStorage.removeItem('refreshToken');
                window.localStorage.removeItem('user_id');
              }
            } catch {}
          }
        } else {
          // No refresh possible, clear auth state
          setToken(null);
          setUser(null);
          apiService.setAuthToken(null);
          try {
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem('accessToken');
              window.localStorage.removeItem('refreshToken');
              window.localStorage.removeItem('user_id');
            }
          } catch {}
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token, refreshTokenIfNeeded]);

  const login = async (email, password) => {
    try {
      const response = await apiService.loginUser({ email, password });
      if (response && response.access) {
        setToken(response.access);
        if (response.user) {
          setUser(response.user);
        } else {
          // Fetch profile if not included in login response
          const profile = await apiService.getProfile();
          setUser(profile);
        }
        return response;
      }
      throw new Error('Login failed: No access token received');
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.registerUser(userData);
      if (response && response.access) {
        setToken(response.access);
        if (response.user) {
          setUser(response.user);
        } else {
          // Fetch profile if not included in register response
          const profile = await apiService.getProfile();
          setUser(profile);
        }
        return response;
      }
      throw new Error('Registration failed: No access token received');
    } catch (error) {
      throw error;
    }
  };

  const logout = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('refreshToken');
        window.localStorage.removeItem('user_id');
      }
    } catch {}
    setToken(null);
    setUser(null);
    apiService.setAuthToken(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    refreshToken: refreshTokenIfNeeded,
  };

  return (
    <AuthContext.Provider value={value}>
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