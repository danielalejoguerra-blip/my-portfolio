'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ icon, title, subtitle, actions }: PageHeaderProps) {
  return (
    <Box
      className="fade-in-up"
      sx={{
        p: { xs: 2.5, md: 3.5 },
        borderRadius: '20px',
        background: 'var(--gradient-hero)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          background: 'var(--gradient-accent)',
          opacity: 0.04,
          borderRadius: '50% 0 0 50%',
          transform: 'translateX(20%)',
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={2}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.75 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'var(--gradient-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: (theme) => `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                '& .MuiSvgIcon-root': { fontSize: 22, color: '#fff' },
              }}
            >
              {icon}
            </Box>
            <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em">
              {title}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 7 }}>
            {subtitle}
          </Typography>
        </Box>
        {actions && (
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexShrink: 0 }}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
