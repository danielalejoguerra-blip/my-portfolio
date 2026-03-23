// ============================================
// Education Types - Tipos de educación
// ============================================

// Registro completo de educación (lectura)
export interface Education {
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

// Datos para crear una educación
export interface EducationCreate {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
  visible?: boolean;
  order?: number;
}

// Datos para actualizar una educación (todos opcionales)
export interface EducationUpdate {
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
export interface EducationListResponse {
  items: Education[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// Parámetros de consulta públicos
export interface EducationQueryParams {
  limit?: number;
  offset?: number;
}

// Parámetros de consulta admin
export interface EducationAdminQueryParams extends EducationQueryParams {
  include_hidden?: boolean;
  include_deleted?: boolean;
}
