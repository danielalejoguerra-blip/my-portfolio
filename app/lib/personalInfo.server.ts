// ============================================
// Personal Info Server Utility - Fetch SSR
// ============================================

import type { PersonalInfo, PersonalInfoListResponse } from '@/types';

const API_URL = process.env.REACT_API_HOST;

/**
 * Obtiene la información personal pública principal (primer registro).
 * Se usa desde Server Components para SSR.
 * Retorna null si el backend no está disponible o no hay datos.
 */
export async function getPublicPersonalInfo(lang?: string): Promise<PersonalInfo | null> {
  try {
    const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : '';
    const response = await fetch(`${API_URL}/personal-info?limit=1&offset=0${langParam}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn('Failed to fetch personal info:', response.status);
      return null;
    }

    const data: PersonalInfoListResponse = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0];
    }

    return null;
  } catch (error) {
    console.warn('Personal info fetch error (backend may be offline):', error);
    return null;
  }
}
