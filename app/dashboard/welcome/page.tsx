'use client';

// ============================================
// Welcome Page - Página de bienvenida admin
// ============================================

import { useAuth } from '@/hooks';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useTranslations } from 'next-intl';
import {
  Shield,
  User,
  Settings,
  LayoutDashboard,
  UserPlus,
  LogOut,
  Activity,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  BadgeCheck
} from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  const { user, logout, isLoading } = useAuth();
  const t = useTranslations('dashboard.welcome');

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--muted-foreground)]">
          {t('loading')}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Barra superior */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <span className="font-semibold text-[var(--foreground)]">
              {t('adminPanel')}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('signOut')}
          </Button>
        </div>

        {/* Saludo */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] mb-10">
          <Card variant="glass" className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <span className="text-sm text-[var(--muted-foreground)]">{t('welcomeBadge')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {t('welcomeTitle', { name: user?.full_name || user?.username || t('fallbackName') })}
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg">
              {t('welcomeSubtitle')}
            </p>
          </Card>

          <Card variant="default" className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">{t('sessionTitle')}</p>
                <p className="text-2xl font-semibold mt-2">{t('sessionActive')}</p>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  {t('sessionHint')}
                </p>
              </div>
              <BadgeCheck className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Info del usuario */}
        <Card variant="glass" className="p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/50 flex items-center justify-center">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                {user?.full_name || user?.username}
              </h2>
              <p className="text-[var(--muted-foreground)]">{user?.email}</p>
              {user?.bio && (
                <p className="text-sm text-[var(--muted-foreground)] mt-2">
                  {user.bio}
                </p>
              )}
            </div>
            <div className="md:ml-auto flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-400 text-sm font-medium">
                {t('sessionActive')}
              </span>
            </div>
          </div>
        </Card>

        {/* Cards de acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Dashboard */}
          <Link href="/dashboard">
            <Card 
              variant="default" 
              className="p-6 cursor-pointer hover:border-[var(--primary)]/50 transition-colors group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <LayoutDashboard className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">
                    {t('actions.dashboardTitle')}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t('actions.dashboardSubtitle')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                {t('actions.dashboardDesc')}
              </p>
            </Card>
          </Link>

          {/* Registrar usuario */}
          <Link href="/register">
            <Card 
              variant="default" 
              className="p-6 cursor-pointer hover:border-[var(--primary)]/50 transition-colors group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <UserPlus className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">
                    {t('actions.registerTitle')}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t('actions.registerSubtitle')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                {t('actions.registerDesc')}
              </p>
            </Card>
          </Link>

          {/* Usuarios */}
          <Link href="/dashboard/users">
            <Card 
              variant="default" 
              className="p-6 cursor-pointer hover:border-[var(--primary)]/50 transition-colors group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Settings className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">
                    {t('actions.usersTitle')}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t('actions.usersSubtitle')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                {t('actions.usersDesc')}
              </p>
            </Card>
          </Link>
        </div>

        {/* Estado del sistema */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--primary)]" />
              {t('system.title')}
            </h3>
            <Link href="/dashboard/users" className="text-sm text-[var(--primary)] inline-flex items-center gap-2">
              {t('system.cta')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {t('system.backendTitle')}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {t('system.backendStatus')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {t('system.authTitle')}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {t('system.authStatus')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {t('system.activityTitle')}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {t('system.activityStatus')}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
