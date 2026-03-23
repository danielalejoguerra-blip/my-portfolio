import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale } from '@/app/i18n/config';
import ThemeRegistry from '@/app/theme/ThemeRegistry';

async function getMessages() {
  return (await import(`../../messages/${defaultLocale}.json`)).default;
}

export default async function PasswordResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={defaultLocale} messages={messages}>
      <ThemeRegistry>{children}</ThemeRegistry>
    </NextIntlClientProvider>
  );
}
