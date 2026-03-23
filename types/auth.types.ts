// ============================================
// Auth Types - Sistema de Autenticación
// ============================================

// Usuario autenticado
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Request para login
export interface LoginRequest {
  email: string;
  password: string;
}

// Request para registro
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  avatar_url?: string;
}

// Estado de autenticación
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Contexto de autenticación
export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

// Request para solicitar código de reset
export interface PasswordResetRequestPayload {
  email: string;
}

// Request para confirmar reset de contraseña
export interface PasswordResetConfirmPayload {
  email: string;
  code: string;
  new_password: string;
}

// Respuesta de password reset
export interface PasswordResetResponse {
  detail: string;
}
