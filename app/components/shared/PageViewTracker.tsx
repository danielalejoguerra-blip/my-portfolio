'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsService } from '@/services';

function normalizePageSlug(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return '/home';

  const localeCandidate = parts[0];
  const isLocale = localeCandidate === 'es' || localeCandidate === 'en';
  const noLocale = isLocale ? parts.slice(1) : parts;

  return noLocale.length === 0 ? '/home' : `/${noLocale.join('/')}`;
}

function inferContentTypeFromSlug(pageSlug: string): string | undefined {
  const clean = pageSlug.split('?')[0];
  const parts = clean.split('/').filter(Boolean);
  if (parts.length < 2) return undefined;

  const section = parts[0];
  const detailSections = ['projects', 'blog', 'courses', 'education', 'experience', 'skills'];
  return detailSections.includes(section) ? section : undefined;
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    const pageSlug = normalizePageSlug(pathname || '/');
    if (lastTrackedRef.current === pageSlug) return;
    lastTrackedRef.current = pageSlug;

    const contentType = inferContentTypeFromSlug(pageSlug);

    void analyticsService.pageview({ page_slug: pageSlug, content_type: contentType }).catch(() => {
      // Intentionally silent: tracking should never break UI flow
    });
  }, [pathname]);

  return null;
}
