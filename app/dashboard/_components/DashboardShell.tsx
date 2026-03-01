'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Sidebar, { DRAWER_WIDTH, DRAWER_COLLAPSED } from './Sidebar';
import TopBar from './TopBar';

interface DashboardShellProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'dashboard-sidebar-collapsed';

export default function DashboardShell({ children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const toggleMobile = useCallback(() => setMobileOpen((p) => !p), []);

  const sidebarWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={toggleCollapse}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          ml: { md: `${sidebarWidth}px` },
          transition: 'margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1)',
        }}
      >
        <TopBar onMenuClick={toggleMobile} />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
