'use client';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { UserPlus, Search, Users, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function UsersPage() {
	const t = useTranslations('users');

	return (
		<main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
			<div className="max-w-6xl mx-auto px-6 py-10">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
					<div>
						<h1 className="text-3xl font-bold">{t('title')}</h1>
						<p className="text-[var(--muted-foreground)] mt-2">
							{t('subtitle')}
						</p>
					</div>

					<Link href="/register">
						<Button size="md" className="gap-2">
							<UserPlus className="w-4 h-4" />
							{t('addUser')}
						</Button>
					</Link>
				</div>

				<Card variant="glass" className="p-6 mb-6">
					<div className="flex flex-col md:flex-row md:items-center gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
							<input
								type="text"
								placeholder={t('searchPlaceholder')}
								className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
								disabled
							/>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm text-[var(--muted-foreground)]">{t('filterLabel')}</span>
							<span className="px-3 py-1 text-xs rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
								{t('filterAll')}
							</span>
						</div>
					</div>
				</Card>

				<Card variant="default" className="p-10 text-center">
					<div className="mx-auto w-14 h-14 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4">
						<Users className="w-6 h-6 text-[var(--primary)]" />
					</div>
					<h2 className="text-xl font-semibold mb-2">{t('emptyTitle')}</h2>
					<p className="text-[var(--muted-foreground)] max-w-md mx-auto">
						{t('emptyDescription')}
					</p>
					<div className="mt-6 flex justify-center">
						<Link href="/register">
							<Button className="gap-2">
								<ShieldCheck className="w-4 h-4" />
								{t('emptyCta')}
							</Button>
						</Link>
					</div>
				</Card>
			</div>
		</main>
	);
}
