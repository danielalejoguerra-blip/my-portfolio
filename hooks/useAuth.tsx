'use client';

// ============================================
// Auth Context - Contexto de autenticación
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '@/services';
import type { User, LoginRequest, RegisterRequest, AuthContextType, AuthState } from '@/types';

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);

  // Actualizar estado parcialmente
  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Obtener usuario actual
  const fetchUser = useCallback(async () => {
    try {
      const user = await authService.getMe();
      updateState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch {
      updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, [updateState]);

  // Iniciar sesión
  const login = useCallback(async (credentials: LoginRequest) => {
    updateState({ isLoading: true, error: null });
    
    try {
      await authService.login(credentials);
      await fetchUser();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      updateState({ isLoading: false, error: message });
      throw error;
    }
  }, [updateState, fetchUser]);

  // Registrar usuario
  const register = useCallback(async (data: RegisterRequest) => {
    updateState({ isLoading: true, error: null });
    
    try {
      await authService.register(data);
      updateState({ isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar usuario';
      updateState({ isLoading: false, error: message });
      throw error;
    }
  }, [updateState]);

  // Cerrar sesión
  const logout = useCallback(async () => {
    updateState({ isLoading: true, error: null });
    
    try {
      await authService.logout();
    } catch {
      // Ignorar errores de logout, siempre limpiar estado local
    } finally {
      updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      // Redirigir a login
      window.location.href = '/login';
    }
  }, [updateState]);

  // Refrescar token
  const refreshToken = useCallback(async () => {
    try {
      await authService.refresh();
      await fetchUser();
    } catch (error) {
      updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Sesión expirada',
      });
      throw error;
    }
  }, [updateState, fetchUser]);

  // Limpiar error
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // Verificar autenticación al cargar
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Valor del contexto
  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
}

export default AuthContext;
