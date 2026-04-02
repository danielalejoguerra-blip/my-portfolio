// ============================================
// Education Types - Tipos de educación
// ============================================

export type DegreeType =
  | 'bachelor' | 'master' | 'phd' | 'associate'
  | 'bootcamp' | 'certification' | 'online_course'
  | 'high_school' | 'other';

export interface EducationActivity {
  name: string;
  role?: string | null;
  description?: string | null;
}

export interface EducationAchievement {
  title: string;
  year?: number | null;
  description?: string | null;
}

// Registro completo de educación (lectura)
export interface Education {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  institution: string;
  institution_url: string | null;
  location: string | null;
  degree_type: DegreeType;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  is_ongoing: boolean;
  credential_id: string | null;
  credential_url: string | null;
  grade: string | null;
  honors: string | null;
  relevant_coursework: string[];
  activities: EducationActivity[];
  achievements: EducationAchievement[];
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

// Datos para crear una educación
export interface EducationCreate {
  title: string;
  institution: string;
  degree_type?: DegreeType;
  slug?: string;
  description?: string;
  content?: string;
  institution_url?: string;
  location?: string;
  field_of_study?: string;
  start_date?: string | null;
  end_date?: string | null;
  credential_id?: string;
  credential_url?: string;
  grade?: string;
  honors?: string;
  relevant_coursework?: string[];
  activities?: EducationActivity[];
  achievements?: EducationAchievement[];
  images?: string[];
  visible?: boolean;
  order?: number;
  metadata?: Record<string, unknown>;
  translations?: Record<string, unknown>;
}

// Datos para actualizar una educación (todos opcionales)
export type EducationUpdate = Partial<EducationCreate>;

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
