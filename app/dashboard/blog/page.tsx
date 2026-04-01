'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { blogService } from '@/services';
import type { BlogPost, BlogPostCreate, BlogPostUpdate } from '@/types';
import { PageHeader } from '@/app/dashboard/_components';
import ImageUrlInput from '@/app/components/shared/ImageUrlInput';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Drawer from '@mui/material/Drawer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { alpha } from '@mui/material/styles';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import ViewModuleRoundedIcon from '@mui/icons-material/ViewModuleRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import BrushRoundedIcon from '@mui/icons-material/BrushRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';

type FormData = BlogPostCreate & { id?: number };

const emptyForm: FormData = {
  title: '',
  slug: '',
  description: '',
  content: '',
  images: [],
  metadata: {},
  visible: true,
  published_at: null,
};

// ─── ViewToggle ───────────────────────────────────────────────────────────────
function ViewToggle({ view, onChange }: { view: 'grid' | 'table'; onChange: (v: 'grid' | 'table') => void }) {
  return (
    <Stack direction="row" spacing={0.5} sx={{
      bgcolor: (th) => alpha(th.palette.text.primary, 0.04),
      borderRadius: 2, p: 0.5,
    }}>
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
function StatsBar({ items }: { items: BlogPost[] }) {
  const published = items.filter((i) => i.published_at && new Date(i.published_at) <= new Date() && !i.deleted_at).length;
  const scheduled = items.filter((i) => i.published_at && new Date(i.published_at) > new Date() && !i.deleted_at).length;
  const draft = items.filter((i) => !i.published_at && !i.deleted_at).length;
  const deleted = items.filter((i) => i.deleted_at).length;
  const stats = [
    { label: 'Total', value: items.length, color: '#6366f1' },
    { label: 'Published', value: published, color: '#10b981' },
    { label: 'Scheduled', value: scheduled, color: '#f59e0b' },
    { label: 'Draft', value: draft, color: '#6b7280' },
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

// ─── BlogCard ─────────────────────────────────────────────────────────────────
function BlogCard({ item, onEdit, onDelete, onHardDelete, onRestore, t }: {
  item: BlogPost;
  onEdit: (item: BlogPost) => void;
  onDelete: (id: number) => void;
  onHardDelete: (id: number) => void;
  onRestore: (id: number) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const meta = (item.metadata || {}) as Record<string, unknown>;
  const tags = Array.isArray(meta.tags) ? (meta.tags as string[]) : [];
  const category = typeof meta.category === 'string' ? meta.category : null;

  const getPostStatus = (): { label: string; color: string } => {
    if (!item.published_at) return { label: t('statusDraft'), color: '#6b7280' };
    if (new Date(item.published_at) > new Date()) return { label: t('statusScheduled'), color: '#f59e0b' };
    return { label: t('statusPublished'), color: '#6366f1' };
  };
  const status = getPostStatus();

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : null;

  return (
    <Card sx={{
      display: 'flex', flexDirection: 'column', height: '100%',
      position: 'relative', overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: 'var(--shadow-elevated)' },
    }}>
      {/* Thumbnail */}
      {item.images && item.images.length > 0 ? (
        <CardMedia component="img" height="160" image={item.images[0]} alt={item.title} sx={{ objectFit: 'cover' }} />
      ) : (
        <Box sx={{
          height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--gradient-hero)', position: 'relative',
          '&::after': {
            content: '""', position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)',
          },
        }}>
          <ArticleRoundedIcon sx={{ fontSize: 36, color: 'text.disabled', opacity: 0.5 }} />
        </Box>
      )}

      {/* Badges */}
      <Stack direction="row" spacing={0.75} sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2, flexWrap: 'wrap' }}>
        <Chip label={status.label} size="small" sx={{
          fontWeight: 600, fontSize: '0.68rem', backdropFilter: 'blur(12px)',
          bgcolor: alpha(status.color, 0.85), color: '#fff',
        }} />
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
          /{item.slug} · #{item.id}
        </Typography>

        {category && (
          <Box sx={{ mt: 0.75 }}>
            <Chip label={category} size="small" sx={{
              fontWeight: 600, fontSize: '0.68rem', height: 22,
              bgcolor: (th) => alpha(th.palette.primary.main, 0.08), color: 'primary.main',
            }} />
          </Box>
        )}

        {item.description && (
          <Typography variant="body2" color="text.secondary" sx={{
            mt: 1, display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6, fontSize: '0.8rem',
          }}>
            {item.description}
          </Typography>
        )}

        {tags.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1.25 }}>
            {tags.slice(0, 4).map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" sx={{
                fontWeight: 600, fontSize: '0.65rem', height: 22,
                borderColor: (th) => alpha(th.palette.primary.main, 0.25), color: 'primary.main',
                bgcolor: (th) => alpha(th.palette.primary.main, 0.05),
              }} />
            ))}
          </Stack>
        )}

        {item.published_at && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.25 }}>
            {new Date(item.published_at) > new Date()
              ? <ScheduleRoundedIcon sx={{ fontSize: 13, color: 'warning.main' }} />
              : <PublishRoundedIcon sx={{ fontSize: 13, color: 'primary.main' }} />}
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {formatDate(item.published_at)}
            </Typography>
          </Stack>
        )}

        {item.images && item.images.length > 0 && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
            <ImageRoundedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {item.images.length} {t('imagesCount')}
            </Typography>
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
              <IconButton size="small" onClick={() => onEdit(item)} sx={{
                color: 'primary.main',
                '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.1) },
              }}>
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

// ─── BlogTable ────────────────────────────────────────────────────────────────
function BlogTable({ items, onEdit, onDelete, onHardDelete, onRestore, t }: {
  items: BlogPost[];
  onEdit: (item: BlogPost) => void;
  onDelete: (id: number) => void;
  onHardDelete: (id: number) => void;
  onRestore: (id: number) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const getStatus = (item: BlogPost): { label: string; color: string } => {
    if (!item.published_at) return { label: t('statusDraft'), color: '#6b7280' };
    if (new Date(item.published_at) > new Date()) return { label: t('statusScheduled'), color: '#f59e0b' };
    return { label: t('statusPublished'), color: '#6366f1' };
  };
  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid var(--glass-border)', boxShadow: 'none' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', py: 1.5, bgcolor: (th) => alpha(th.palette.text.primary, 0.03) } }}>
            <TableCell>Post</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Published</TableCell>
            <TableCell>Images</TableCell>
            <TableCell>Visibility</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence>
            {items.map((item) => {
              const meta = (item.metadata || {}) as Record<string, unknown>;
              const category = typeof meta.category === 'string' ? meta.category : null;
              const status = getStatus(item);
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
                      {item.images && item.images.length > 0 ? (
                        <Avatar variant="rounded" src={item.images[0]} sx={{ width: 36, height: 36, borderRadius: 1.5 }} />
                      ) : (
                        <Avatar variant="rounded" sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: (th) => alpha(th.palette.primary.main, 0.1) }}>
                          <ArticleRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 220 }}>{item.title}</Typography>
                        <Typography variant="caption" color="text.disabled">#{item.id}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>/{item.slug}</Typography>
                  </TableCell>
                  <TableCell>
                    {category ? (
                      <Chip label={category} size="small" sx={{ fontWeight: 600, fontSize: '0.68rem', height: 22, bgcolor: (th) => alpha(th.palette.primary.main, 0.08), color: 'primary.main' }} />
                    ) : <Typography variant="caption" color="text.disabled">—</Typography>}
                  </TableCell>
                  <TableCell>
                    <Chip label={status.label} size="small" sx={{ fontWeight: 600, fontSize: '0.68rem', height: 22, bgcolor: alpha(status.color, 0.12), color: status.color }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">{formatDate(item.published_at)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">{item.images?.length ?? 0}</Typography>
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

// ─── FormDrawer ───────────────────────────────────────────────────────────────
function FormDrawer({ open, onClose, editingId, formData, setFormData, onSubmit, saving, formError, t,
  imageUrl, setImageUrl, metaKey, setMetaKey, metaValue, setMetaValue, publishStatus, setPublishStatus,
}: {
  open: boolean; onClose: () => void; editingId: number | null;
  formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void; saving: boolean; formError: string | null;
  t: ReturnType<typeof useTranslations>;
  imageUrl: string; setImageUrl: (v: string) => void;
  metaKey: string; setMetaKey: (v: string) => void;
  metaValue: string; setMetaValue: (v: string) => void;
  publishStatus: 'draft' | 'published' | 'scheduled'; setPublishStatus: (v: 'draft' | 'published' | 'scheduled') => void;
}) {

  const generateSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value, ...(!editingId ? { slug: generateSlug(value) } : {}) }));
  };
  const handleFieldChange = (field: keyof FormData, value: string | boolean | number | string[] | null | Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const addImage = () => {
    if (!imageUrl.trim()) return;
    setFormData((prev) => ({ ...prev, images: [...(prev.images || []), imageUrl.trim()] }));
    setImageUrl('');
  };
  const addImages = (urls: string[]) => {
    if (!urls.length) return;
    setFormData((prev) => ({ ...prev, images: [...(prev.images || []), ...urls] }));
    setImageUrl('');
  };
  const removeImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: (prev.images || []).filter((_: string, i: number) => i !== index) }));
  };
  const reorderImages = (urls: string[]) => setFormData((prev) => ({ ...prev, images: urls }));
  const addMetadata = () => {
    if (!metaKey.trim() || !metaValue.trim()) return;
    let parsedValue: unknown = metaValue.trim();
    try { parsedValue = JSON.parse(metaValue.trim()); } catch { /* keep as string */ }
    setFormData((prev) => ({ ...prev, metadata: { ...prev.metadata, [metaKey.trim()]: parsedValue } }));
    setMetaKey(''); setMetaValue('');
  };
  const removeMetadata = (key: string) => {
    setFormData((prev) => { const updated = { ...prev.metadata }; delete updated[key]; return { ...prev, metadata: updated }; });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{
      sx: {
        width: { xs: '100%', sm: 520 }, p: 0,
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

            {/* Basic Info */}
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: 'transparent', '&::before': { display: 'none' }, border: '1px solid var(--glass-border)', borderRadius: '12px !important' }}>
              <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={{ px: 2, minHeight: 48, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ArticleRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight={700}>{t('form.basicInfo')}</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pb: 2 }}>
                <Stack spacing={2}>
                  <TextField fullWidth label={t('form.title')} value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required size="small" />
                  <TextField fullWidth label={t('form.slug')} value={formData.slug || ''} onChange={(e) => handleFieldChange('slug', e.target.value)} size="small" helperText={t('form.slugHint')} />
                  <TextField fullWidth label={t('form.description')} value={formData.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} size="small" placeholder={t('form.descriptionPlaceholder')} />
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Content */}
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: 'transparent', '&::before': { display: 'none' }, border: '1px solid var(--glass-border)', borderRadius: '12px !important' }}>
              <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={{ px: 2, minHeight: 48, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <BrushRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight={700}>{t('form.content')}</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pb: 2 }}>
                <TextField fullWidth multiline rows={8} value={formData.content || ''} onChange={(e) => handleFieldChange('content', e.target.value)} size="small" placeholder={t('form.contentPlaceholder')} sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: 13 } }} />
              </AccordionDetails>
            </Accordion>

            {/* Publishing */}
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: 'transparent', '&::before': { display: 'none' }, border: '1px solid var(--glass-border)', borderRadius: '12px !important' }}>
              <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={{ px: 2, minHeight: 48, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PublishRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight={700}>{t('form.publishing')}</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pb: 2 }}>
                <Stack spacing={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>{t('form.publishStatus')}</Typography>
                  <ToggleButtonGroup
                    value={publishStatus}
                    exclusive
                    onChange={(_, val) => {
                      if (!val) return;
                      setPublishStatus(val);
                      if (val === 'draft') handleFieldChange('published_at', null);
                      else if (val === 'published') handleFieldChange('published_at', new Date().toISOString());
                    }}
                    size="small"
                    fullWidth
                  >
                    <ToggleButton value="draft" sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
                      <ScheduleRoundedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      {t('form.publishDraft')}
                    </ToggleButton>
                    <ToggleButton value="published" sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
                      <PublishRoundedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      {t('form.publishNow')}
                    </ToggleButton>
                    <ToggleButton value="scheduled" sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
                      <CheckRoundedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      {t('form.publishSchedule')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                  {publishStatus === 'scheduled' && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label={t('form.publishedAt')}
                        value={formData.published_at ? dayjs(formData.published_at) : null}
                        onChange={(newValue) =>
                          handleFieldChange('published_at', newValue ? newValue.toISOString() : null)
                        }
                        disablePast
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                          },
                          popper: {
                            sx: {
                              '& .MuiPaper-root': {
                                borderRadius: 3,
                                boxShadow: 'var(--shadow-elevated)',
                                border: '1px solid var(--glass-border)',
                                background: 'var(--glass-bg)',
                                backdropFilter: 'blur(20px)',
                              },
                            },
                          },
                          day: {
                            sx: {
                              borderRadius: 2,
                              '&.Mui-selected': {
                                background: 'var(--gradient-accent)',
                                boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                              },
                              '&.MuiPickersDay-today:not(.Mui-selected)': {
                                borderColor: 'primary.main',
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                  <Typography variant="caption" color="text.secondary">{t('form.publishHint')}</Typography>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Images */}
            <Accordion disableGutters elevation={0} sx={{ bgcolor: 'transparent', '&::before': { display: 'none' }, border: '1px solid var(--glass-border)', borderRadius: '12px !important' }}>
              <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={{ px: 2, minHeight: 48, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ImageRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight={700}>{t('form.images')}</Typography>
                  {formData.images && formData.images.length > 0 && (
                    <Chip label={formData.images.length} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: (th) => alpha(th.palette.primary.main, 0.1), color: 'primary.main' }} />
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pb: 2 }}>
                <Stack spacing={1.5}>
                  {formData.images && formData.images.length > 0 && (
                    <Reorder.Group as="div" axis="y" values={formData.images ?? []} onReorder={reorderImages}
                      style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {formData.images.map((imgUrl: string, index: number) => (
                        <Reorder.Item as="div" key={imgUrl} value={imgUrl} style={{ cursor: 'grab' }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1, borderRadius: 2, bgcolor: (th) => alpha(th.palette.divider, 0.04), border: '1px solid', borderColor: 'divider', userSelect: 'none' }}>
                            <DragIndicatorRoundedIcon sx={{ fontSize: 15, color: 'text.disabled', flexShrink: 0 }} />
                            <Avatar variant="rounded" src={imgUrl} sx={{ width: 36, height: 36, borderRadius: 1.5 }}>
                              <ImageRoundedIcon />
                            </Avatar>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>{imgUrl}</Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>#{index + 1}</Typography>
                            <IconButton size="small" color="error" onPointerDown={(e) => e.stopPropagation()} onClick={() => removeImage(index)}>
                              <CloseRoundedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )}
                  <Stack direction="row" spacing={1} alignItems="flex-end">
                    <ImageUrlInput label={t('form.addImage')} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }} size="small" sx={{ flex: 1 }} placeholder="https://..." onBulkAdd={addImages} />
                    <IconButton onClick={(e) => { e.preventDefault(); addImage(); }} color="primary" sx={{ bgcolor: (th) => alpha(th.palette.primary.main, 0.08), '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.14) } }}>
                      <AddRoundedIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Metadata */}
            <Accordion disableGutters elevation={0} sx={{ bgcolor: 'transparent', '&::before': { display: 'none' }, border: '1px solid var(--glass-border)', borderRadius: '12px !important' }}>
              <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={{ px: 2, minHeight: 48, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <DataObjectRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight={700}>{t('form.metadata')}</Typography>
                  {formData.metadata && Object.keys(formData.metadata).length > 0 && (
                    <Chip label={Object.keys(formData.metadata).length} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: (th) => alpha(th.palette.primary.main, 0.1), color: 'primary.main' }} />
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pb: 2 }}>
                <Stack spacing={1.5}>
                  <Typography variant="caption" color="text.secondary">{t('form.metadataHint')}</Typography>
                  {formData.metadata && Object.entries(formData.metadata).map(([key, val]) => (
                    <Stack key={key} direction="row" alignItems="center" spacing={1} sx={{ p: 1, borderRadius: 2, bgcolor: (th) => alpha(th.palette.divider, 0.04), border: '1px solid', borderColor: 'divider' }}>
                      <Chip label={key} size="small" sx={{ fontWeight: 700, minWidth: 70, bgcolor: (th) => alpha(th.palette.primary.main, 0.1), color: 'primary.main' }} />
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
                        {typeof val === 'string' ? val : JSON.stringify(val)}
                      </Typography>
                      <IconButton size="small" color="error" onClick={() => removeMetadata(key)}>
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}
                  <Stack direction="row" spacing={1} alignItems="flex-end">
                    <TextField label={t('form.metaKey')} value={metaKey} onChange={(e) => setMetaKey(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMetadata(); } }} size="small" sx={{ width: 130 }} placeholder="category" />
                    <TextField label={t('form.metaValue')} value={metaValue} onChange={(e) => setMetaValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMetadata(); } }} size="small" sx={{ flex: 1 }} placeholder='Tech or ["react","node"]' />
                    <IconButton onClick={(e) => { e.preventDefault(); addMetadata(); }} color="primary" sx={{ bgcolor: (th) => alpha(th.palette.primary.main, 0.08), '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.14) } }}>
                      <AddRoundedIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Settings */}
            <Accordion disableGutters elevation={0} sx={{ bgcolor: 'transparent', '&::before': { display: 'none' }, border: '1px solid var(--glass-border)', borderRadius: '12px !important' }}>
              <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={{ px: 2, minHeight: 48, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TuneRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight={700}>{t('form.settings')}</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pb: 2 }}>
                <FormControlLabel
                  control={<Switch checked={formData.visible ?? true} onChange={(e) => handleFieldChange('visible', e.target.checked)} />}
                  label={<Typography variant="body2">{t('form.visible')}</Typography>}
                />
              </AccordionDetails>
            </Accordion>
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

// ─── BlogPage ─────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const { isLoading: authLoading } = useAuth();
  const t = useTranslations('dashboard.blog');

  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [imageUrl, setImageUrl] = useState('');
  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState('');
  const [useScheduledDate, setUseScheduledDate] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await blogService.adminGetAll({ limit: 100, include_hidden: true, include_deleted: includeDeleted, include_scheduled: true });
      setItems(res.items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally { setLoading(false); }
  }, [includeDeleted]);

  useEffect(() => { if (!authLoading) fetchData(); }, [authLoading, fetchData]);

  const openCreateForm = () => {
    setEditingId(null); setFormData(emptyForm); setFormError(null);
    setImageUrl(''); setMetaKey(''); setMetaValue(''); setUseScheduledDate(false); setPublishStatus('draft');
    setShowForm(true);
  };
  const openEditForm = (item: BlogPost) => {
    setEditingId(item.id);
    setFormData({ title: item.title, slug: item.slug, description: item.description || '', content: item.content || '', images: item.images || [], metadata: item.metadata || {}, visible: item.visible, published_at: item.published_at });
    setFormError(null);
    setImageUrl(''); setMetaKey(''); setMetaValue('');
    if (!item.published_at) setPublishStatus('draft');
    else if (new Date(item.published_at) > new Date()) setPublishStatus('scheduled');
    else setPublishStatus('published');
    setUseScheduledDate(false);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false); setEditingId(null); setFormData(emptyForm); setFormError(null);
    setImageUrl(''); setMetaKey(''); setMetaValue(''); setUseScheduledDate(false); setPublishStatus('draft');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { setFormError(t('errors.titleRequired')); return; }
    setSaving(true); setFormError(null);
    try {
      if (editingId) { await blogService.update(editingId, { ...formData } as BlogPostUpdate); }
      else { await blogService.create({ ...formData } as BlogPostCreate); }
      closeForm(); await fetchData();
    } catch (err: unknown) { setFormError(err instanceof Error ? err.message : t('errors.saveFailed')); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await blogService.remove(id, false); await fetchData(); }
    catch (err: unknown) { console.error(err); }
  };
  const handleHardDelete = async (id: number) => {
    try { await blogService.remove(id, true); await fetchData(); }
    catch (err: unknown) { console.error(err); }
  };
  const handleRestore = async (id: number) => {
    try { await blogService.restore(id); await fetchData(); }
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
            <ArticleRoundedIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3, lg: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Stack spacing={3}>
        <PageHeader
          icon={<ArticleRoundedIcon />}
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
                <ArticleRoundedIcon sx={{ fontSize: 36, color: '#fff' }} />
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
                  <Grid key={item.id} size={{ xs: 12, lg: 6 }}>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.25 }} style={{ height: '100%' }}>
                      <BlogCard item={item} onEdit={openEditForm} onDelete={handleDelete} onHardDelete={handleHardDelete} onRestore={handleRestore} t={t} />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          ) : (
            <motion.div key="table" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <BlogTable items={items} onEdit={openEditForm} onDelete={handleDelete} onHardDelete={handleHardDelete} onRestore={handleRestore} t={t} />
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>

      <FormDrawer
        open={showForm} onClose={closeForm} editingId={editingId}
        formData={formData} setFormData={setFormData}
        onSubmit={handleSubmit} saving={saving} formError={formError} t={t}
        imageUrl={imageUrl} setImageUrl={setImageUrl}
        metaKey={metaKey} setMetaKey={setMetaKey}
        metaValue={metaValue} setMetaValue={setMetaValue}
        publishStatus={publishStatus} setPublishStatus={setPublishStatus}
      />
    </Box>
  );
}
