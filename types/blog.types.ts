// ============================================
// Blog Types - Tipos de blog
// ============================================

export type BlogStatus = 'draft' | 'published' | 'scheduled';
export type ImagePosition = 'inline' | 'left' | 'right' | 'center' | 'background';
export type BlockType = 'text' | 'image' | 'gallery' | 'code' | 'callout' | 'video' | 'divider' | 'quote';
export type CalloutType = 'info' | 'warning' | 'tip' | 'danger';

export interface GalleryItem {
  url: string;
  alt?: string | null;
  caption?: string | null;
}

export interface ContentBlock {
  block_type: BlockType;
  content?: string | null;
  image_url?: string | null;
  image_position?: ImagePosition | null;
  image_alt?: string | null;
  caption?: string | null;
  gallery_items?: GalleryItem[];
  language?: string | null;
  callout_type?: CalloutType | null;
  video_url?: string | null;
}

// Registro completo de post (lectura)
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  content_blocks: ContentBlock[];
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_image_position: ImagePosition | null;
  category: string | null;
  tags: string[];
  series: string | null;
  series_order: number | null;
  reading_time_minutes: number | null;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  images: string[];
  status: BlogStatus;
  published_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  translations: Record<string, unknown>;
  lang: string;
}

// Datos para crear un post
export interface BlogPostCreate {
  title: string;
  status?: BlogStatus;
  published_at?: string | null;
  slug?: string;
  description?: string;
  content?: string;
  content_blocks?: ContentBlock[];
  cover_image_url?: string;
  cover_image_alt?: string;
  cover_image_position?: ImagePosition;
  category?: string;
  tags?: string[];
  series?: string;
  series_order?: number;
  reading_time_minutes?: number;
  featured?: boolean;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_image_url?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
  translations?: Record<string, unknown>;
}

// Datos para actualizar un post (todos opcionales)
export type BlogPostUpdate = Partial<BlogPostCreate>;

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
