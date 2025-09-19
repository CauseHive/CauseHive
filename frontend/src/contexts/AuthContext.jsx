import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');
        
        if (storedUser && accessToken) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // Set the token in apiService
          apiService.setAuthToken(accessToken);
          
          // Optionally verify token with backend
          // const isValid = await apiService.verifyToken();
          // if (!isValid) {
          //   await logout();
          // }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiService.loginUser(credentials);
      
      if (response && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
      }
      
      throw new Error('Login failed - no user data received');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.registerUser(userData);
      
      if (response) {
        // Auto-login after successful registration
        try {
          const loginResponse = await login({
            email: userData.email,
            password: userData.password
          });
          return loginResponse;
        } catch (loginError) {
          // Registration successful but auto-login failed
          return response;
        }
      }
      
      throw new Error('Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API if refresh token exists
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          await apiService.logoutUser();
        } catch (error) {
          // Logout API call failed, but we'll still clear local data
          console.warn('Logout API call failed:', error);
        }
      }
    } finally {
      // Clear all auth data
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Clear API service token
      apiService.setAuthToken(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};