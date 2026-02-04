import { redirect } from 'next/navigation';
import { defaultLocale } from '@/app/i18n/config';

// Redirigir a la página con el locale por defecto
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
