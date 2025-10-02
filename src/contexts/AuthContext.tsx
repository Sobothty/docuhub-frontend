'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types/authTypes';
import { useGetUserProfileQuery } from '@/feature/auth/authApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Check if user has token stored locally
  const hasToken = () => {
    if (typeof window === 'undefined') return false;
    return Boolean(
      localStorage.getItem('access_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('user')
    );
  };

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'access_token',
      newValue: null,
      oldValue: 'logged_out'
    }));
  }, []);

  // Use RTK Query to get user profile data if authenticated
  const { 
    data: userProfileData, 
    isLoading: userLoading, 
    refetch: refetchUser,
    error 
  } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated || !hasToken(),
  });

  useEffect(() => {
    setMounted(true);
    
    // Check initial auth state
    const tokenExists = hasToken();
    setIsAuthenticated(tokenExists);
    
    // Try to get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser && tokenExists) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'token' || e.key === 'user') {
        const newTokenExists = hasToken();
        setIsAuthenticated(newTokenExists);
        
        if (!newTokenExists) {
          setUser(null);
        } else {
          // Refetch user data if token is added
          refetchUser();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refetchUser]);

  const login = (token: string, userData?: User) => {
    localStorage.setItem('access_token', token);
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setIsAuthenticated(true);
    // Notify other tabs
    window.dispatchEvent(new StorageEvent('storage', { key: 'access_token', newValue: token }));
  };

  // Perform credential sign-in against our Next API and then store token/user
  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      let text = '';
      try { text = await res.text(); } catch {}
      try {
        const data = JSON.parse(text);
        const msg = data?.error || data?.message || text || 'Login failed';
        throw new Error(msg);
      } catch {
        throw new Error(text || 'Login failed');
      }
    }
    const data = await res.json();
    // Prefer access_token in response; cookies are httpOnly but we also keep a local copy for UI state
    const token: string | undefined = data?.access_token || data?.token || data?.accessToken;
    const userData: User | undefined = data?.user;
    if (!token) {
      // Fallback: rely on cookie only, but create a marker so context knows we're authenticated
      localStorage.setItem('access_token', 'cookie');
      setIsAuthenticated(true);
      // Try to refetch profile to populate user
      try { await refetchUser().unwrap(); } catch {}
      return;
    }
    login(token, userData);
    // Optionally refetch to ensure latest profile
    try { await refetchUser().unwrap(); } catch {}
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const refreshAuth = () => {
    if (isAuthenticated && hasToken()) {
      refetchUser();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: !mounted,
    signIn,
    login,
    logout,
    updateUser,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;