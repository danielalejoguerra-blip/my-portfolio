'use server';

import { cookies } from 'next/headers';
import { locales, type Locale } from '@/app/i18n/config';

export async function setLocaleCookie(locale: string) {
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : null;
  if (!validLocale) return;
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', validLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
}
