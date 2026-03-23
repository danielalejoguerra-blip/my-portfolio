// ============================================
// Project Types - Tipos de proyecto
// ============================================

// Registro completo de proyecto (lectura)
export interface Project {
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

// Datos para crear un proyecto
export interface ProjectCreate {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
  visible?: boolean;
  order?: number;
}

// Datos para actualizar un proyecto (todos opcionales)
export interface ProjectUpdate {
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
export interface ProjectListResponse {
  items: Project[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// Parámetros de consulta públicos
export interface ProjectQueryParams {
  limit?: number;
  offset?: number;
}

// Parámetros de consulta admin
export interface ProjectAdminQueryParams extends ProjectQueryParams {
  include_hidden?: boolean;
  include_deleted?: boolean;
}
