// ============================================
// API Types - Tipos de respuesta del servidor
// ============================================

// Respuesta genérica de la API
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success: boolean;
}

// Respuesta de error de la API
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Respuesta de autenticación
export interface AuthResponse {
  message: string;
  user?: {
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
  };
}

// Respuesta de refresh token
export interface RefreshResponse {
  message: string;
}

// Respuesta de logout
export interface LogoutResponse {
  message: string;
}
