import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale } from '@/app/i18n/config';
import { AuthProvider } from '@/hooks';

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
				<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
					{children}
				</div>
			</AuthProvider>
		</NextIntlClientProvider>
	);
}
