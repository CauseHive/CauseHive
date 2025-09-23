import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
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
  
  // Use ref to track token without causing dependency loops
  const tokenRef = useRef(token);
  const isInitializedRef = useRef(false);
  
  // Update ref when token changes
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

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

  // Initialize auth state on mount - FIXED to prevent infinite loops
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    const initializeAuth = async () => {
      const currentToken = tokenRef.current;
      
      if (!currentToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        // Try to get user profile with current token
        const profile = await apiService.getProfile();
        if (isMounted) setUser(profile);
      } catch (error) {
        // Token might be expired, try refreshing
        console.log('Profile fetch failed, attempting token refresh...');
        const refreshed = await refreshTokenIfNeeded();
        if (refreshed && isMounted) {
          try {
            const profile = await apiService.getProfile();
            if (isMounted) setUser(profile);
          } catch {
            // Refresh failed, clear auth state
            if (isMounted) {
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
          }
        } else if (isMounted) {
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
        if (isMounted) setLoading(false);
      }
    };

    // Only initialize once or when token changes significantly
    if (!isInitializedRef.current || tokenRef.current !== token) {
      isInitializedRef.current = true;
      initializeAuth();
    }
    
    return () => {
      isMounted = false; // Cleanup flag
    };
  }, [token, refreshTokenIfNeeded]); // Safe to include token now that we use ref

  // Update tokenRef when token state changes
  useEffect(() => {
    tokenRef.current = token;
    
    // Sync with apiService when token changes
    if (token) {
      apiService.setAuthToken(token);
    }
  }, [token]);

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