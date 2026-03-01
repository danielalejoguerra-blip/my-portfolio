'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { skillService } from '@/services';
import type { Skill, SkillCreate, SkillUpdate } from '@/types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
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

export default function SkillsPage() {
  const { isLoading: authLoading } = useAuth();
  const t = useTranslations('dashboard.skills');

  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await skillService.adminGetAll({
        limit: 100,
        include_hidden: true,
        include_deleted: includeDeleted,
      });
      setItems(res.items);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar datos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [includeDeleted]);

  useEffect(() => {
    if (!authLoading) fetchData();
  }, [authLoading, fetchData]);

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormError(null);
    setShowForm(true);
  };
  const openEditForm = (item: Skill) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      slug: item.slug,
      description: item.description || '',
      metadata: item.metadata || {},
      visible: item.visible,
      order: item.order,
    });
    setFormError(null);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setFormError(null);
    setMetaKey('');
    setMetaValue('');
  };

  const handleFieldChange = (field: keyof FormData, value: string | boolean | number) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (value: string) => {
    setFormData((prev: FormData) => ({ ...prev, title: value, ...(!editingId ? { slug: generateSlug(value) } : {}) }));
  };

  const addMetadata = () => {
    if (!metaKey.trim() || !metaValue.trim()) return;
    let parsedValue: unknown = metaValue.trim();
    try { parsedValue = JSON.parse(metaValue.trim()); } catch { /* keep as string */ }
    setFormData((prev: FormData) => ({ ...prev, metadata: { ...prev.metadata, [metaKey.trim()]: parsedValue } }));
    setMetaKey(''); setMetaValue('');
  };
  const removeMetadata = (key: string) => {
    setFormData((prev: FormData) => { const updated = { ...prev.metadata }; delete updated[key]; return { ...prev, metadata: updated }; });
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

  const handleDelete = async (id: number, hard = false) => {
    if (!confirm(hard ? t('confirmHardDelete') : t('confirmDelete'))) return;
    try { await skillService.remove(id, hard); await fetchData(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : t('errors.deleteFailed')); }
  };

  const handleRestore = async (id: number) => {
    try { await skillService.restore(id); await fetchData(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : t('errors.restoreFailed')); }
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress size={28} />
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

        {items.length === 0 && !error && (
          <Card className="fade-in-up" sx={{ animationDelay: '150ms' }}>
            <CardContent sx={{ py: 10, textAlign: 'center' }}>
              <Box sx={{
                width: 72, height: 72, borderRadius: 3, mx: 'auto', mb: 2.5,
                background: 'var(--gradient-accent)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: (th) => `0 8px 32px ${alpha(th.palette.primary.main, 0.25)}`,
              }}>
                <BuildRoundedIcon sx={{ fontSize: 36, color: '#fff' }} />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>{t('emptyTitle')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360, mx: 'auto' }}>{t('emptyDescription')}</Typography>
              <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreateForm}>
                {t('createFirst')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Skill cards grid ── */}
        <Grid container spacing={2.5}>
          {items.map((item, index) => {
            const meta = (item.metadata || {}) as Record<string, unknown>;
            const level = typeof meta.level === 'string' ? meta.level : null;
            const category = typeof meta.category === 'string' ? meta.category : null;
            const icon = typeof meta.icon === 'string' ? meta.icon : null;
            const techs = Array.isArray(meta.technologies) ? (meta.technologies as string[]) : [];
            return (
              <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card
                  className="fade-in-up"
                  sx={{
                    display: 'flex', flexDirection: 'column', height: '100%',
                    animationDelay: `${index * 60}ms`,
                    position: 'relative', overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 'var(--shadow-elevated)',
                    },
                  }}
                >
                  {/* Gradient header */}
                  <Box sx={{
                    height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--gradient-hero)', position: 'relative',
                    '&::after': {
                      content: '""', position: 'absolute', inset: 0,
                      background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)',
                    },
                  }}>
                    {icon ? (
                      <Typography variant="h4" sx={{ position: 'relative', zIndex: 1 }}>{icon}</Typography>
                    ) : (
                      <BuildRoundedIcon sx={{ fontSize: 30, color: 'text.disabled', opacity: 0.5 }} />
                    )}
                  </Box>

                  {/* Badges */}
                  <Stack direction="row" spacing={0.75} sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                    {!item.visible && (
                      <Chip icon={<VisibilityOffRoundedIcon />} label={t('hidden')} size="small" sx={{
                        fontWeight: 600, fontSize: '0.7rem', backdropFilter: 'blur(12px)',
                        bgcolor: (th) => alpha(th.palette.text.primary, 0.6),
                        color: '#fff', '& .MuiChip-icon': { color: '#fff' },
                      }} />
                    )}
                    {item.deleted_at && (
                      <Chip label={t('deleted')} size="small" sx={{
                        fontWeight: 600, fontSize: '0.7rem',
                        bgcolor: (th) => alpha(th.palette.error.main, 0.85),
                        color: '#fff', backdropFilter: 'blur(12px)',
                      }} />
                    )}
                  </Stack>

                  <CardContent sx={{ flex: 1, pb: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap>{item.title}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                      /{item.slug} · #{item.id} · order: {item.order}
                    </Typography>

                    {/* Level & Category */}
                    {(level || category) && (
                      <Stack direction="row" spacing={0.75} sx={{ mt: 1 }}>
                        {level && <Chip label={level} size="small" sx={{
                          fontWeight: 600, fontSize: '0.68rem', height: 24,
                          bgcolor: (th) => alpha(th.palette.primary.main, 0.1),
                          color: 'primary.main', border: '1px solid',
                          borderColor: (th) => alpha(th.palette.primary.main, 0.25),
                        }} />}
                        {category && <Chip label={category} size="small" sx={{
                          fontWeight: 600, fontSize: '0.68rem', height: 24,
                          bgcolor: (th) => alpha(th.palette.secondary.main, 0.1),
                          color: 'secondary.main', border: '1px solid',
                          borderColor: (th) => alpha(th.palette.secondary.main, 0.25),
                        }} />}
                      </Stack>
                    )}

                    {item.description && (
                      <Typography variant="body2" color="text.secondary" sx={{
                        mt: 1, display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6,
                      }}>
                        {item.description}
                      </Typography>
                    )}

                    {techs.length > 0 && (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
                        {techs.map((tech: string) => (
                          <Chip key={tech} label={tech} size="small" variant="outlined" sx={{
                            fontWeight: 600, fontSize: '0.68rem', height: 24,
                            borderColor: (th) => alpha(th.palette.primary.main, 0.25),
                            color: 'primary.main',
                            bgcolor: (th) => alpha(th.palette.primary.main, 0.06),
                          }} />
                        ))}
                      </Stack>
                    )}
                  </CardContent>

                  <Divider />
                  <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1.5, gap: 0.5 }}>
                    {item.deleted_at ? (
                      <>
                        <Tooltip title={t('restore')}>
                          <Button size="small" startIcon={<RestoreRoundedIcon />} onClick={() => handleRestore(item.id)}>{t('restore')}</Button>
                        </Tooltip>
                        <Tooltip title={t('hardDelete')}>
                          <Button size="small" color="error" startIcon={<DeleteForeverRoundedIcon />} onClick={() => handleDelete(item.id, true)}>{t('hardDelete')}</Button>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title={t('edit')}>
                          <Button size="small" startIcon={<EditRoundedIcon />} onClick={() => openEditForm(item)} sx={{
                            color: 'primary.main',
                            bgcolor: (th) => alpha(th.palette.primary.main, 0.08),
                            '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.14) },
                          }}>
                            {t('edit')}
                          </Button>
                        </Tooltip>
                        <Tooltip title={t('delete')}>
                          <Button size="small" color="error" startIcon={<DeleteRoundedIcon />} onClick={() => handleDelete(item.id)} sx={{
                            bgcolor: (th) => alpha(th.palette.error.main, 0.08),
                            '&:hover': { bgcolor: (th) => alpha(th.palette.error.main, 0.14) },
                          }}>
                            {t('delete')}
                          </Button>
                        </Tooltip>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Stack>

      {/* ── Dialog Form ── */}
      <Dialog
        open={showForm} onClose={closeForm} maxWidth="sm" fullWidth scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: '20px', background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 2,
              background: 'var(--gradient-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {editingId ? <EditRoundedIcon sx={{ color: '#fff', fontSize: 20 }} /> : <AddRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />}
            </Box>
            <Typography variant="h6" fontWeight={700}>
              {editingId ? t('editTitle') : t('createTitle')}
            </Typography>
          </Stack>
          <IconButton size="small" onClick={closeForm} sx={{
            bgcolor: (th) => alpha(th.palette.text.primary, 0.06),
            '&:hover': { bgcolor: (th) => alpha(th.palette.text.primary, 0.12) },
          }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent dividers sx={{ borderColor: 'var(--glass-border)' }}>
            <Stack spacing={3}>
              {formError && <Alert severity="error" sx={{ borderRadius: 2 }}>{formError}</Alert>}

              <Typography variant="overline" color="primary.main" fontWeight={700} letterSpacing={1.5}>{t('form.basicInfo')}</Typography>
              <TextField fullWidth label={t('form.title')} value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required size="small" />
              <TextField fullWidth label={t('form.slug')} value={formData.slug || ''} onChange={(e) => handleFieldChange('slug', e.target.value)} size="small" helperText={t('form.slugHint')} />
              <TextField fullWidth label={t('form.description')} value={formData.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} size="small" multiline rows={3} placeholder={t('form.descriptionPlaceholder')} />

              <Typography variant="overline" color="primary.main" fontWeight={700} letterSpacing={1.5}>{t('form.metadata')}</Typography>
              <Typography variant="caption" color="text.secondary">{t('form.metadataHint')}</Typography>

              {formData.metadata && Object.keys(formData.metadata).length > 0 && (
                <Stack spacing={1}>
                  {Object.entries(formData.metadata).map(([key, val]) => (
                    <Stack key={key} direction="row" alignItems="center" spacing={1} sx={{
                      p: 1, borderRadius: 2,
                      bgcolor: (th) => alpha(th.palette.divider, 0.04),
                      border: '1px solid', borderColor: 'divider',
                    }}>
                      <Chip label={key} size="small" sx={{
                        fontWeight: 700, minWidth: 70,
                        bgcolor: (th) => alpha(th.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }} />
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
                        {typeof val === 'string' ? val : JSON.stringify(val)}
                      </Typography>
                      <IconButton size="small" color="error" onClick={() => removeMetadata(key)}>
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              )}

              <Stack direction="row" spacing={1} alignItems="flex-end">
                <TextField label={t('form.metaKey')} value={metaKey} onChange={(e) => setMetaKey(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMetadata(); } }} size="small" sx={{ width: 130 }} placeholder="level" />
                <TextField label={t('form.metaValue')} value={metaValue} onChange={(e) => setMetaValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMetadata(); } }} size="small" sx={{ flex: 1 }} placeholder='Advanced or ["React","Node.js"]' />
                <IconButton onClick={(e) => { e.preventDefault(); addMetadata(); }} color="primary" sx={{
                  mb: 0.25, bgcolor: (th) => alpha(th.palette.primary.main, 0.08),
                  '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.14) },
                }}>
                  <AddRoundedIcon />
                </IconButton>
              </Stack>

              <Divider sx={{ borderColor: 'var(--glass-border)' }} />
              <Typography variant="overline" color="primary.main" fontWeight={700} letterSpacing={1.5}>{t('form.settings')}</Typography>
              <Stack direction="row" alignItems="center" spacing={3}>
                <FormControlLabel
                  control={<Switch checked={formData.visible ?? true} onChange={(e) => handleFieldChange('visible', e.target.checked)} />}
                  label={t('form.visible')}
                />
                <TextField
                  label={t('form.order')}
                  type="number"
                  value={formData.order ?? 0}
                  onChange={(e) => handleFieldChange('order', parseInt(e.target.value) || 0)}
                  size="small"
                  sx={{ width: 90 }}
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid var(--glass-border)' }}>
            <Button onClick={closeForm} sx={{ color: 'text.secondary', '&:hover': { bgcolor: (th) => alpha(th.palette.text.primary, 0.06) } }}>
              {t('form.cancel')}
            </Button>
            <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={16} /> : <SaveRoundedIcon />}>
              {saving ? t('form.saving') : editingId ? t('form.update') : t('form.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
