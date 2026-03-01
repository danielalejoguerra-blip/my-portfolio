import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale } from '@/app/i18n/config';
import { AuthProvider } from '@/hooks';
import ThemeRegistry from '@/app/theme/ThemeRegistry';
import { DashboardShell } from './_components';

async function getMessages() {
	return (await import(`../../messages/${defaultLocale}.json`)).default;
}

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const messages = await getMessages();

	return (
		<NextIntlClientProvider locale={defaultLocale} messages={messages}>
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
