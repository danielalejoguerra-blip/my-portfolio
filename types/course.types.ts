// ============================================
// Course Types - Tipos de curso
// ============================================

export type CourseCategory =
  | 'backend' | 'frontend' | 'mobile' | 'devops'
  | 'data' | 'design' | 'security' | 'cloud'
  | 'soft_skills' | 'other';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface CourseSkill {
  name: string;
  category?: string;
}

export interface SyllabusItem {
  title: string;
  topics?: string[];
  duration_minutes?: number | null;
}

// Registro completo de curso (lectura)
export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  is_certification: boolean;
  category: CourseCategory | null;
  level: CourseLevel | null;
  platform: string | null;
  platform_url: string | null;
  instructor: string | null;
  instructor_url: string | null;
  completion_date: string | null;
  expiration_date: string | null;
  duration_hours: number | null;
  is_expired: boolean;
  credential_id: string | null;
  certificate_url: string | null;
  certificate_image_url: string | null;
  badge_url: string | null;
  skills_gained: CourseSkill[];
  syllabus: SyllabusItem[];
  images: string[];
  metadata: Record<string, unknown>;
  visible: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  translations: Record<string, unknown>;
  lang: string;
}

// Datos para crear un curso
export interface CourseCreate {
  title: string;
  is_certification?: boolean;
  category?: CourseCategory;
  level?: CourseLevel;
  slug?: string;
  description?: string;
  content?: string;
  platform?: string;
  platform_url?: string;
  instructor?: string;
  instructor_url?: string;
  completion_date?: string | null;
  expiration_date?: string | null;
  duration_hours?: number;
  credential_id?: string;
  certificate_url?: string;
  certificate_image_url?: string;
  badge_url?: string;
  skills_gained?: CourseSkill[];
  syllabus?: SyllabusItem[];
  images?: string[];
  visible?: boolean;
  order?: number;
  metadata?: Record<string, unknown>;
  translations?: Record<string, unknown>;
}

// Datos para actualizar un curso (todos opcionales)
export type CourseUpdate = Partial<CourseCreate>;

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
