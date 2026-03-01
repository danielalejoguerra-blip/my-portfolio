// ============================================
// Blog Types - Tipos de blog
// ============================================

// Registro completo de post (lectura)
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  images: string[] | null;
  metadata: Record<string, unknown> | null;
  visible: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Datos para crear un post
export interface BlogPostCreate {
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
  visible?: boolean;
  published_at?: string | null;
}

// Datos para actualizar un post (todos opcionales)
export interface BlogPostUpdate {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
  visible?: boolean;
  published_at?: string | null;
}

// Respuesta de lista paginada
export interface BlogPostListResponse {
  items: BlogPost[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// Parámetros de consulta públicos
export interface BlogQueryParams {
  limit?: number;
  offset?: number;
}

// Parámetros de consulta admin
export interface BlogAdminQueryParams extends BlogQueryParams {
  include_hidden?: boolean;
  include_deleted?: boolean;
  include_scheduled?: boolean;
}
