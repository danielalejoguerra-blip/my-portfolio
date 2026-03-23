// ============================================
// Auth Service - Servicio de autenticación
// ============================================

import api from './api';
import type { LoginRequest, RegisterRequest, User, PasswordResetRequestPayload, PasswordResetConfirmPayload, PasswordResetResponse } from '@/types';
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

  /**
   * Solicitar código de reset de contraseña
   * @param data - Email del usuario
   * @returns Mensaje de confirmación
   */
  async requestPasswordReset(data: PasswordResetRequestPayload): Promise<PasswordResetResponse> {
    const response = await api.post<PasswordResetResponse>('/auth/password-reset/request', data);
    return response.data;
  },

  /**
   * Confirmar reset de contraseña con código
   * @param data - Email, código y nueva contraseña
   * @returns Mensaje de confirmación
   */
  async confirmPasswordReset(data: PasswordResetConfirmPayload): Promise<PasswordResetResponse> {
    const response = await api.post<PasswordResetResponse>('/auth/password-reset/confirm', data);
    return response.data;
  },
};

export default authService;
