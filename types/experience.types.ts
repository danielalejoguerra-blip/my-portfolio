// ============================================
// Experience Types - Tipos de experiencia
// ============================================

export type EmploymentType =
  | 'full_time' | 'part_time' | 'contract'
  | 'freelance' | 'internship' | 'volunteer';
export type WorkMode = 'on_site' | 'remote' | 'hybrid';

export interface ExperienceTechStack {
  name: string;
  category?: string;
  icon_url?: string | null;
  version?: string | null;
}

export interface ExperienceAchievement {
  label: string;
  value: string;
  icon_url?: string | null;
}

export interface RelatedProject {
  title: string;
  slug?: string | null;
  url?: string | null;
}

export interface ExperienceReference {
  name: string;
  role?: string | null;
  linkedin_url?: string | null;
  available?: boolean;
}

// Registro completo de experiencia (lectura)
export interface Experience {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  company: string;
  company_url: string | null;
  company_logo_url: string | null;
  location: string | null;
  employment_type: EmploymentType | null;
  work_mode: WorkMode | null;
  department: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  tech_stack: ExperienceTechStack[];
  responsibilities: string[];
  achievements: ExperienceAchievement[];
  related_projects: RelatedProject[];
  references: ExperienceReference[];
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

// Datos para crear una experiencia
export interface ExperienceCreate {
  title: string;
  company: string;
  start_date: string;
  is_current?: boolean;
  end_date?: string | null;
  employment_type?: EmploymentType;
  work_mode?: WorkMode;
  slug?: string;
  description?: string;
  content?: string;
  company_url?: string;
  company_logo_url?: string;
  location?: string;
  department?: string;
  tech_stack?: ExperienceTechStack[];
  responsibilities?: string[];
  achievements?: ExperienceAchievement[];
  related_projects?: RelatedProject[];
  references?: ExperienceReference[];
  images?: string[];
  visible?: boolean;
  order?: number;
  metadata?: Record<string, unknown>;
  translations?: Record<string, unknown>;
}

// Datos para actualizar una experiencia (todos opcionales)
export type ExperienceUpdate = Partial<ExperienceCreate>;

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
