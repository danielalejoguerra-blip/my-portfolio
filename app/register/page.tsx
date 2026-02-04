'use client';

import { RegisterForm } from '@/app/components/forms';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { UserPlus, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('auth.register');

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-6xl grid gap-6 lg:grid-cols-[1.1fr_1.3fr]">
          <Card variant="glass" className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">{t('badge')}</p>
                <h1 className="text-2xl md:text-3xl font-bold">{t('title')}</h1>
              </div>
            </div>
            <p className="text-[var(--muted-foreground)] text-lg mb-8">
              {t('subtitle')}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="font-medium">{t('feature1Title')}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t('feature1Desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('backToDashboard')}
                </Button>
              </Link>
            </div>
          </Card>

          <Card variant="glass" className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">{t('formBadge')}</p>
                <h2 className="text-xl font-semibold">{t('formTitle')}</h2>
              </div>
            </div>

            <RegisterForm />
          </Card>
        </div>
      </div>
    </main>
  );
}
