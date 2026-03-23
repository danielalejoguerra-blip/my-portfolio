'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { skillService } from '@/services';
import type { Skill, SkillCreate, SkillUpdate } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Drawer from '@mui/material/Drawer';
import { alpha } from '@mui/material/styles';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ViewModuleRoundedIcon from '@mui/icons-material/ViewModuleRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';

import { PageHeader } from '../_components';

type FormData = SkillCreate & { id?: number };

const emptyForm: FormData = {
  title: '',
  slug: '',
  description: '',
  metadata: {},
  visible: true,
  order: 0,
};

// ─── ViewToggle ───────────────────────────────────────────────────────────────
function ViewToggle({ view, onChange }: { view: 'grid' | 'table'; onChange: (v: 'grid' | 'table') => void }) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ bgcolor: (th) => alpha(th.palette.text.primary, 0.04), borderRadius: 2, p: 0.5 }}>
      {(['grid', 'table'] as const).map((v) => (
        <IconButton key={v} size="small" onClick={() => onChange(v)} sx={{
          borderRadius: 1.5,
          color: view === v ? 'primary.main' : 'text.secondary',
          bgcolor: view === v ? (th) => alpha(th.palette.primary.main, 0.1) : 'transparent',
          '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.08) },
          transition: 'all 0.2s',
        }}>
          {v === 'grid' ? <ViewModuleRoundedIcon fontSize="small" /> : <TableRowsRoundedIcon fontSize="small" />}
        </IconButton>
      ))}
    </Stack>
  );
}

// ─── StatsBar ─────────────────────────────────────────────────────────────────
function StatsBar({ items }: { items: Skill[] }) {
  const visible = items.filter((i) => i.visible && !i.deleted_at).length;
  const hidden = items.filter((i) => !i.visible && !i.deleted_at).length;
  const deleted = items.filter((i) => i.deleted_at).length;
  const stats = [
    { label: 'Total', value: items.length, color: '#6366f1' },
    { label: 'Visible', value: visible, color: '#10b981' },
    { label: 'Hidden', value: hidden, color: '#f59e0b' },
    { label: 'Deleted', value: deleted, color: '#ef4444' },
  ];
  return (
    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
      {stats.map((s) => (
        <Box key={s.label} sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          px: 2, py: 1, borderRadius: 2,
          bgcolor: alpha(s.color, 0.08),
          border: '1px solid', borderColor: alpha(s.color, 0.15),
        }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color }} />
          <Typography variant="caption" fontWeight={700} sx={{ color: s.color }}>{s.value}</Typography>
          <Typography variant="caption" color="text.secondary">{s.label}</Typography>
        </Box>
      ))}
    </Stack>
  );
}

// ─── InlineConfirmButton ──────────────────────────────────────────────────────
function InlineConfirmButton({ onConfirm, color = 'error', icon, label, confirmLabel }: {
  onConfirm: () => void; color?: 'error' | 'warning'; icon: React.ReactNode;
  label?: string; confirmLabel?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleClick = () => {
    if (confirming) { onConfirm(); setConfirming(false); if (timerRef.current) clearTimeout(timerRef.current); return; }
    setConfirming(true);
    timerRef.current = setTimeout(() => setConfirming(false), 3000);
  };
  return (
    <Tooltip title={confirming ? (confirmLabel ?? 'Confirm?') : (label ?? '')}>
      <IconButton size="small" color={color} onClick={handleClick} sx={{
        transition: 'all 0.2s',
        bgcolor: confirming ? (th) => alpha(th.palette[color].main, 0.15) : 'transparent',
        '&:hover': { bgcolor: (th) => alpha(th.palette[color].main, 0.12) },
      }}>
        {confirming ? <CheckRoundedIcon fontSize="small" /> : icon}
      </IconButton>
    </Tooltip>
  );
}

// ─── SkillCard ────────────────────────────────────────────────────────────────
function SkillCard({ item, onEdit, onDelete, onHardDelete, onRestore, t }: {
  item: Skill;
  onEdit: (item: Skill) => void;
  onDelete: (id: number) => void;
  onHardDelete: (id: number) => void;
  onRestore: (id: number) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const meta = (item.metadata || {}) as Record<string, unknown>;
  const level = typeof meta.level === 'string' ? meta.level : null;
  const category = typeof meta.category === 'string' ? meta.category : null;
  const icon = typeof meta.icon === 'string' ? meta.icon : null;
  const techs = Array.isArray(meta.technologies) ? (meta.technologies as string[]) : [];

  return (
    <Card sx={{
      display: 'flex', flexDirection: 'column', height: '100%',
      position: 'relative', overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: 'var(--shadow-elevated)' },
    }}>
      {/* Gradient header */}
      <Box sx={{
        height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--gradient-hero)', position: 'relative',
        '&::after': { content: '""', position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)' },
      }}>
        {icon
          ? <Typography variant="h4" sx={{ position: 'relative', zIndex: 1 }}>{icon}</Typography>
          : <BuildRoundedIcon sx={{ fontSize: 30, color: 'text.disabled', opacity: 0.5 }} />}
      </Box>

      {/* Badges */}
      <Stack direction="row" spacing={0.75} sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
        {!item.visible && (
          <Chip icon={<VisibilityOffRoundedIcon />} label={t('hidden')} size="small" sx={{
            fontWeight: 600, fontSize: '0.68rem', backdropFilter: 'blur(12px)',
            bgcolor: (th) => alpha(th.palette.text.primary, 0.6), color: '#fff',
            '& .MuiChip-icon': { color: '#fff' },
          }} />
        )}
        {item.deleted_at && (
          <Chip label={t('deleted')} size="small" sx={{
            fontWeight: 600, fontSize: '0.68rem',
            bgcolor: (th) => alpha(th.palette.error.main, 0.85), color: '#fff', backdropFilter: 'blur(12px)',
          }} />
        )}
      </Stack>

      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} noWrap>{item.title}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
          /{item.slug} · #{item.id} · order: {item.order}
        </Typography>

        {(level || category) && (
          <Stack direction="row" spacing={0.75} sx={{ mt: 1 }}>
            {level && <Chip label={level} size="small" sx={{
              fontWeight: 600, fontSize: '0.68rem', height: 22,
              bgcolor: (th) => alpha(th.palette.primary.main, 0.1), color: 'primary.main',
              border: '1px solid', borderColor: (th) => alpha(th.palette.primary.main, 0.25),
            }} />}
            {category && <Chip label={category} size="small" sx={{
              fontWeight: 600, fontSize: '0.68rem', height: 22,
              bgcolor: (th) => alpha(th.palette.secondary.main, 0.1), color: 'secondary.main',
              border: '1px solid', borderColor: (th) => alpha(th.palette.secondary.main, 0.25),
            }} />}
          </Stack>
        )}

        {item.description && (
          <Typography variant="body2" color="text.secondary" sx={{
            mt: 1, display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6, fontSize: '0.8rem',
          }}>
            {item.description}
          </Typography>
        )}

        {techs.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1.25 }}>
            {techs.slice(0, 5).map((tech) => (
              <Chip key={tech} label={tech} size="small" variant="outlined" sx={{
                fontWeight: 600, fontSize: '0.65rem', height: 22,
                borderColor: (th) => alpha(th.palette.primary.main, 0.25), color: 'primary.main',
                bgcolor: (th) => alpha(th.palette.primary.main, 0.05),
              }} />
            ))}
          </Stack>
        )}
      </CardContent>

      <Divider />
      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5} sx={{ px: 1.5, py: 1 }}>
        {item.deleted_at ? (
          <>
            <Tooltip title={t('restore')}>
              <IconButton size="small" color="primary" onClick={() => onRestore(item.id)}>
                <RestoreRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <InlineConfirmButton onConfirm={() => onHardDelete(item.id)} color="error" icon={<DeleteForeverRoundedIcon fontSize="small" />} label={t('hardDelete')} confirmLabel={t('confirmHardDelete')} />
          </>
        ) : (
          <>
            <Tooltip title={t('edit')}>
              <IconButton size="small" onClick={() => onEdit(item)} sx={{ color: 'primary.main', '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.1) } }}>
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <InlineConfirmButton onConfirm={() => onDelete(item.id)} icon={<DeleteRoundedIcon fontSize="small" />} label={t('delete')} confirmLabel={t('confirmDelete')} />
          </>
        )}
      </Stack>
    </Card>
  );
}

// ─── SkillTable ───────────────────────────────────────────────────────────────
function SkillTable({ items, onEdit, onDelete, onHardDelete, onRestore, t }: {
  items: Skill[];
  onEdit: (item: Skill) => void;
  onDelete: (id: number) => void;
  onHardDelete: (id: number) => void;
  onRestore: (id: number) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid var(--glass-border)', boxShadow: 'none' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', py: 1.5, bgcolor: (th) => alpha(th.palette.text.primary, 0.03) } }}>
            <TableCell>Skill</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Visibility</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence>
            {items.map((item) => {
              const meta = (item.metadata || {}) as Record<string, unknown>;
              const level = typeof meta.level === 'string' ? meta.level : null;
              const category = typeof meta.category === 'string' ? meta.category : null;
              const icon = typeof meta.icon === 'string' ? meta.icon : null;
              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  style={{ borderBottom: '1px solid var(--glass-border)' }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: (th) => alpha(th.palette.primary.main, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {icon
                          ? <Typography variant="body1">{icon}</Typography>
                          : <BuildRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 200 }}>{item.title}</Typography>
                        <Typography variant="caption" color="text.disabled">#{item.id}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>/{item.slug}</Typography>
                  </TableCell>
                  <TableCell>
                    {level
                      ? <Chip label={level} size="small" sx={{ fontWeight: 600, fontSize: '0.68rem', height: 22, bgcolor: (th) => alpha(th.palette.primary.main, 0.08), color: 'primary.main' }} />
                      : <Typography variant="caption" color="text.disabled">—</Typography>}
                  </TableCell>
                  <TableCell>
                    {category
                      ? <Chip label={category} size="small" sx={{ fontWeight: 600, fontSize: '0.68rem', height: 22, bgcolor: (th) => alpha(th.palette.secondary.main, 0.08), color: 'secondary.main' }} />
                      : <Typography variant="caption" color="text.disabled">—</Typography>}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <SortRoundedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                      <Typography variant="caption" color="text.secondary">{item.order}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {item.visible
                      ? <Chip label="Visible" size="small" sx={{ fontWeight: 600, fontSize: '0.68rem', height: 22, bgcolor: (th) => alpha(th.palette.success.main, 0.1), color: 'success.main' }} />
                      : <Chip icon={<VisibilityOffRoundedIcon />} label="Hidden" size="small" sx={{ fontWeight: 600, fontSize: '0.68rem', height: 22, bgcolor: (th) => alpha(th.palette.text.primary, 0.06), color: 'text.secondary', '& .MuiChip-icon': { fontSize: 12 } }} />}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                      {item.deleted_at ? (
                        <>
                          <Tooltip title={t('restore')}>
                            <IconButton size="small" color="primary" onClick={() => onRestore(item.id)}>
                              <RestoreRoundedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <InlineConfirmButton onConfirm={() => onHardDelete(item.id)} color="error" icon={<DeleteForeverRoundedIcon sx={{ fontSize: 16 }} />} label={t('hardDelete')} confirmLabel={t('confirmHardDelete')} />
                        </>
                      ) : (
                        <>
                          <Tooltip title={t('edit')}>
                            <IconButton size="small" onClick={() => onEdit(item)} sx={{ color: 'primary.main', '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.1) } }}>
                              <EditRoundedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <InlineConfirmButton onConfirm={() => onDelete(item.id)} icon={<DeleteRoundedIcon sx={{ fontSize: 16 }} />} label={t('delete')} confirmLabel={t('confirmDelete')} />
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─── Emoji presets for quick selection ─────────────────────────────────────────
const SKILL_EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: 'Frontend',
    emojis: ['⚛️', '🟦', '🟧', '🎨', '🖌️', '🟩', '🌀', '💠', '🔵', '🟣', '🎭', '🖼️'],
  },
  {
    label: 'Backend',
    emojis: ['🐍', '☕', '🦀', '🐘', '🟨', '🔷', '🟢', '🦎', '🐢', '🔴', '⚙️', '🏭'],
  },
  {
    label: 'Database',
    emojis: ['🗄️', '🐬', '🍃', '📊', '🗃️', '💾', '🔑', '📋', '🗂️', '📈'],
  },
  {
    label: 'Cloud & DevOps',
    emojis: ['🐳', '☁️', '🔧', '🏗️', '🚀', '⚡', '🌐', '🔌', '📦', '🛰️', '🌩️', '🔁'],
  },
  {
    label: 'Mobile',
    emojis: ['📱', '🍎', '🤖', '📲', '🗺️', '📡'],
  },
  {
    label: 'AI & Science',
    emojis: ['🤖', '🧠', '🔬', '🧪', '📡', '🔭', '🧬', '💡', '🎯', '📐'],
  },
  {
    label: 'Tools & Other',
    emojis: ['🛡️', '🔗', '🧩', '💻', '🖥️', '⌨️', '🖱️', '🔐', '🧰', '📝', '✏️', '📌'],
  },
];

const SKILL_EMOJIS = SKILL_EMOJI_GROUPS.flatMap((g) => g.emojis);

// ─── FormDrawer ───────────────────────────────────────────────────────────────
function FormDrawer({ open, onClose, editingId, formData, setFormData, onSubmit, saving, formError, t }: {
  open: boolean; onClose: () => void; editingId: number | null;
  formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void; saving: boolean; formError: string | null;
  t: ReturnType<typeof useTranslations>;
}) {
  const [techInput, setTechInput] = useState('');

  const generateSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value, ...(!editingId ? { slug: generateSlug(value) } : {}) }));
  };
  const handleFieldChange = (field: keyof FormData, value: string | boolean | number | Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const updateMeta = (key: string, value: unknown) => {
    setFormData((prev) => {
      const m = { ...(prev.metadata || {}) } as Record<string, unknown>;
      if (value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        delete m[key];
      } else {
        m[key] = value;
      }
      return { ...prev, metadata: m };
    });
  };
  const addTech = (raw: string) => {
    const tech = raw.trim();
    if (!tech) return;
    const cur = Array.isArray((formData.metadata as Record<string, unknown>)?.technologies)
      ? [...((formData.metadata as Record<string, unknown>).technologies as string[])]
      : [];
    if (!cur.includes(tech)) updateMeta('technologies', [...cur, tech]);
    setTechInput('');
  };
  const removeTech = (tech: string) => {
    const cur = Array.isArray((formData.metadata as Record<string, unknown>)?.technologies)
      ? ((formData.metadata as Record<string, unknown>).technologies as string[])
      : [];
    updateMeta('technologies', cur.filter((t) => t !== tech));
  };
  const meta = (formData.metadata || {}) as Record<string, unknown>;
  const metaIcon = typeof meta.icon === 'string' ? meta.icon : '';
  const metaLevel = typeof meta.level === 'string' ? meta.level : '';
  const metaCategory = typeof meta.category === 'string' ? meta.category : '';
  const metaTechs = Array.isArray(meta.technologies) ? (meta.technologies as string[]) : [];
  const metaYears = typeof meta.years === 'number' ? String(meta.years) : '';

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{
      sx: {
        width: { xs: '100%', sm: 480 }, p: 0,
        background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
        border: 'none', borderLeft: '1px solid var(--glass-border)',
      },
    }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2.5, borderBottom: '1px solid var(--glass-border)' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {editingId ? <EditRoundedIcon sx={{ color: '#fff', fontSize: 20 }} /> : <AddRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />}
          </Box>
          <Typography variant="h6" fontWeight={700}>{editingId ? t('editTitle') : t('createTitle')}</Typography>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{ bgcolor: (th) => alpha(th.palette.text.primary, 0.06), '&:hover': { bgcolor: (th) => alpha(th.palette.text.primary, 0.12) } }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box component="form" onSubmit={onSubmit} sx={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3, flex: 1 }}>
          <Stack spacing={2.5}>
            {formError && <Alert severity="error" sx={{ borderRadius: 2 }}>{formError}</Alert>}

            {/* Title + Slug inline */}
            <TextField fullWidth label={t('form.title')} value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required size="small" />
            <TextField fullWidth label={t('form.slug')} value={formData.slug || ''} onChange={(e) => handleFieldChange('slug', e.target.value)} size="small" helperText={t('form.slugHint')} />

            {/* Description */}
            <TextField fullWidth label={t('form.description')} value={formData.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} size="small" multiline rows={2} placeholder={t('form.descriptionPlaceholder')} />

            <Divider />

            {/* Emoji picker */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>{t('form.metaIcon')}</Typography>
              <Box sx={{
                maxHeight: 260, overflowY: 'auto',
                p: 1, borderRadius: 2, border: '1px solid var(--glass-border)',
                bgcolor: (th) => alpha(th.palette.text.primary, 0.02),
              }}>
                {SKILL_EMOJI_GROUPS.map((group) => (
                  <Box key={group.label} sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ pl: 0.5, display: 'block', mb: 0.5 }}>
                      {group.label}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {group.emojis.map((emoji) => (
                        <Box
                          key={emoji}
                          onClick={() => updateMeta('icon', metaIcon === emoji ? '' : emoji)}
                          sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 36, height: 36, borderRadius: 1.5, cursor: 'pointer',
                            fontSize: '1.2rem', transition: 'all 0.15s',
                            bgcolor: metaIcon === emoji ? (th) => alpha(th.palette.primary.main, 0.15) : 'transparent',
                            border: '2px solid',
                            borderColor: metaIcon === emoji ? 'primary.main' : 'transparent',
                            '&:hover': {
                              bgcolor: (th) => alpha(th.palette.primary.main, 0.08),
                              transform: 'scale(1.15)',
                            },
                          }}
                        >
                          {emoji}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
              {metaIcon && !SKILL_EMOJIS.includes(metaIcon) && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t('form.metaIconCustom')}: {metaIcon}
                </Typography>
              )}
              <TextField
                size="small" value={metaIcon}
                onChange={(e) => updateMeta('icon', e.target.value)}
                placeholder={t('form.metaIconCustomPlaceholder')}
                sx={{ mt: 1, width: '100%' }}
                inputProps={{ style: { fontSize: '0.85rem' } }}
              />
            </Box>

            <Divider />

            {/* Level */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.75, display: 'block' }}>{t('form.metaLevel')}</Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((lvl) => {
                  const sel = metaLevel === lvl;
                  return (
                    <Chip key={lvl} label={lvl} size="small" onClick={() => updateMeta('level', sel ? '' : lvl)} sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.72rem', transition: 'all 0.18s', bgcolor: sel ? 'primary.main' : (th) => alpha(th.palette.text.primary, 0.06), color: sel ? '#fff' : 'text.secondary', border: '1px solid', borderColor: sel ? 'primary.main' : 'transparent', '&:hover': { bgcolor: sel ? 'primary.dark' : (th) => alpha(th.palette.primary.main, 0.1), color: sel ? '#fff' : 'primary.main' } }} />
                  );
                })}
              </Stack>
            </Box>

            {/* Category */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.75, display: 'block' }}>{t('form.metaCategory')}</Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                {['Frontend', 'Backend', 'Databases', 'Tools', 'DevOps', 'Cloud', 'Mobile'].map((cat) => {
                  const sel = metaCategory === cat;
                  return (
                    <Chip key={cat} label={cat} size="small" onClick={() => updateMeta('category', sel ? '' : cat)} sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.72rem', transition: 'all 0.18s', bgcolor: sel ? 'secondary.main' : (th) => alpha(th.palette.text.primary, 0.06), color: sel ? '#fff' : 'text.secondary', border: '1px solid', borderColor: sel ? 'secondary.main' : 'transparent', '&:hover': { bgcolor: sel ? 'secondary.dark' : (th) => alpha(th.palette.secondary.main, 0.1), color: sel ? '#fff' : 'secondary.main' } }} />
                  );
                })}
              </Stack>
            </Box>

            <Divider />

            {/* Technologies */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.75, display: 'block' }}>{t('form.metaTechnologies')}</Typography>
              {metaTechs.length > 0 && (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                  {metaTechs.map((tech) => (
                    <Chip key={tech} label={tech} size="small" onDelete={() => removeTech(tech)} sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: (th) => alpha(th.palette.primary.main, 0.08), color: 'primary.main', border: '1px solid', borderColor: (th) => alpha(th.palette.primary.main, 0.2) }} />
                  ))}
                </Stack>
              )}
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField size="small" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTech(techInput); } }} placeholder="React, Node.js…" sx={{ flex: 1 }} helperText={t('form.metaTechHint')} />
                <IconButton size="small" onClick={() => addTech(techInput)} color="primary" sx={{ mt: 0.5, bgcolor: (th) => alpha(th.palette.primary.main, 0.08), '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.14) } }}>
                  <AddRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>

            {/* Years + Order + Visible inline */}
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField size="small" type="number" label={t('form.metaYears')} value={metaYears} onChange={(e) => updateMeta('years', e.target.value === '' ? '' : Number(e.target.value))} placeholder="3" sx={{ width: 100 }} inputProps={{ min: 0, max: 50 }} InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption" color="text.secondary">yr</Typography></InputAdornment> }} />
              <TextField label={t('form.order')} type="number" value={formData.order ?? 0} onChange={(e) => handleFieldChange('order', parseInt(e.target.value) || 0)} size="small" sx={{ width: 90 }} />
              <FormControlLabel
                control={<Switch checked={formData.visible ?? true} onChange={(e) => handleFieldChange('visible', e.target.checked)} />}
                label={<Typography variant="body2">{t('form.visible')}</Typography>}
              />
            </Stack>
          </Stack>
        </Box>

        {/* Footer */}
        <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ px: 3, py: 2.5, borderTop: '1px solid var(--glass-border)' }}>
          <Button onClick={onClose} sx={{ color: 'text.secondary', '&:hover': { bgcolor: (th) => alpha(th.palette.text.primary, 0.06) } }}>
            {t('form.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={16} /> : <SaveRoundedIcon />}>
            {saving ? t('form.saving') : editingId ? t('form.update') : t('form.save')}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}

// ─── SkillsPage ───────────────────────────────────────────────────────────────
export default function SkillsPage() {
  const { isLoading: authLoading } = useAuth();
  const t = useTranslations('dashboard.skills');

  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');



  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await skillService.adminGetAll({ limit: 100, include_hidden: true, include_deleted: includeDeleted });
      setItems(res.items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally { setLoading(false); }
  }, [includeDeleted]);

  useEffect(() => { if (!authLoading) fetchData(); }, [authLoading, fetchData]);

  const openCreateForm = () => {
    setEditingId(null); setFormData(emptyForm); setFormError(null);
    setShowForm(true);
  };
  const openEditForm = (item: Skill) => {
    setEditingId(item.id);
    setFormData({ title: item.title, slug: item.slug, description: item.description || '', metadata: item.metadata || {}, visible: item.visible, order: item.order });
    setFormError(null); setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false); setEditingId(null); setFormData(emptyForm); setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { setFormError(t('errors.titleRequired')); return; }
    setSaving(true); setFormError(null);
    try {
      if (editingId) { await skillService.update(editingId, { ...formData } as SkillUpdate); }
      else { await skillService.create({ ...formData } as SkillCreate); }
      closeForm(); await fetchData();
    } catch (err: unknown) { setFormError(err instanceof Error ? err.message : t('errors.saveFailed')); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await skillService.remove(id, false); await fetchData(); }
    catch (err: unknown) { console.error(err); }
  };
  const handleHardDelete = async (id: number) => {
    try { await skillService.remove(id, true); await fetchData(); }
    catch (err: unknown) { console.error(err); }
  };
  const handleRestore = async (id: number) => {
    try { await skillService.restore(id); await fetchData(); }
    catch (err: unknown) { console.error(err); }
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <Box sx={{ position: 'relative', width: 72, height: 72 }}>
          <Box sx={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 0%, #6366f1 100%)',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
          }} />
          <Box sx={{ position: 'absolute', inset: 4, borderRadius: '50%', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BuildRoundedIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3, lg: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Stack spacing={3}>
        <PageHeader
          icon={<BuildRoundedIcon />}
          title={t('title')}
          subtitle={t('subtitle')}
          actions={
            <>
              <ViewToggle view={viewMode} onChange={setViewMode} />
              <FormControlLabel
                control={<Switch size="small" checked={includeDeleted} onChange={(e) => setIncludeDeleted(e.target.checked)} />}
                label={<Typography variant="body2">{t('showDeleted')}</Typography>}
              />
              <Button variant="contained" size="small" startIcon={<AddRoundedIcon />} onClick={openCreateForm}>
                {t('create')}
              </Button>
            </>
          }
        />

        {error && <Alert severity="error" sx={{ borderRadius: 2.5 }}>{error}</Alert>}

        {items.length > 0 && <StatsBar items={items} />}

        {items.length === 0 && !error && (
          <Card>
            <CardContent sx={{ py: 10, textAlign: 'center' }}>
              <Box sx={{ width: 72, height: 72, borderRadius: 3, mx: 'auto', mb: 2.5, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: (th) => `0 8px 32px ${alpha(th.palette.primary.main, 0.25)}` }}>
                <BuildRoundedIcon sx={{ fontSize: 36, color: '#fff' }} />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>{t('emptyTitle')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360, mx: 'auto' }}>{t('emptyDescription')}</Typography>
              <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreateForm}>{t('createFirst')}</Button>
            </CardContent>
          </Card>
        )}

        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div key="grid" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Grid container spacing={2.5}>
                {items.map((item, index) => (
                  <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.25 }} style={{ height: '100%' }}>
                      <SkillCard item={item} onEdit={openEditForm} onDelete={handleDelete} onHardDelete={handleHardDelete} onRestore={handleRestore} t={t} />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          ) : (
            <motion.div key="table" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <SkillTable items={items} onEdit={openEditForm} onDelete={handleDelete} onHardDelete={handleHardDelete} onRestore={handleRestore} t={t} />
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>

      <FormDrawer
        open={showForm} onClose={closeForm} editingId={editingId}
        formData={formData} setFormData={setFormData}
        onSubmit={handleSubmit} saving={saving} formError={formError} t={t}
      />
    </Box>
  );
}
