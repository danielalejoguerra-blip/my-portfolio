// ============================================
// Auth Service - Servicio de autenticación
// ============================================

import api from './api';
import type { LoginRequest, RegisterRequest, User } from '@/types';
import type { AuthResponse, LogoutResponse, RefreshResponse } from '@/types';

export const authService = {
  /**
   * Iniciar sesión
   * @param credentials - Email y password
   * @returns Usuario autenticado
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Registrar nuevo usuario (solo disponible para usuarios autenticados)
   * @param data - Datos de registro
   * @returns Usuario creado
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Refrescar token de acceso
   * @returns Mensaje de éxito
   */
  async refresh(): Promise<RefreshResponse> {
    const response = await api.post<RefreshResponse>('/auth/refresh');
    return response.data;
  },

  /**
   * Cerrar sesión
   * @returns Mensaje de éxito
   */
  async logout(): Promise<LogoutResponse> {
    const response = await api.post<LogoutResponse>('/auth/logout');
    return response.data;
  },

  /**
   * Obtener usuario actual
   * @returns Usuario autenticado
   */
  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

export default authService;
