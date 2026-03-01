// ============================================
// Course Types - Tipos de curso
// ============================================

// Registro completo de curso (lectura)
export interface Course {
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

// Datos para crear un curso
export interface CourseCreate {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
  visible?: boolean;
  order?: number;
}

// Datos para actualizar un curso (todos opcionales)
export interface CourseUpdate {
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
export interface CourseListResponse {
  items: Course[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// Parámetros de consulta públicos
export interface CourseQueryParams {
  limit?: number;
  offset?: number;
}

// Parámetros de consulta admin
export interface CourseAdminQueryParams extends CourseQueryParams {
  include_hidden?: boolean;
  include_deleted?: boolean;
}
