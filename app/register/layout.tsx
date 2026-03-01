import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale } from '@/app/i18n/config';
import { AuthProvider } from '@/hooks';
import ThemeRegistry from '@/app/theme/ThemeRegistry';

async function getMessages() {
  return (await import(`../../messages/${defaultLocale}.json`)).default;
}

export default async function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={defaultLocale} messages={messages}>
      <ThemeRegistry>
        <AuthProvider>{children}</AuthProvider>
      </ThemeRegistry>
    </NextIntlClientProvider>
  );
}
