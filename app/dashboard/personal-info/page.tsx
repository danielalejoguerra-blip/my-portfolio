'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { personalInfoService } from '@/services';
import type { PersonalInfo, PersonalInfoCreate, PersonalInfoUpdate } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUrlInput from '@/app/components/shared/ImageUrlInput';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Drawer from '@mui/material/Drawer';
import { alpha } from '@mui/material/styles';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ViewModuleRoundedIcon from '@mui/icons-material/ViewModuleRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

import { PageHeader } from '../_components';

/* ─── Types ─── */
type ViewMode = 'cards' | 'table';
type FormData = PersonalInfoCreate & { id?: number };

const emptyForm: FormData = {
  full_name: '', headline: '', bio: '', email: '', phone: '',
  location: '', website: '', avatar_url: '', resume_url: '',
  social_links: {}, metadata: {}, visible: true, order: 0,
};

/* ─── Social platform colours ─── */
const PLATFORM_COLORS: Record<string, string> = {
  github: '#24292e',    linkedin: '#0077b5',  twitter: '#1da1f2',
  instagram: '#e1306c', youtube: '#ff0000',   facebook: '#1877f2',
  tiktok: '#000000',    discord: '#5865f2',   website: '#6366f1',
};
const getPlatformColor = (key: string) =>
  PLATFORM_COLORS[key.toLowerCase()] ?? '#6366f1';

/* ══════════════════════════════════════════
   SUB-COMPONENT: View Toggle
══════════════════════════════════════════ */
function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <Box sx={{
      display: 'flex', borderRadius: '12px', overflow: 'hidden',
      border: '1px solid var(--glass-border)', bgcolor: (th) => alpha(th.palette.background.default, 0.6),
      p: '3px', gap: '3px',
    }}>
      {(['cards', 'table'] as ViewMode[]).map((mode) => {
        const active = value === mode;
        return (
          <Tooltip key={mode} title={mode === 'cards' ? 'Card view' : 'Table view'}>
            <Box
              component="button"
              onClick={() => onChange(mode)}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 30, borderRadius: '9px', border: 'none',
                cursor: 'pointer', transition: 'all 0.2s',
                background: active ? 'var(--gradient-accent)' : 'transparent',
                color: active ? '#fff' : 'text.secondary',
                '&:hover': { bgcolor: active ? undefined : (th) => alpha(th.palette.text.primary, 0.06) },
              }}
            >
              {mode === 'cards'
                ? <ViewModuleRoundedIcon sx={{ fontSize: 17 }} />
                : <TableRowsRoundedIcon sx={{ fontSize: 17 }} />}
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}

/* ══════════════════════════════════════════
   SUB-COMPONENT: Stats Bar
══════════════════════════════════════════ */
function StatsBar({ items }: { items: PersonalInfo[] }) {
  const total   = items.length;
  const visible = items.filter((i) => i.visible && !i.deleted_at).length;
  const hidden  = items.filter((i) => !i.visible && !i.deleted_at).length;
  const deleted = items.filter((i) => !!i.deleted_at).length;

  const stats = [
    { label: 'Total profiles', value: total,   color: '#6366f1' },
    { label: 'Visible',        value: visible,  color: '#22c55e' },
    { label: 'Hidden',         value: hidden,   color: '#f59e0b' },
    { label: 'Deleted',        value: deleted,  color: '#ef4444' },
  ];

  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 2, py: 1, borderRadius: '10px',
            bgcolor: alpha(s.color, 0.08),
            border: '1px solid', borderColor: alpha(s.color, 0.2),
          }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color, flexShrink: 0 }} />
            <Typography variant="caption" fontWeight={600} color="text.secondary">{s.label}</Typography>
            <Typography variant="caption" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
          </Box>
        </motion.div>
      ))}
    </Stack>
  );
}

/* ══════════════════════════════════════════
   SUB-COMPONENT: Inline Confirm Button
══════════════════════════════════════════ */
function InlineConfirmButton({
  onConfirm,
  label,
  confirmLabel = 'Confirm',
  color = 'error',
  icon,
  size = 'small',
}: {
  onConfirm: () => void;
  label: string;
  confirmLabel?: string;
  color?: 'error' | 'warning';
  icon?: React.ReactNode;
  size?: 'small' | 'medium';
}) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startConfirm = () => {
    setConfirming(true);
    timerRef.current = setTimeout(() => setConfirming(false), 3000);
  };

  const doConfirm = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setConfirming(false);
    onConfirm();
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {confirming ? (
        <motion.div
          key="confirm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'flex', gap: 4 }}
        >
          <Button
            size={size}
            color={color}
            variant="contained"
            startIcon={<CheckRoundedIcon sx={{ fontSize: 14 }} />}
            onClick={doConfirm}
            sx={{ fontWeight: 700, borderRadius: '8px', fontSize: '0.72rem' }}
          >
            {confirmLabel}
          </Button>
          <IconButton
            size="small"
            onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); setConfirming(false); }}
            sx={{ borderRadius: '8px', bgcolor: (th) => alpha(th.palette.text.primary, 0.05) }}
          >
            <CloseRoundedIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </motion.div>
      ) : (
        <motion.div
          key="idle"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <Button
            size={size}
            color={color}
            startIcon={icon}
            onClick={startConfirm}
            sx={{
              fontWeight: 600, borderRadius: '8px', fontSize: '0.72rem',
              bgcolor: (th) => alpha(th.palette[color].main, 0.08),
              '&:hover': { bgcolor: (th) => alpha(th.palette[color].main, 0.15) },
            }}
          >
            {label}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════
   SUB-COMPONENT: Info Card
══════════════════════════════════════════ */
function InfoCard({
  item,
  index,
  onEdit,
  onDelete,
  onHardDelete,
  onRestore,
  t,
}: {
  item: PersonalInfo;
  index: number;
  onEdit: (item: PersonalInfo) => void;
  onDelete: (id: number) => void;
  onHardDelete: (id: number) => void;
  onRestore: (id: number) => void;
  t: ReturnType<typeof useTranslations<'dashboard.personalInfo'>>;
}) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const bioIsTruncatable = (item.bio?.length ?? 0) > 140;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      layout
    >
      <Card
        sx={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '20px',
          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: (th) => `0 20px 60px ${alpha(th.palette.primary.main, 0.12)}`,
            borderColor: (th) => alpha(th.palette.primary.main, 0.2),
          },
          ...(item.deleted_at && { opacity: 0.65, filter: 'grayscale(0.3)' }),
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>

          {/* ── Header row ── */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ sm: 'flex-start' }}>

            {/* Avatar with status ring */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Avatar
                src={item.avatar_url || undefined}
                sx={{
                  width: 80, height: 80, fontSize: '1.6rem',
                  background: 'var(--gradient-accent)',
                  border: '3px solid',
                  borderColor: item.visible && !item.deleted_at
                    ? (th) => alpha(th.palette.primary.main, 0.35)
                    : (th) => alpha(th.palette.text.disabled, 0.25),
                  boxShadow: item.visible && !item.deleted_at
                    ? (th) => `0 0 0 4px ${alpha(th.palette.primary.main, 0.1)}, 0 6px 24px ${alpha(th.palette.primary.main, 0.2)}`
                    : 'none',
                  transition: 'all 0.3s',
                }}
              >
                {!item.avatar_url && <PersonRoundedIcon sx={{ fontSize: 38 }} />}
              </Avatar>

              {/* Visible dot */}
              <Box sx={{
                position: 'absolute', bottom: 4, right: 4,
                width: 14, height: 14, borderRadius: '50%',
                border: '2px solid var(--glass-bg)',
                bgcolor: item.deleted_at ? 'error.main' : item.visible ? 'success.main' : 'warning.main',
              }} />
            </Box>

            {/* Name + badges + headline */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ mb: 0.5 }}>
                <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em" noWrap>
                  {item.full_name}
                </Typography>
                <Chip
                  label={`#${item.id}`}
                  size="small"
                  sx={{
                    height: 20, fontSize: '0.65rem', fontWeight: 700,
                    bgcolor: (th) => alpha(th.palette.primary.main, 0.1),
                    color: 'primary.main',
                  }}
                />
                {!item.visible && !item.deleted_at && (
                  <Chip
                    icon={<VisibilityOffRoundedIcon />}
                    label={t('hidden')}
                    size="small"
                    sx={{
                      height: 22, fontSize: '0.68rem', fontWeight: 600,
                      bgcolor: (th) => alpha(th.palette.warning.main, 0.12),
                      color: 'warning.main',
                      '& .MuiChip-icon': { fontSize: 12, color: 'warning.main' },
                    }}
                  />
                )}
                {item.deleted_at && (
                  <Chip
                    label={t('deleted')}
                    size="small"
                    sx={{
                      height: 22, fontSize: '0.68rem', fontWeight: 600,
                      bgcolor: (th) => alpha(th.palette.error.main, 0.12),
                      color: 'error.main',
                    }}
                  />
                )}
              </Stack>

              {item.headline && (
                <Typography variant="body2" fontWeight={600} sx={{
                  background: 'var(--gradient-accent)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  mb: 0.75,
                }}>
                  {item.headline}
                </Typography>
              )}

              {/* Contact row */}
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {[
                  { icon: <EmailRoundedIcon />, val: item.email },
                  { icon: <PhoneRoundedIcon />, val: item.phone },
                  { icon: <PlaceRoundedIcon />, val: item.location },
                ].filter((c) => c.val).map((c, ci) => (
                  <Stack key={ci} direction="row" alignItems="center" spacing={0.4}
                    sx={{ color: 'text.secondary', '& .MuiSvgIcon-root': { fontSize: 13, color: 'primary.main' } }}>
                    {c.icon}
                    <Typography variant="caption" fontWeight={500}>{c.val}</Typography>
                  </Stack>
                ))}
                {item.website && (
                  <Stack
                    direction="row" alignItems="center" spacing={0.4}
                    component="a" href={item.website} target="_blank" rel="noopener noreferrer"
                    sx={{ textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' }, '& .MuiSvgIcon-root': { fontSize: 13, color: 'primary.main' } }}
                  >
                    <LanguageRoundedIcon />
                    <Typography variant="caption" fontWeight={500}>Website</Typography>
                  </Stack>
                )}
              </Stack>
            </Box>

            {/* Actions – top-right */}
            <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0, alignSelf: { xs: 'flex-end', sm: 'flex-start' } }}>
              {item.deleted_at ? (
                <>
                  <Tooltip title={t('restore')}>
                    <Button size="small" startIcon={<RestoreRoundedIcon />} onClick={() => onRestore(item.id)}
                      sx={{ borderRadius: '8px', bgcolor: (th) => alpha(th.palette.success.main, 0.08), color: 'success.main', fontWeight: 600, fontSize: '0.72rem', '&:hover': { bgcolor: (th) => alpha(th.palette.success.main, 0.15) } }}>
                      {t('restore')}
                    </Button>
                  </Tooltip>
                  <InlineConfirmButton
                    onConfirm={() => onHardDelete(item.id)}
                    label={t('hardDelete')}
                    confirmLabel="Delete forever"
                    color="error"
                    icon={<DeleteForeverRoundedIcon sx={{ fontSize: 14 }} />}
                  />
                </>
              ) : (
                <>
                  <Tooltip title={t('edit')}>
                    <IconButton size="small" onClick={() => onEdit(item)}
                      sx={{ borderRadius: '8px', bgcolor: (th) => alpha(th.palette.primary.main, 0.08), color: 'primary.main', '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.15) } }}>
                      <EditRoundedIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>
                  <InlineConfirmButton
                    onConfirm={() => onDelete(item.id)}
                    label={t('delete')}
                    confirmLabel={t('delete')}
                    color="error"
                    icon={<DeleteRoundedIcon sx={{ fontSize: 14 }} />}
                  />
                </>
              )}
            </Stack>
          </Stack>

          {/* ── Bio section ── */}
          {item.bio && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid var(--glass-border)' }}>
              <AnimatePresence initial={false}>
                <motion.div
                  animate={{ height: bioExpanded || !bioIsTruncatable ? 'auto' : 52 }}
                  style={{ overflow: 'hidden' }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7} sx={{
                    ...((!bioExpanded && bioIsTruncatable) && {
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }),
                  }}>
                    {item.bio}
                  </Typography>
                </motion.div>
              </AnimatePresence>
              {bioIsTruncatable && (
                <Button
                  size="small"
                  endIcon={
                    <KeyboardArrowDownRoundedIcon sx={{
                      fontSize: 16,
                      transition: 'transform 0.25s',
                      transform: bioExpanded ? 'rotate(180deg)' : 'none',
                    }} />
                  }
                  onClick={() => setBioExpanded((v) => !v)}
                  sx={{ mt: 0.5, color: 'primary.main', fontWeight: 600, fontSize: '0.72rem', p: 0, minWidth: 0, '&:hover': { background: 'none' } }}
                >
                  {bioExpanded ? 'Show less' : 'Show more'}
                </Button>
              )}
            </Box>
          )}

          {/* ── Social links ── */}
          {item.social_links && Object.keys(item.social_links).length > 0 && (
            <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 2 }}>
              {Object.entries(item.social_links).map(([key, url]) => {
                const color = getPlatformColor(key);
                return (
                  <Chip
                    key={key}
                    label={key}
                    size="small"
                    clickable
                    component="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<LinkRoundedIcon sx={{ fontSize: '11px !important' }} />}
                    sx={{
                      height: 26, fontWeight: 700, fontSize: '0.68rem',
                      bgcolor: alpha(color, 0.1),
                      color: color,
                      border: '1px solid', borderColor: alpha(color, 0.25),
                      '& .MuiChip-icon': { color },
                      '&:hover': { bgcolor: alpha(color, 0.18) },
                      transition: 'all 0.2s',
                    }}
                  />
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   SUB-COMPONENT: Info Table
══════════════════════════════════════════ */
function InfoTable({
  items,
  onEdit,
  onDelete,
  onHardDelete,
  onRestore,
  t,
}: {
  items: PersonalInfo[];
  onEdit: (item: PersonalInfo) => void;
  onDelete: (id: number) => void;
  onHardDelete: (id: number) => void;
  onRestore: (id: number) => void;
  t: ReturnType<typeof useTranslations<'dashboard.personalInfo'>>;
}) {
  const cols = ['Profile', 'Headline', 'Contact', 'Location', 'Status', 'Socials', 'Actions'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px', overflow: 'hidden',
          border: '1px solid var(--glass-border)',
          background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
        }}
      >
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                {cols.map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.06em',
                      textTransform: 'uppercase', color: 'text.secondary',
                      bgcolor: (th) => alpha(th.palette.primary.main, 0.04),
                      borderBottom: '1px solid var(--glass-border)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ opacity: item.deleted_at ? 0.6 : 1 }}
                  >
                    {/* Profile */}
                    <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar src={item.avatar_url || undefined} sx={{ width: 36, height: 36, fontSize: '0.8rem', background: 'var(--gradient-accent)' }}>
                          {!item.avatar_url && item.full_name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700} noWrap>{item.full_name}</Typography>
                          <Typography variant="caption" color="text.secondary">#{item.id} · order {item.order}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Headline */}
                    <TableCell sx={{ borderBottom: '1px solid var(--glass-border)', maxWidth: 180 }}>
                      <Typography variant="body2" noWrap sx={{
                        background: item.headline ? 'var(--gradient-accent)' : undefined,
                        WebkitBackgroundClip: item.headline ? 'text' : undefined,
                        WebkitTextFillColor: item.headline ? 'transparent' : undefined,
                        color: item.headline ? undefined : 'text.disabled',
                        fontWeight: item.headline ? 600 : 400,
                      }}>
                        {item.headline || '—'}
                      </Typography>
                    </TableCell>

                    {/* Contact */}
                    <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <Stack spacing={0.25}>
                        {item.email && (
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <EmailRoundedIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                            <Typography variant="caption" color="text.secondary" noWrap>{item.email}</Typography>
                          </Stack>
                        )}
                        {item.phone && (
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <PhoneRoundedIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                            <Typography variant="caption" color="text.secondary">{item.phone}</Typography>
                          </Stack>
                        )}
                        {!item.email && !item.phone && <Typography variant="caption" color="text.disabled">—</Typography>}
                      </Stack>
                    </TableCell>

                    {/* Location */}
                    <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                      {item.location ? (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <PlaceRoundedIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                          <Typography variant="caption" color="text.secondary" noWrap>{item.location}</Typography>
                        </Stack>
                      ) : <Typography variant="caption" color="text.disabled">—</Typography>}
                    </TableCell>

                    {/* Status */}
                    <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                      {item.deleted_at ? (
                        <Chip label="Deleted" size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 700, bgcolor: (th) => alpha(th.palette.error.main, 0.1), color: 'error.main' }} />
                      ) : item.visible ? (
                        <Chip icon={<VisibilityRoundedIcon sx={{ fontSize: '12px !important' }} />} label="Visible" size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 700, bgcolor: (th) => alpha(th.palette.success.main, 0.1), color: 'success.main', '& .MuiChip-icon': { color: 'success.main' } }} />
                      ) : (
                        <Chip icon={<VisibilityOffRoundedIcon sx={{ fontSize: '12px !important' }} />} label="Hidden" size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 700, bgcolor: (th) => alpha(th.palette.warning.main, 0.1), color: 'warning.main', '& .MuiChip-icon': { color: 'warning.main' } }} />
                      )}
                    </TableCell>

                    {/* Socials */}
                    <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                      {item.social_links && Object.keys(item.social_links).length > 0 ? (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {Object.keys(item.social_links).map((key) => (
                            <Chip
                              key={key}
                              label={key}
                              size="small"
                              clickable
                              component="a"
                              href={item.social_links![key]}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                height: 22, fontSize: '0.65rem', fontWeight: 700,
                                bgcolor: alpha(getPlatformColor(key), 0.1),
                                color: getPlatformColor(key),
                                border: '1px solid', borderColor: alpha(getPlatformColor(key), 0.2),
                              }}
                            />
                          ))}
                        </Stack>
                      ) : <Typography variant="caption" color="text.disabled">—</Typography>}
                    </TableCell>

                    {/* Actions */}
                    <TableCell sx={{ borderBottom: '1px solid var(--glass-border)', whiteSpace: 'nowrap' }}>
                      {item.deleted_at ? (
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title={t('restore')}>
                            <IconButton size="small" onClick={() => onRestore(item.id)} sx={{ borderRadius: '8px', color: 'success.main', bgcolor: (th) => alpha(th.palette.success.main, 0.08) }}>
                              <RestoreRoundedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('hardDelete')}>
                            <IconButton size="small" onClick={() => onHardDelete(item.id)} sx={{ borderRadius: '8px', color: 'error.main', bgcolor: (th) => alpha(th.palette.error.main, 0.08) }}>
                              <DeleteForeverRoundedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title={t('edit')}>
                            <IconButton size="small" onClick={() => onEdit(item)} sx={{ borderRadius: '8px', color: 'primary.main', bgcolor: (th) => alpha(th.palette.primary.main, 0.08) }}>
                              <EditRoundedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('delete')}>
                            <IconButton size="small" onClick={() => onDelete(item.id)} sx={{ borderRadius: '8px', color: 'error.main', bgcolor: (th) => alpha(th.palette.error.main, 0.08) }}>
                              <DeleteRoundedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   SUB-COMPONENT: Slide-over Form Drawer
══════════════════════════════════════════ */
function FormDrawer({
  open,
  editingId,
  formData,
  formError,
  saving,
  socialKey,
  socialValue,
  onClose,
  onSubmit,
  onFieldChange,
  onSocialKeyChange,
  onSocialValueChange,
  onAddSocial,
  onRemoveSocial,
  t,
}: {
  open: boolean;
  editingId: number | null;
  formData: FormData;
  formError: string | null;
  saving: boolean;
  socialKey: string;
  socialValue: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: (field: keyof FormData, value: string | boolean | number) => void;
  onSocialKeyChange: (v: string) => void;
  onSocialValueChange: (v: string) => void;
  onAddSocial: () => void;
  onRemoveSocial: (key: string) => void;
  t: ReturnType<typeof useTranslations<'dashboard.personalInfo'>>;
}) {
  const accordionSx = {
    background: 'transparent', boxShadow: 'none',
    '&::before': { display: 'none' },
    border: '1px solid var(--glass-border)', borderRadius: '12px !important',
    mb: 1.5, overflow: 'hidden',
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 500 },
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid var(--glass-border)',
          display: 'flex', flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box sx={{
        px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--glass-border)',
        background: (th) => alpha(th.palette.primary.main, 0.04),
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{
            width: 38, height: 38, borderRadius: '11px',
            background: 'var(--gradient-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: (th) => `0 4px 14px ${alpha(th.palette.primary.main, 0.3)}`,
          }}>
            {editingId
              ? <EditRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
              : <AddRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />}
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} letterSpacing="-0.02em">
              {editingId ? t('editTitle') : t('createTitle')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {editingId ? `Editing #${editingId}` : 'Fill in the details below'}
            </Typography>
          </Box>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{
          borderRadius: '10px',
          bgcolor: (th) => alpha(th.palette.text.primary, 0.06),
          '&:hover': { bgcolor: (th) => alpha(th.palette.text.primary, 0.12) },
        }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Scrollable form body */}
      <Box component="form" onSubmit={onSubmit} sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
        {formError && (
          <Alert severity="error" sx={{ borderRadius: '12px', mb: 2 }}>{formError}</Alert>
        )}

        {/* ── Basic Info ── */}
        <Accordion defaultExpanded sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BadgeRoundedIcon sx={{ fontSize: 17, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700}>{t('form.basicInfo')}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField fullWidth label={t('form.fullName')} value={formData.full_name}
                    onChange={(e) => onFieldChange('full_name', e.target.value)} required size="small" />
                </Grid>
                <Grid size={12}>
                  <TextField fullWidth label={t('form.headline')} value={formData.headline || ''}
                    onChange={(e) => onFieldChange('headline', e.target.value)} size="small" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label={t('form.email')} type="email" value={formData.email || ''}
                    onChange={(e) => onFieldChange('email', e.target.value)} size="small" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label={t('form.phone')} value={formData.phone || ''}
                    onChange={(e) => onFieldChange('phone', e.target.value)} size="small" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label={t('form.location')} value={formData.location || ''}
                    onChange={(e) => onFieldChange('location', e.target.value)} size="small" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label={t('form.website')} value={formData.website || ''}
                    onChange={(e) => onFieldChange('website', e.target.value)} size="small" />
                </Grid>
                <Grid size={12}>
                  <TextField fullWidth label={t('form.bio')} value={formData.bio || ''}
                    onChange={(e) => onFieldChange('bio', e.target.value)}
                    multiline rows={3} size="small" placeholder={t('form.bioPlaceholder')} />
                </Grid>
              </Grid>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* ── URLs & Media (with live avatar preview) ── */}
        <Accordion sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ImageRoundedIcon sx={{ fontSize: 17, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700}>{t('form.urlsSection')}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            <Stack spacing={2}>
              {/* Avatar URL + live preview */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  src={formData.avatar_url || undefined}
                  sx={{
                    width: 52, height: 52, flexShrink: 0,
                    background: 'var(--gradient-accent)',
                    border: '2px solid var(--glass-border)',
                    transition: 'all 0.3s',
                  }}
                >
                  <PersonRoundedIcon sx={{ fontSize: 24 }} />
                </Avatar>
                <ImageUrlInput
                  fullWidth label={t('form.avatarUrl')} value={formData.avatar_url || ''}
                  onChange={(e) => onFieldChange('avatar_url', e.target.value)}
                  size="small" placeholder="https://..."
                />
              </Stack>
              <TextField
                fullWidth label={t('form.resumeUrl')} value={formData.resume_url || ''}
                onChange={(e) => onFieldChange('resume_url', e.target.value)} size="small" />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* ── Social Links ── */}
        <Accordion sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LinkRoundedIcon sx={{ fontSize: 17, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700}>{t('form.socialLinks')}</Typography>
              {formData.social_links && Object.keys(formData.social_links).length > 0 && (
                <Chip
                  label={Object.keys(formData.social_links).length}
                  size="small"
                  sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: (th) => alpha(th.palette.primary.main, 0.12), color: 'primary.main' }}
                />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            <Stack spacing={1.5}>
              {/* Existing links */}
              {formData.social_links && Object.keys(formData.social_links).length > 0 && (
                <Stack spacing={0.75}>
                  {Object.entries(formData.social_links).map(([key, url]) => {
                    const color = getPlatformColor(key);
                    return (
                      <Stack key={key} direction="row" alignItems="center" spacing={1} sx={{
                        px: 1.5, py: 1, borderRadius: '10px',
                        bgcolor: alpha(color, 0.06), border: '1px solid', borderColor: alpha(color, 0.2),
                      }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                        <Typography variant="caption" fontWeight={700} sx={{ color, minWidth: 70 }}>{key}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>{url}</Typography>
                        <IconButton size="small" onClick={() => onRemoveSocial(key)} sx={{ color: 'error.main', '&:hover': { bgcolor: (th) => alpha(th.palette.error.main, 0.1) }, borderRadius: '6px' }}>
                          <CloseRoundedIcon sx={{ fontSize: 13 }} />
                        </IconButton>
                      </Stack>
                    );
                  })}
                </Stack>
              )}

              {/* Add new link row */}
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <TextField
                  label="Platform" value={socialKey} onChange={(e) => onSocialKeyChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAddSocial(); } }}
                  size="small" sx={{ width: 120 }} placeholder="github"
                />
                <TextField
                  label="URL" value={socialValue} onChange={(e) => onSocialValueChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAddSocial(); } }}
                  size="small" sx={{ flex: 1 }} placeholder="https://..."
                />
                <IconButton
                  onClick={(e) => { e.preventDefault(); onAddSocial(); }}
                  color="primary"
                  sx={{
                    mb: 0.25, borderRadius: '10px',
                    bgcolor: (th) => alpha(th.palette.primary.main, 0.1),
                    '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.18) },
                  }}
                >
                  <AddRoundedIcon />
                </IconButton>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* ── Settings ── */}
        <Accordion sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <TuneRoundedIcon sx={{ fontSize: 17, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700}>{t('form.settings')}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={3}>
              <FormControlLabel
                control={<Switch checked={formData.visible ?? true} onChange={(e) => onFieldChange('visible', e.target.checked)} />}
                label={<Typography variant="body2">{t('form.visible')}</Typography>}
              />
              <TextField
                label={t('form.order')} type="number"
                value={formData.order ?? 0}
                onChange={(e) => onFieldChange('order', parseInt(e.target.value) || 0)}
                size="small" sx={{ width: 90 }}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid var(--glass-border)', display: 'flex', gap: 1.5, flexShrink: 0 }}>
        <Button
          fullWidth variant="outlined" onClick={onClose}
          sx={{ borderRadius: '12px', borderColor: 'var(--glass-border)', color: 'text.secondary' }}
        >
          {t('form.cancel')}
        </Button>
        <Button
          fullWidth type="submit" variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={15} sx={{ color: '#fff' }} /> : <SaveRoundedIcon />}
          onClick={onSubmit}
          sx={{ borderRadius: '12px', fontWeight: 700 }}
        >
          {saving ? t('form.saving') : editingId ? t('form.update') : t('form.save')}
        </Button>
      </Box>
    </Drawer>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function PersonalInfoPage() {
  const { isLoading: authLoading } = useAuth();
  const t = useTranslations('dashboard.personalInfo');

  /* ── Data state ── */
  const [items, setItems] = useState<PersonalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  /* ── View state ── */
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  /* ── Form state ── */
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [socialKey, setSocialKey] = useState('');
  const [socialValue, setSocialValue] = useState('');

  /* ── Fetch ── */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await personalInfoService.adminGetAll({ limit: 100, include_hidden: true, include_deleted: includeDeleted });
      setItems(res.items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    } finally {
      setLoading(false);
    }
  }, [includeDeleted]);

  useEffect(() => { if (!authLoading) fetchData(); }, [authLoading, fetchData]);

  /* ── Form helpers ── */
  const openCreateForm = () => { setEditingId(null); setFormData(emptyForm); setFormError(null); setShowForm(true); };
  const openEditForm = (item: PersonalInfo) => {
    setEditingId(item.id);
    setFormData({ full_name: item.full_name, headline: item.headline || '', bio: item.bio || '', email: item.email || '', phone: item.phone || '', location: item.location || '', website: item.website || '', avatar_url: item.avatar_url || '', resume_url: item.resume_url || '', social_links: item.social_links || {}, metadata: item.metadata || {}, visible: item.visible, order: item.order });
    setFormError(null);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); setFormData(emptyForm); setFormError(null); };
  const handleFieldChange = (field: keyof FormData, value: string | boolean | number) => setFormData((p) => ({ ...p, [field]: value }));
  const addSocialLink = () => {
    if (!socialKey.trim() || !socialValue.trim()) return;
    setFormData((p) => ({ ...p, social_links: { ...p.social_links, [socialKey.trim().toLowerCase()]: socialValue.trim() } }));
    setSocialKey(''); setSocialValue('');
  };
  const removeSocialLink = (key: string) => {
    setFormData((p) => { const u = { ...p.social_links }; delete u[key]; return { ...p, social_links: u }; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) { setFormError(t('errors.nameRequired')); return; }
    setSaving(true); setFormError(null);
    try {
      if (editingId) await personalInfoService.update(editingId, formData as PersonalInfoUpdate);
      else await personalInfoService.create(formData as PersonalInfoCreate);
      closeForm(); await fetchData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : t('errors.saveFailed'));
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await personalInfoService.remove(id, false); await fetchData(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : t('errors.deleteFailed')); }
  };
  const handleHardDelete = async (id: number) => {
    try { await personalInfoService.remove(id, true); await fetchData(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : t('errors.deleteFailed')); }
  };
  const handleRestore = async (id: number) => {
    try { await personalInfoService.restore(id); await fetchData(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : t('errors.restoreFailed')); }
  };

  /* ── Loading screen ── */
  if (authLoading || loading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2, p: 4, minHeight: 400 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '14px', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: (th) => `0 8px 24px ${alpha(th.palette.primary.main, 0.35)}` }}>
            <PersonRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
        </motion.div>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>Loading profiles…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3, lg: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Stack spacing={3}>

        {/* ── Page Header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <PageHeader
            icon={<PersonRoundedIcon />}
            title={t('title')}
            subtitle={t('subtitle')}
            actions={
              <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                <FormControlLabel
                  control={<Switch size="small" checked={includeDeleted} onChange={(e) => setIncludeDeleted(e.target.checked)} />}
                  label={<Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{t('showDeleted')}</Typography>}
                />
                <ViewToggle value={viewMode} onChange={setViewMode} />
                <Button variant="contained" size="small" startIcon={<AddRoundedIcon />} onClick={openCreateForm}
                  sx={{ borderRadius: '10px', fontWeight: 700, boxShadow: (th) => `0 4px 14px ${alpha(th.palette.primary.main, 0.35)}` }}>
                  {t('create')}
                </Button>
              </Stack>
            }
          />
        </motion.div>

        {/* ── Stats bar ── */}
        {items.length > 0 && <StatsBar items={items} />}

        {/* ── Error ── */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Alert severity="error" sx={{ borderRadius: 2.5 }}>{error}</Alert>
          </motion.div>
        )}

        {/* ── Empty state ── */}
        {items.length === 0 && !error && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <Card sx={{
              background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
              border: '2px dashed var(--glass-border)', borderRadius: '20px',
            }}>
              <CardContent sx={{ py: 12, textAlign: 'center' }}>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <Box sx={{
                    width: 80, height: 80, borderRadius: '24px', mx: 'auto', mb: 3,
                    background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: (th) => `0 12px 40px ${alpha(th.palette.primary.main, 0.3)}`,
                  }}>
                    <PersonRoundedIcon sx={{ fontSize: 40, color: '#fff' }} />
                  </Box>
                </motion.div>
                <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em" gutterBottom>{t('emptyTitle')}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 360, mx: 'auto', lineHeight: 1.7 }}>{t('emptyDescription')}</Typography>
                <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreateForm}
                  sx={{ borderRadius: '12px', fontWeight: 700, px: 3, boxShadow: (th) => `0 8px 24px ${alpha(th.palette.primary.main, 0.35)}` }}>
                  {t('createFirst')}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Cards / Table ── */}
        <AnimatePresence mode="wait">
          {viewMode === 'cards' ? (
            <motion.div key="cards">
              <Stack spacing={2.5}>
                {items.map((item, index) => (
                  <InfoCard
                    key={item.id}
                    item={item}
                    index={index}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                    onHardDelete={handleHardDelete}
                    onRestore={handleRestore}
                    t={t}
                  />
                ))}
              </Stack>
            </motion.div>
          ) : (
            <InfoTable
              key="table"
              items={items}
              onEdit={openEditForm}
              onDelete={handleDelete}
              onHardDelete={handleHardDelete}
              onRestore={handleRestore}
              t={t}
            />
          )}
        </AnimatePresence>

      </Stack>

      {/* ── Slide-over Form Drawer ── */}
      <FormDrawer
        open={showForm}
        editingId={editingId}
        formData={formData}
        formError={formError}
        saving={saving}
        socialKey={socialKey}
        socialValue={socialValue}
        onClose={closeForm}
        onSubmit={handleSubmit}
        onFieldChange={handleFieldChange}
        onSocialKeyChange={setSocialKey}
        onSocialValueChange={setSocialValue}
        onAddSocial={addSocialLink}
        onRemoveSocial={removeSocialLink}
        t={t}
      />
    </Box>
  );
}
