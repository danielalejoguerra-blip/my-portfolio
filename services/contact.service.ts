// ============================================
// Contact Service - Cliente para la API
// ============================================

import api from './api';
import type { ContactRequest, ContactResponse } from '@/types';

export const contactService = {
  /**
   * Envía un mensaje de contacto
   */
  async send(data: ContactRequest): Promise<ContactResponse> {
    const response = await api.post<ContactResponse>('/contact', data);
    return response.data;
  },
};
