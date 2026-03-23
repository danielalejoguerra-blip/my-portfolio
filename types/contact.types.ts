// ============================================
// Contact Types - Tipos de contacto
// ============================================

// Datos para enviar un mensaje de contacto
export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

// Respuesta del endpoint de contacto
export interface ContactResponse {
  success: boolean;
  message: string;
}
