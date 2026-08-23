import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types/index.js';
import { authService } from '../services/authService.js';
import { useToast } from './ToastContext.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();

  const initAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('esr_auth_token');
    const savedUserStr = localStorage.getItem('esr_auth_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUserStr) {
        try {
          setUser(JSON.parse(savedUserStr));
        } catch {
          // Ignore parse error
        }
      }

      // Verify token with backend
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.user) {
          setUser(response.user);
          localStorage.setItem('esr_auth_user', JSON.stringify(response.user));
        }
      } catch (err) {
        console.warn('Session verification failed:', err);
        // Token was invalid or expired
        localStorage.removeItem('esr_auth_token');
        localStorage.removeItem('esr_auth_user');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(username, password);
      if (response.success && response.token) {
        localStorage.setItem('esr_auth_token', response.token);
        localStorage.setItem('esr_auth_user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        success('Authentication Successful', `Welcome back, ${response.user.name}`);
        return true;
      }
      return false;
    } catch (err: any) {
      error('Login Failed', err.message || 'Invalid username or password');
      return false;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout().catch(() => {});
      }
    } finally {
      localStorage.removeItem('esr_auth_token');
      localStorage.removeItem('esr_auth_user');
      setToken(null);
      setUser(null);
      success('Logged Out', 'You have been signed out safely.');
    }
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const nextUser = { ...user, ...updatedData };
      setUser(nextUser);
      localStorage.setItem('esr_auth_user', JSON.stringify(nextUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
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
