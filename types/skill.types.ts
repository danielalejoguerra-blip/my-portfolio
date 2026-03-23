// ============================================
// Skill Types - Tipos de habilidad
// ============================================

// Registro completo de skill (lectura)
export interface Skill {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  visible: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Datos para crear una skill
export interface SkillCreate {
  title: string;
  slug?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  visible?: boolean;
  order?: number;
}

// Datos para actualizar una skill (todos opcionales)
export interface SkillUpdate {
  title?: string;
  slug?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  visible?: boolean;
  order?: number;
}

// Respuesta de lista paginada
export interface SkillListResponse {
  items: Skill[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// Parámetros de consulta públicos
export interface SkillQueryParams {
  limit?: number;
  offset?: number;
}

// Parámetros de consulta admin
export interface SkillAdminQueryParams extends SkillQueryParams {
  include_hidden?: boolean;
  include_deleted?: boolean;
}
