import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale } from '@/app/i18n/config';

async function getMessages() {
  return (await import(`../../messages/${defaultLocale}.json`)).default;
}

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={defaultLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
