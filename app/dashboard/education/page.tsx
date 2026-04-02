'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { educationService } from '@/services';
import type { Education, EducationCreate, EducationUpdate } from '@/types';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { PageHeader, TagInput, DynamicList, StyledDatePicker, UrlField } from '@/app/dashboard/_components';
import ImageUrlInput from '@/app/components/shared/ImageUrlInput';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ViewModuleRoundedIcon from '@mui/icons-material/ViewModuleRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import BrushRoundedIcon from '@mui/icons-material/BrushRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';

/* ─── Types ─── */
type ViewMode = 'cards' | 'table';
type FormData = EducationCreate & { id?: number };

const emptyForm: FormData = {
  title: '', slug: '', institution: '', degree_type: 'other',
  description: '', content: '',
  institution_url: '', location: '', field_of_study: '',
  start_date: '', end_date: '',
  credential_id: '', credential_url: '',
  grade: '', honors: '',
  relevant_coursework: [],
  activities: [],
  achievements: [],
  images: [], metadata: {}, visible: true, order: 0,
};

const generateSlug = (title: string) =>
  title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ══════════════════════════════════════════
   SUB-COMPONENT: View Toggle
══════════════════════════════════════════ */
function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  const t = useTranslations('dashboard.education');
  return (
    <Box sx={{
      display: 'flex', borderRadius: '12px', overflow: 'hidden',
      border: '1px solid var(--glass-border)',
      bgcolor: (th) => alpha(th.palette.background.default, 0.6),
      p: '3px', gap: '3px',
    }}>
      {(['cards', 'table'] as ViewMode[]).map((mode) => {
        const active = value === mode;
        return (
          <Tooltip key={mode} title={mode === 'cards' ? t('cardView') : t('tableView')}>
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
function StatsBar({ items }: { items: Education[] }) {
  const t = useTranslations('dashboard.education');
  const total   = items.length;
  const visible = items.filter((i) => i.visible && !i.deleted_at).length;
  const hidden  = items.filter((i) => !i.visible && !i.deleted_at).length;
  const deleted = items.filter((i) => !!i.deleted_at).length;

  const stats = [
    { label: t('stats.total'),   value: total,   color: '#6366f1' },
    { label: t('stats.visible'), value: visible, color: '#22c55e' },
    { label: t('stats.hidden'),  value: hidden,  color: '#f59e0b' },
    { label: t('stats.deleted'), value: deleted, color: '#ef4444' },
  ];

  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap">
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
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
   SUB-COMPONENT: Inline Confirm
══════════════════════════════════════════ */
function InlineConfirmButton({
  onConfirm, label, confirmLabel, color = 'error', icon, size = 'small',
}: {
  onConfirm: () => void; label: string; confirmLabel?: string;
  color?: 'error' | 'warning'; icon?: React.ReactNode; size?: 'small' | 'medium';
}) {
  const t = useTranslations('dashboard.education');
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
        <motion.div key="confirm"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}
          style={{ display: 'flex', gap: 4 }}>
          <Button size={size} color={color} variant="contained"
            startIcon={<CheckRoundedIcon sx={{ fontSize: 14 }} />}
            onClick={doConfirm}
            sx={{ fontWeight: 700, borderRadius: '8px', fontSize: '0.72rem' }}>
            {confirmLabel ?? t('confirm')}
          </Button>
          <IconButton size="small"
            onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); setConfirming(false); }}
            sx={{ borderRadius: '8px', bgcolor: (th) => alpha(th.palette.text.primary, 0.05) }}>
            <CloseRoundedIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </motion.div>
      ) : (
        <motion.div key="idle"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}>
          <Button size={size} color={color} startIcon={icon} onClick={startConfirm}
            sx={{
              fontWeight: 600, borderRadius: '8px', fontSize: '0.72rem',
              bgcolor: (th) => alpha(th.palette[color].main, 0.08),
              '&:hover': { bgcolor: (th) => alpha(th.palette[color].main, 0.15) },
            }}>
            {label}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════
   SUB-COMPONENT: Education Card
══════════════════════════════════════════ */
function EducationCard({
  item, index, onEdit, onDelete, onHardDelete, onRestore, t,
}: {
  item: Education; index: number;
  onEdit: (item: Education) => void;
  onDelete: (id: number) => void;
  onHardDelete: (id: number) => void;
  onRestore: (id: number) => void;
  t: ReturnType<typeof useTranslations<'dashboard.education'>>;
}) {
  const [descExpanded, setDescExpanded] = useState(false);
  const institution = item.institution || '';
  const degree = item.degree_type || '';
  const startDate = item.start_date || '';
  const endDate = item.end_date || '';
  const descLong = (item.description?.length ?? 0) > 130;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      layout
    >
      <Card sx={{
        height: '100%', display: 'flex', flexDirection: 'column',
        background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
        border: '1px solid var(--glass-border)', borderRadius: '20px',
        overflow: 'hidden', position: 'relative',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (th) => `0 24px 64px ${alpha(th.palette.primary.main, 0.12)}`,
          borderColor: (th) => alpha(th.palette.primary.main, 0.2),
        },
        ...(item.deleted_at && { opacity: 0.65, filter: 'grayscale(0.3)' }),
      }}>

        {/* Thumbnail */}
        {item.images && item.images.length > 0 ? (
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="180"
              image={item.images[0]}
              alt={item.title}
              sx={{ objectFit: 'cover', transition: 'transform 0.4s ease', '&:hover': { transform: 'scale(1.03)' } }}
            />
            <Box sx={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)',
            }} />
          </Box>
        ) : (
          <Box sx={{
            height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--gradient-hero)', position: 'relative',
            '&::after': {
              content: '""', position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at 40% 60%, rgba(99,102,241,0.08) 0%, transparent 70%)',
            },
          }}>
            <SchoolRoundedIcon sx={{ fontSize: 52, opacity: 0.25, color: 'primary.main' }} />
          </Box>
        )}

        {/* Status badges */}
        <Stack direction="row" spacing={0.75} sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
          {item.visible && !item.deleted_at ? (
            <Chip icon={<VisibilityRoundedIcon />} label={t('visible')} size="small" sx={{
              height: 24, fontWeight: 700, fontSize: '0.68rem', backdropFilter: 'blur(12px)',
              bgcolor: (th) => alpha('#6366f1', th.palette.mode === 'dark' ? 0.82 : 0.85),
              color: '#fff', '& .MuiChip-icon': { color: '#fff', fontSize: 12 },
            }} />
          ) : !item.deleted_at ? (
            <Chip icon={<VisibilityOffRoundedIcon />} label={t('hidden')} size="small" sx={{
              height: 24, fontWeight: 700, fontSize: '0.68rem', backdropFilter: 'blur(12px)',
              bgcolor: (th) => alpha(th.palette.text.primary, 0.6),
              color: '#fff', '& .MuiChip-icon': { color: '#fff', fontSize: 12 },
            }} />
          ) : null}
          {item.deleted_at && (
            <Chip label={t('deleted')} size="small" sx={{
              height: 24, fontWeight: 700, fontSize: '0.68rem', backdropFilter: 'blur(12px)',
              bgcolor: (th) => alpha(th.palette.error.main, 0.85), color: '#fff',
            }} />
          )}
        </Stack>

        <CardContent sx={{ flex: 1, p: 2.5, pb: 1.5 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1} sx={{ mb: 0.5 }}>
            <Typography variant="subtitle1" fontWeight={800} letterSpacing="-0.02em" sx={{
              flex: 1, lineHeight: 1.3,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {item.title}
            </Typography>
            <Chip label={`#${item.id}`} size="small" sx={{
              height: 20, fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
              bgcolor: (th) => alpha(th.palette.primary.main, 0.1), color: 'primary.main',
            }} />
          </Stack>
          <Typography variant="caption" color="text.disabled" fontWeight={500}>
            /{item.slug} · order {item.order}
          </Typography>

          {/* Institution, degree & dates */}
          {(institution || degree || startDate) && (
            <Stack spacing={0.75} sx={{ mt: 1.25 }}>
              {institution && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AccountBalanceRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>{institution}</Typography>
                </Stack>
              )}
              {degree && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <WorkspacePremiumRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">{degree}</Typography>
                </Stack>
              )}
              {startDate && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <CalendarMonthRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {startDate}{endDate ? ` — ${endDate}` : ` — ${t('present')}`}
                  </Typography>
                </Stack>
              )}
            </Stack>
          )}

          {item.description && (
            <Box sx={{ mt: 1.5 }}>
              <AnimatePresence initial={false}>
                <motion.div
                  animate={{ height: descExpanded || !descLong ? 'auto' : 44 }}
                  style={{ overflow: 'hidden' }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Typography variant="body2" color="text.secondary" lineHeight={1.65} sx={{
                    ...(!descExpanded && descLong && {
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }),
                  }}>
                    {item.description}
                  </Typography>
                </motion.div>
              </AnimatePresence>
              {descLong && (
                <Button size="small"
                  endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 15, transition: 'transform 0.25s', transform: descExpanded ? 'rotate(180deg)' : 'none' }} />}
                  onClick={() => setDescExpanded((v) => !v)}
                  sx={{ mt: 0.25, color: 'primary.main', fontWeight: 600, fontSize: '0.7rem', p: 0, minWidth: 0, '&:hover': { background: 'none' } }}>
                  {descExpanded ? t('showLess') : t('showMore')}
                </Button>
              )}
            </Box>
          )}

          {item.images && item.images.length > 0 && (
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.75 }}>
              <ImageRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {item.images.length} {t('imagesCount')}
              </Typography>
            </Stack>
          )}
        </CardContent>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.75}
          sx={{ px: 2.5, py: 1.5, borderTop: '1px solid var(--glass-border)' }}>
          {item.deleted_at ? (
            <>
              <Button size="small" color="success" startIcon={<RestoreRoundedIcon sx={{ fontSize: 14 }} />}
                onClick={() => onRestore(item.id)}
                sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '0.72rem', bgcolor: (th) => alpha(th.palette.success.main, 0.08), '&:hover': { bgcolor: (th) => alpha(th.palette.success.main, 0.15) } }}>
                {t('restore')}
              </Button>
              <InlineConfirmButton
                onConfirm={() => onHardDelete(item.id)}
                label={t('hardDelete')} confirmLabel={t('deleteForever')}
                color="error" icon={<DeleteForeverRoundedIcon sx={{ fontSize: 14 }} />}
              />
            </>
          ) : (
            <>
              <Tooltip title={t('edit')}>
                <IconButton size="small" onClick={() => onEdit(item)}
                  sx={{ borderRadius: '8px', color: 'primary.main', bgcolor: (th) => alpha(th.palette.primary.main, 0.08), '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.15) } }}>
                  <EditRoundedIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>
              <InlineConfirmButton
                onConfirm={() => onDelete(item.id)}
                label={t('delete')} confirmLabel={t('delete')}
                color="error" icon={<DeleteRoundedIcon sx={{ fontSize: 14 }} />}
              />
            </>
          )}
        </Stack>
      </Card>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   SUB-COMPONENT: Education Table
══════════════════════════════════════════ */
function EducationTable({
  items, onEdit, onDelete, onHardDelete, onRestore, t,
}: {
  items: Education[];
  onEdit: (item: Education) => void;
  onDelete: (id: number) => void;
  onHardDelete: (id: number) => void;
  onRestore: (id: number) => void;
  t: ReturnType<typeof useTranslations<'dashboard.education'>>;
}) {
  const cols = [t('table.education'), t('table.slug'), t('table.description'), t('table.institution'), t('table.degree'), t('table.period'), t('table.status'), t('table.actions')];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <Paper elevation={0} sx={{
        borderRadius: '20px', overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
      }}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                {cols.map((col) => (
                  <TableCell key={col} sx={{
                    fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: 'text.secondary',
                    bgcolor: (th) => alpha(th.palette.primary.main, 0.04),
                    borderBottom: '1px solid var(--glass-border)', whiteSpace: 'nowrap',
                  }}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {items.map((item, index) => {
                  const institution = item.institution || '';
                  const degree = item.degree_type || '';
                  const startDate = item.start_date || '';
                  const endDate = item.end_date || '';
                  return (
                    <motion.tr key={item.id}
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }} transition={{ delay: index * 0.05 }}
                      style={{ opacity: item.deleted_at ? 0.6 : 1 }}>
                      <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar variant="rounded" src={item.images?.[0] || undefined}
                            sx={{ width: 38, height: 38, borderRadius: '10px', background: 'var(--gradient-accent)', fontSize: '0.8rem' }}>
                            <SchoolRoundedIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 160 }}>{item.title}</Typography>
                            <Typography variant="caption" color="text.secondary">#{item.id} · order {item.order}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>/{item.slug}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid var(--glass-border)', maxWidth: 200 }}>
                        <Typography variant="caption" color="text.secondary" sx={{
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>{item.description || '—'}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                        {institution ? (
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <AccountBalanceRoundedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                            <Typography variant="caption" fontWeight={600} color="text.secondary">{institution}</Typography>
                          </Stack>
                        ) : <Typography variant="caption" color="text.disabled">—</Typography>}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid var(--glass-border)', maxWidth: 160 }}>
                        {degree ? (
                          <Typography variant="caption" color="text.secondary">{degree}</Typography>
                        ) : <Typography variant="caption" color="text.disabled">—</Typography>}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid var(--glass-border)', whiteSpace: 'nowrap' }}>
                        {startDate ? (
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CalendarMonthRoundedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {startDate}{endDate ? ` — ${endDate}` : ` — ${t('present')}`}
                            </Typography>
                          </Stack>
                        ) : <Typography variant="caption" color="text.disabled">—</Typography>}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                        {item.deleted_at ? (
                          <Chip label={t('deleted')} size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 700, bgcolor: (th) => alpha(th.palette.error.main, 0.1), color: 'error.main' }} />
                        ) : item.visible ? (
                          <Chip icon={<VisibilityRoundedIcon sx={{ fontSize: '12px !important' }} />} label={t('visible')} size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 700, bgcolor: (th) => alpha(th.palette.success.main, 0.1), color: 'success.main', '& .MuiChip-icon': { color: 'success.main' } }} />
                        ) : (
                          <Chip icon={<VisibilityOffRoundedIcon sx={{ fontSize: '12px !important' }} />} label={t('hidden')} size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 700, bgcolor: (th) => alpha(th.palette.warning.main, 0.1), color: 'warning.main', '& .MuiChip-icon': { color: 'warning.main' } }} />
                        )}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid var(--glass-border)', whiteSpace: 'nowrap' }}>
                        {item.deleted_at ? (
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title={t('restore')}><IconButton size="small" onClick={() => onRestore(item.id)} sx={{ borderRadius: '8px', color: 'success.main', bgcolor: (th) => alpha(th.palette.success.main, 0.08) }}><RestoreRoundedIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                            <Tooltip title={t('hardDelete')}><IconButton size="small" onClick={() => onHardDelete(item.id)} sx={{ borderRadius: '8px', color: 'error.main', bgcolor: (th) => alpha(th.palette.error.main, 0.08) }}><DeleteForeverRoundedIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                          </Stack>
                        ) : (
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title={t('edit')}><IconButton size="small" onClick={() => onEdit(item)} sx={{ borderRadius: '8px', color: 'primary.main', bgcolor: (th) => alpha(th.palette.primary.main, 0.08) }}><EditRoundedIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                            <Tooltip title={t('delete')}><IconButton size="small" onClick={() => onDelete(item.id)} sx={{ borderRadius: '8px', color: 'error.main', bgcolor: (th) => alpha(th.palette.error.main, 0.08) }}><DeleteRoundedIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                          </Stack>
                        )}
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   SUB-COMPONENT: Form Drawer
══════════════════════════════════════════ */
function FormDrawer({
  open, editingId, formData, formError, saving,
  imageUrl, metaKey, metaValue,
  onClose, onSubmit, onFieldChange, onTitleChange,
  onImageUrlChange, onAddImage, onAddImages, onRemoveImage, onReorderImages,
  onMetaKeyChange, onMetaValueChange, onAddMetadata, onRemoveMetadata,
  t,
}: {
  open: boolean; editingId: number | null; formData: FormData;
  formError: string | null; saving: boolean;
  imageUrl: string; metaKey: string; metaValue: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: (field: keyof FormData, value: unknown) => void;
  onTitleChange: (v: string) => void;
  onImageUrlChange: (v: string) => void;
  onAddImage: () => void;
  onAddImages: (urls: string[]) => void;
  onRemoveImage: (i: number) => void;
  onReorderImages: (urls: string[]) => void;
  onMetaKeyChange: (v: string) => void;
  onMetaValueChange: (v: string) => void;
  onAddMetadata: () => void;
  onRemoveMetadata: (k: string) => void;
  t: ReturnType<typeof useTranslations<'dashboard.education'>>;
}) {
  const accordionSx = {
    bgcolor: 'transparent', boxShadow: 'none',
    '&::before': { display: 'none' },
    border: '1px solid var(--glass-border)', borderRadius: '12px !important',
    mb: 1.5, overflow: 'hidden',
  };

  const accordionSummarySx = { px: 2, minHeight: 48, '& .MuiAccordionSummary-content': { my: 0.5 } };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 520 },
          background: 'var(--glass-bg)', backdropFilter: 'blur(24px)',
          borderLeft: '1px solid var(--glass-border)',
          display: 'flex', flexDirection: 'column',
        },
      }}>
      {/* Header */}
      <Box sx={{
        px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--glass-border)',
        background: (th) => alpha(th.palette.primary.main, 0.04), flexShrink: 0,
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{
            width: 38, height: 38, borderRadius: '11px', background: 'var(--gradient-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: (th) => `0 4px 14px ${alpha(th.palette.primary.main, 0.3)}`,
          }}>
            {editingId ? <EditRoundedIcon sx={{ color: '#fff', fontSize: 20 }} /> : <AddRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />}
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} letterSpacing="-0.02em">
              {editingId ? t('editTitle') : t('createTitle')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {editingId ? t('editingSubtitle', { id: String(editingId) }) : t('createSubtitle')}
            </Typography>
          </Box>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{
          borderRadius: '10px',
          bgcolor: (th) => alpha(th.palette.text.primary, 0.06),
          '&:hover': { bgcolor: (th) => alpha(th.palette.text.primary, 0.12) },
        }}><CloseRoundedIcon fontSize="small" /></IconButton>
      </Box>

      {/* Body */}
      <Box component="form" onSubmit={onSubmit} sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
        {formError && <Alert severity="error" sx={{ borderRadius: '12px', mb: 2 }}>{formError}</Alert>}

        {/* Basic Info */}
        <Accordion defaultExpanded disableGutters elevation={0} sx={accordionSx}>
          <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={accordionSummarySx}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <SchoolRoundedIcon sx={{ fontSize: 17, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700}>{t('form.basicInfo')}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            <Stack spacing={2}>
              <TextField fullWidth label={t('form.title')} value={formData.title}
                onChange={(e) => onTitleChange(e.target.value)} required size="small" />
              <TextField fullWidth label={t('form.institution')} value={formData.institution || ''}
                onChange={(e) => onFieldChange('institution', e.target.value)} required size="small" placeholder={t('form.institutionPlaceholder')} />
              <TextField fullWidth label={t('form.degreeType')} select value={formData.degree_type || 'other'}
                onChange={(e) => onFieldChange('degree_type', e.target.value)} size="small">
                {(['bachelor','master','phd','associate','bootcamp','certification','online_course','high_school','other'] as const).map((v) => (
                  <MenuItem key={v} value={v} sx={{ textTransform: 'capitalize' }}>{v.replace(/_/g, ' ')}</MenuItem>
                ))}
              </TextField>
              <TextField fullWidth label={t('form.fieldOfStudy')} value={formData.field_of_study || ''}
                onChange={(e) => onFieldChange('field_of_study', e.target.value)} size="small" placeholder={t('form.fieldOfStudyPlaceholder')} />
              <TextField fullWidth label={t('form.location')} value={formData.location || ''}
                onChange={(e) => onFieldChange('location', e.target.value)} size="small" placeholder={t('form.locationPlaceholder')} />
              <TextField fullWidth label={t('form.slug')} value={formData.slug || ''}
                onChange={(e) => onFieldChange('slug', e.target.value)} size="small" helperText={t('form.slugHint')} />
              <TextField fullWidth label={t('form.description')} value={formData.description || ''}
                onChange={(e) => onFieldChange('description', e.target.value)} size="small"
                placeholder={t('form.descriptionPlaceholder')} />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Dates & Credentials */}
        <Accordion disableGutters elevation={0} sx={accordionSx}>
          <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={accordionSummarySx}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarMonthRoundedIcon sx={{ fontSize: 17, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700}>{t('form.datesSection')}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5}>
                <StyledDatePicker label={t('form.startDate')} value={formData.start_date || null} onChange={(v) => onFieldChange('start_date', v || '')} />
                <StyledDatePicker label={t('form.endDate')} value={formData.end_date || null} onChange={(v) => onFieldChange('end_date', v || '')} helperText={t('form.endDateHint')} />
              </Stack>
              <Stack direction="row" spacing={1.5}>
                <TextField fullWidth label={t('form.grade')} value={formData.grade || ''}
                  onChange={(e) => onFieldChange('grade', e.target.value)} size="small" placeholder={t('form.gradePlaceholder')} />
                <TextField fullWidth label={t('form.honors')} value={formData.honors || ''}
                  onChange={(e) => onFieldChange('honors', e.target.value)} size="small" placeholder={t('form.honorsPlaceholder')} />
              </Stack>
              <TextField fullWidth label={t('form.credentialId')} value={formData.credential_id || ''}
                onChange={(e) => onFieldChange('credential_id', e.target.value)} size="small" />
              <UrlField label={t('form.credentialUrl')} value={formData.credential_url || ''} onChange={(v) => onFieldChange('credential_url', v)} />
              <UrlField label={t('form.institutionUrl')} value={formData.institution_url || ''} onChange={(v) => onFieldChange('institution_url', v)} />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Coursework, Activities & Achievements */}
        <Accordion disableGutters elevation={0} sx={accordionSx}>
          <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={accordionSummarySx}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <WorkspacePremiumRoundedIcon sx={{ fontSize: 17, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700}>{t('form.courseworkSection')}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            <Stack spacing={2}>
              <TagInput
                label={t('form.relevantCoursework')}
                value={formData.relevant_coursework || []}
                onChange={(v) => onFieldChange('relevant_coursework', v)}
                placeholder="Algorithms, Distributed Systems…"
              />
              <DynamicList
                label={t('form.activities')}
                value={(formData.activities || []) as unknown as Record<string, unknown>[]}
                onChange={(v) => onFieldChange('activities', v)}
                emptyItem={{ name: '', role: '', description: '' } as Record<string, unknown>}
                fields={[
                  { key: 'name', label: 'Name', placeholder: 'ACM Club' },
                  { key: 'role', label: 'Role', placeholder: 'President' },
                  { key: 'description', label: 'Description', placeholder: '…', multiline: true },
                ]}
              />
              <DynamicList
                label={t('form.achievements')}
                value={(formData.achievements || []) as unknown as Record<string, unknown>[]}
                onChange={(v) => onFieldChange('achievements', v)}
                emptyItem={{ title: '', year: undefined, description: '' } as Record<string, unknown>}
                fields={[
                  { key: 'title', label: 'Title', placeholder: 'Best Thesis Award' },
                  { key: 'year', label: 'Year', type: 'number', placeholder: '2024' },
                  { key: 'description', label: 'Description', placeholder: '…', multiline: true },
                ]}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Content */}
        <Accordion disableGutters elevation={0} sx={accordionSx}>
          <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={accordionSummarySx}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ArticleRoundedIcon sx={{ fontSize: 17, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700}>{t('form.content')}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            <TextField fullWidth multiline rows={6} value={formData.content || ''}
              onChange={(e) => onFieldChange('content', e.target.value)} size="small"
              placeholder={t('form.contentPlaceholder')}
              sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: 13 } }} />
          </AccordionDetails>
        </Accordion>

        {/* Images */}
        <Accordion disableGutters elevation={0} sx={accordionSx}>
          <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={accordionSummarySx}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BrushRoundedIcon sx={{ fontSize: 17, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700}>{t('form.images')}</Typography>
              {(formData.images?.length ?? 0) > 0 && (
                <Chip label={formData.images!.length} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: (th) => alpha(th.palette.primary.main, 0.12), color: 'primary.main' }} />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            <Stack spacing={1.5}>
              {formData.images && formData.images.length > 0 && (
                <Reorder.Group as="div" axis="y" values={formData.images} onReorder={onReorderImages}
                  style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {formData.images.map((url, idx) => (
                    <Reorder.Item as="div" key={url} value={url} style={{ cursor: 'grab' }}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{
                        px: 1.5, py: 1, borderRadius: '10px',
                        bgcolor: (th) => alpha(th.palette.primary.main, 0.04),
                        border: '1px solid var(--glass-border)',
                        userSelect: 'none',
                      }}>
                        <DragIndicatorRoundedIcon sx={{ fontSize: 16, color: 'text.disabled', flexShrink: 0 }} />
                        <Avatar variant="rounded" src={url} sx={{ width: 40, height: 40, borderRadius: '8px' }}>
                          <ImageRoundedIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>{url}</Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>#{idx + 1}</Typography>
                        <IconButton size="small" onPointerDown={(e) => e.stopPropagation()} onClick={() => onRemoveImage(idx)}
                          sx={{ color: 'error.main', borderRadius: '6px', '&:hover': { bgcolor: (th) => alpha(th.palette.error.main, 0.1) } }}>
                          <CloseRoundedIcon sx={{ fontSize: 13 }} />
                        </IconButton>
                      </Stack>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <ImageUrlInput label={t('form.addImage')} value={imageUrl}
                  onChange={(e) => onImageUrlChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAddImage(); } }}
                  size="small" sx={{ flex: 1 }} placeholder="https://..." onBulkAdd={onAddImages} />
                <IconButton onClick={(e) => { e.preventDefault(); onAddImage(); }} color="primary"
                  sx={{ mb: 0.25, borderRadius: '10px', bgcolor: (th) => alpha(th.palette.primary.main, 0.1), '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.18) } }}>
                  <AddRoundedIcon />
                </IconButton>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Metadata */}
        <Accordion disableGutters elevation={0} sx={accordionSx}>
          <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={accordionSummarySx}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <DataObjectRoundedIcon sx={{ fontSize: 17, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700}>{t('form.metadata')}</Typography>
              {formData.metadata && Object.keys(formData.metadata).length > 0 && (
                <Chip label={Object.keys(formData.metadata).length} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: (th) => alpha(th.palette.primary.main, 0.12), color: 'primary.main' }} />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              {t('form.metadataHint')}
            </Typography>
            <Stack spacing={1.5}>
              {formData.metadata && Object.keys(formData.metadata).length > 0 && (
                <Stack spacing={0.75}>
                  {Object.entries(formData.metadata).map(([key, val]) => (
                    <Stack key={key} direction="row" alignItems="center" spacing={1} sx={{
                      px: 1.5, py: 1, borderRadius: '10px',
                      bgcolor: (th) => alpha(th.palette.primary.main, 0.04),
                      border: '1px solid var(--glass-border)',
                    }}>
                      <Chip label={key} size="small" sx={{ fontWeight: 700, minWidth: 70, bgcolor: (th) => alpha(th.palette.primary.main, 0.1), color: 'primary.main' }} />
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
                        {typeof val === 'string' ? val : JSON.stringify(val)}
                      </Typography>
                      <IconButton size="small" onClick={() => onRemoveMetadata(key)}
                        sx={{ color: 'error.main', borderRadius: '6px', '&:hover': { bgcolor: (th) => alpha(th.palette.error.main, 0.1) } }}>
                        <CloseRoundedIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              )}
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <TextField label={t('form.metaKey')} value={metaKey}
                  onChange={(e) => onMetaKeyChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAddMetadata(); } }}
                  size="small" sx={{ width: 120 }} placeholder="institution" />
                <TextField label={t('form.metaValue')} value={metaValue}
                  onChange={(e) => onMetaValueChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAddMetadata(); } }}
                  size="small" sx={{ flex: 1 }} placeholder='MIT or "2024"' />
                <IconButton onClick={(e) => { e.preventDefault(); onAddMetadata(); }} color="primary"
                  sx={{ mb: 0.25, borderRadius: '10px', bgcolor: (th) => alpha(th.palette.primary.main, 0.1), '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.18) } }}>
                  <AddRoundedIcon />
                </IconButton>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Settings */}
        <Accordion disableGutters elevation={0} sx={accordionSx}>
          <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} sx={accordionSummarySx}>
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
              <TextField label={t('form.order')} type="number" value={formData.order ?? 0}
                onChange={(e) => onFieldChange('order', parseInt(e.target.value) || 0)}
                size="small" sx={{ width: 90 }} />
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid var(--glass-border)', display: 'flex', gap: 1.5, flexShrink: 0 }}>
        <Button fullWidth variant="outlined" onClick={onClose}
          sx={{ borderRadius: '12px', borderColor: 'var(--glass-border)', color: 'text.secondary' }}>
          {t('form.cancel')}
        </Button>
        <Button fullWidth type="submit" variant="contained" disabled={saving}
          startIcon={saving ? <CircularProgress size={15} sx={{ color: '#fff' }} /> : <SaveRoundedIcon />}
          onClick={onSubmit}
          sx={{ borderRadius: '12px', fontWeight: 700 }}>
          {saving ? t('form.saving') : editingId ? t('form.update') : t('form.save')}
        </Button>
      </Box>
    </Drawer>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function EducationPage() {
  const { isLoading: authLoading } = useAuth();
  const t = useTranslations('dashboard.education');

  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await educationService.adminGetAll({ limit: 100, include_hidden: true, include_deleted: includeDeleted });
      setItems(res.items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errorLoading'));
    } finally { setLoading(false); }
  }, [includeDeleted]);

  useEffect(() => { if (!authLoading) fetchData(); }, [authLoading, fetchData]);

  const openCreateForm = () => { setEditingId(null); setFormData(emptyForm); setFormError(null); setShowForm(true); };
  const openEditForm = (item: Education) => {
    setEditingId(item.id);
    setFormData({
      title: item.title, slug: item.slug,
      institution: item.institution, degree_type: item.degree_type,
      description: item.description || '', content: item.content || '',
      institution_url: item.institution_url || '', location: item.location || '',
      field_of_study: item.field_of_study || '',
      start_date: item.start_date || '', end_date: item.end_date || '',
      credential_id: item.credential_id || '', credential_url: item.credential_url || '',
      grade: item.grade || '', honors: item.honors || '',
      relevant_coursework: item.relevant_coursework || [],
      activities: item.activities || [], achievements: item.achievements || [],
      images: item.images || [], metadata: item.metadata || {},
      visible: item.visible, order: item.order,
    });
    setFormError(null); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); setFormData(emptyForm); setFormError(null); setImageUrl(''); setMetaKey(''); setMetaValue(''); };

  const handleFieldChange = (field: keyof FormData, value: unknown) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleTitleChange = (value: string) =>
    setFormData((p) => ({ ...p, title: value, ...(!editingId ? { slug: generateSlug(value) } : {}) }));

  const addImage = () => { if (!imageUrl.trim()) return; setFormData((p) => ({ ...p, images: [...(p.images || []), imageUrl.trim()] })); setImageUrl(''); };
  const addImages = (urls: string[]) => { setFormData((p) => ({ ...p, images: [...(p.images || []), ...urls] })); setImageUrl(''); };
  const removeImage = (index: number) => setFormData((p) => ({ ...p, images: (p.images || []).filter((_, i) => i !== index) }));
  const reorderImages = (urls: string[]) => setFormData((p) => ({ ...p, images: urls }));

  const addMetadata = () => {
    if (!metaKey.trim() || !metaValue.trim()) return;
    let parsed: unknown = metaValue.trim();
    try { parsed = JSON.parse(metaValue.trim()); } catch { /* keep string */ }
    setFormData((p) => ({ ...p, metadata: { ...p.metadata, [metaKey.trim()]: parsed } }));
    setMetaKey(''); setMetaValue('');
  };
  const removeMetadata = (key: string) => setFormData((p) => { const u = { ...p.metadata }; delete u[key]; return { ...p, metadata: u }; });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { setFormError(t('errors.titleRequired')); return; }
    if (!formData.slug?.trim()) { setFormError(t('errors.slugRequired')); return; }
    setSaving(true); setFormError(null);
    try {
      if (editingId) await educationService.update(editingId, { ...formData } as EducationUpdate);
      else await educationService.create({ ...formData } as EducationCreate);
      closeForm(); await fetchData();
    } catch (err: unknown) { setFormError(err instanceof Error ? err.message : t('errors.saveFailed')); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await educationService.remove(id, false); await fetchData(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : t('errors.deleteFailed')); }
  };
  const handleHardDelete = async (id: number) => {
    try { await educationService.remove(id, true); await fetchData(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : t('errors.deleteFailed')); }
  };
  const handleRestore = async (id: number) => {
    try { await educationService.restore(id); await fetchData(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : t('errors.restoreFailed')); }
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2, p: 4, minHeight: 400 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '14px', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: (th) => `0 8px 24px ${alpha(th.palette.primary.main, 0.35)}` }}>
            <SchoolRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
        </motion.div>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>{t('loading')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3, lg: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Stack spacing={3}>

        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <PageHeader
            icon={<SchoolRoundedIcon />}
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

        {items.length > 0 && <StatsBar items={items} />}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Alert severity="error" sx={{ borderRadius: 2.5 }}>{error}</Alert>
          </motion.div>
        )}

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
                    <SchoolRoundedIcon sx={{ fontSize: 40, color: '#fff' }} />
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

        <AnimatePresence mode="wait">
          {viewMode === 'cards' ? (
            <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Grid container spacing={2.5}>
                {items.map((item, index) => (
                  <Grid key={item.id} size={{ xs: 12, lg: 6 }}>
                    <EducationCard
                      item={item} index={index}
                      onEdit={openEditForm}
                      onDelete={handleDelete}
                      onHardDelete={handleHardDelete}
                      onRestore={handleRestore}
                      t={t}
                    />
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          ) : (
            <EducationTable
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

      <FormDrawer
        open={showForm}
        editingId={editingId}
        formData={formData}
        formError={formError}
        saving={saving}
        imageUrl={imageUrl}
        metaKey={metaKey}
        metaValue={metaValue}
        onClose={closeForm}
        onSubmit={handleSubmit}
        onFieldChange={handleFieldChange}
        onTitleChange={handleTitleChange}
        onImageUrlChange={setImageUrl}
        onAddImage={addImage}
        onAddImages={addImages}
        onRemoveImage={removeImage}
        onReorderImages={reorderImages}
        onMetaKeyChange={setMetaKey}
        onMetaValueChange={setMetaValue}
        onAddMetadata={addMetadata}
        onRemoveMetadata={removeMetadata}
        t={t}
      />
    </Box>
  );
}

