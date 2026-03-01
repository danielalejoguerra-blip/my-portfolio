// ============================================
// Personal Info Types - Información personal
// ============================================

// Registro completo de información personal (lectura)
export interface PersonalInfo {
  id: number;
  full_name: string;
  headline: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  social_links: Record<string, string> | null;
  metadata: Record<string, unknown> | null;
  visible: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Datos para crear un registro
export interface PersonalInfoCreate {
  full_name: string;
  headline?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  resume_url?: string;
  social_links?: Record<string, string>;
  metadata?: Record<string, unknown>;
  visible?: boolean;
  order?: number;
}

// Datos para actualizar un registro (todos opcionales)
export interface PersonalInfoUpdate {
  full_name?: string;
  headline?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  resume_url?: string;
  social_links?: Record<string, string>;
  metadata?: Record<string, unknown>;
  visible?: boolean;
  order?: number;
}

// Respuesta de lista paginada
export interface PersonalInfoListResponse {
  items: PersonalInfo[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// Parámetros de consulta públicos
export interface PersonalInfoQueryParams {
  limit?: number;
  offset?: number;
}

// Parámetros de consulta admin
export interface PersonalInfoAdminQueryParams extends PersonalInfoQueryParams {
  include_hidden?: boolean;
  include_deleted?: boolean;
}
