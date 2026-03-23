import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { locales, defaultLocale } from '@/app/i18n/config';
import { AuthProvider } from '@/hooks';
import ThemeRegistry from '@/app/theme/ThemeRegistry';
import { DashboardShell } from './_components';

async function getLocale() {
	const cookieStore = await cookies();
	const value = cookieStore.get('NEXT_LOCALE')?.value;
	return locales.includes(value as (typeof locales)[number]) ? (value as (typeof locales)[number]) : defaultLocale;
}

async function getMessages(locale: string) {
	return (await import(`../../messages/${locale}.json`)).default;
}

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const locale = await getLocale();
	const messages = await getMessages(locale);

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<AuthProvider>
				<ThemeRegistry>
					<DashboardShell>
						{children}
					</DashboardShell>
				</ThemeRegistry>
			</AuthProvider>
		</NextIntlClientProvider>
	);
}

