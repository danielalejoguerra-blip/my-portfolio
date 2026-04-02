// ============================================
// Project Types - Tipos de proyecto
// ============================================

export type ProjectStatus = 'completed' | 'in_progress' | 'maintained' | 'archived';
export type ProjectCategory = 'web' | 'mobile' | 'api' | 'cli' | 'data' | 'devops' | 'game' | 'other';
export type TechCategory = 'backend' | 'frontend' | 'database' | 'devops' | 'mobile' | 'other';
export type TechProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface TechStackItem {
  name: string;
  category?: TechCategory;
  icon_url?: string | null;
  version?: string | null;
  proficiency?: TechProficiency | null;
}

export interface ProjectMetric {
  label: string;
  value: string;
  icon_url?: string | null;
}

export interface ProjectFeature {
  title: string;
  description?: string | null;
  icon_url?: string | null;
}

export interface ProjectChallenge {
  challenge: string;
  solution: string;
}

// Registro completo de proyecto (lectura)
export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  status: ProjectStatus;
  category: ProjectCategory | null;
  role: string | null;
  start_date: string | null;
  end_date: string | null;
  team_size: number | null;
  client: string | null;
  tech_stack: TechStackItem[];
  project_url: string | null;
  repository_url: string | null;
  documentation_url: string | null;
  case_study_url: string | null;
  metrics: ProjectMetric[];
  features: ProjectFeature[];
  challenges: ProjectChallenge[];
  images: string[];
  featured: boolean;
  visible: boolean;
  order: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  translations: Record<string, unknown>;
  lang: string;
}

// Datos para crear un proyecto
export interface ProjectCreate {
  title: string;
  status?: ProjectStatus;
  slug?: string;
  description?: string;
  content?: string;
  category?: ProjectCategory;
  role?: string;
  start_date?: string | null;
  end_date?: string | null;
  team_size?: number;
  client?: string;
  tech_stack?: TechStackItem[];
  project_url?: string;
  repository_url?: string;
  documentation_url?: string;
  case_study_url?: string;
  metrics?: ProjectMetric[];
  features?: ProjectFeature[];
  challenges?: ProjectChallenge[];
  images?: string[];
  featured?: boolean;
  visible?: boolean;
  order?: number;
  metadata?: Record<string, unknown>;
  translations?: Record<string, unknown>;
}

// Datos para actualizar un proyecto (todos opcionales)
export type ProjectUpdate = Partial<ProjectCreate>;

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
