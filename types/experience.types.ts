// ============================================
// Experience Types - Tipos de experiencia
// ============================================

// Registro completo de experiencia (lectura)
export interface Experience {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  images: string[] | null;
  metadata: Record<string, unknown> | null;
  visible: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Datos para crear una experiencia
export interface ExperienceCreate {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
  visible?: boolean;
  order?: number;
}

// Datos para actualizar una experiencia (todos opcionales)
export interface ExperienceUpdate {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
  visible?: boolean;
  order?: number;
}

// Respuesta de lista paginada
export interface ExperienceListResponse {
  items: Experience[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// Parámetros de consulta públicos
export interface ExperienceQueryParams {
  limit?: number;
  offset?: number;
}

// Parámetros de consulta admin
export interface ExperienceAdminQueryParams extends ExperienceQueryParams {
  include_hidden?: boolean;
  include_deleted?: boolean;
}
