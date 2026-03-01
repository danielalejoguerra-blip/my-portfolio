'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { blogService } from '@/services';
import type { BlogPost, BlogPostCreate, BlogPostUpdate } from '@/types';
import { PageHeader } from '@/app/dashboard/_components';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
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
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
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

export default function BlogPage() {
  const { isLoading: authLoading } = useAuth();
  const t = useTranslations('dashboard.blog');

  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState('');
  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState('');
  const [useScheduledDate, setUseScheduledDate] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await blogService.adminGetAll({
        limit: 100,
        include_hidden: true,
        include_deleted: includeDeleted,
        include_scheduled: true,
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
    setUseScheduledDate(false);
    setShowForm(true);
  };
  const openEditForm = (item: BlogPost) => {
    setEditingId(item.id);
    const isScheduled = item.published_at != null && new Date(item.published_at) > new Date();
    setUseScheduledDate(isScheduled);
    setFormData({
      title: item.title,
      slug: item.slug,
      description: item.description || '',
      content: item.content || '',
      images: item.images || [],
      metadata: item.metadata || {},
      visible: item.visible,
      published_at: item.published_at,
    });
    setFormError(null);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setFormError(null);
    setImageUrl('');
    setMetaKey('');
    setMetaValue('');
    setUseScheduledDate(false);
  };

  const handleFieldChange = (field: keyof FormData, value: string | boolean | number | string[] | null) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (value: string) => {
    setFormData((prev: FormData) => ({ ...prev, title: value, ...(!editingId ? { slug: generateSlug(value) } : {}) }));
  };

  const addImage = () => { if (!imageUrl.trim()) return; setFormData((prev: FormData) => ({ ...prev, images: [...(prev.images || []), imageUrl.trim()] })); setImageUrl(''); };
  const removeImage = (index: number) => { setFormData((prev: FormData) => ({ ...prev, images: (prev.images || []).filter((_: string, i: number) => i !== index) })); };

  const addMetadata = () => {
    if (!metaKey.trim() || !metaValue.trim()) return;
    let parsedValue: unknown = metaValue.trim();
    try { parsedValue = JSON.parse(metaValue.trim()); } catch { /* keep as string */ }
    setFormData((prev: FormData) => ({ ...prev, metadata: { ...prev.metadata, [metaKey.trim()]: parsedValue } }));
    setMetaKey(''); setMetaValue('');
  };
  const removeMetadata = (key: string) => { setFormData((prev: FormData) => { const updated = { ...prev.metadata }; delete updated[key]; return { ...prev, metadata: updated }; }); };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getPostStatus = (item: BlogPost): { label: string; color: 'primary' | 'warning' | 'default' } => {
    if (!item.published_at) return { label: t('statusDraft'), color: 'default' };
    if (new Date(item.published_at) > new Date()) return { label: t('statusScheduled'), color: 'warning' };
    return { label: t('statusPublished'), color: 'primary' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { setFormError(t('errors.titleRequired')); return; }
    setSaving(true); setFormError(null);
    try {
      const payload = {
        ...formData,
        published_at: useScheduledDate ? formData.published_at : null,
      };
      if (editingId) { await blogService.update(editingId, { ...payload } as BlogPostUpdate); }
      else { await blogService.create({ ...payload } as BlogPostCreate); }
      closeForm(); await fetchData();
    } catch (err: unknown) { setFormError(err instanceof Error ? err.message : t('errors.saveFailed')); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, hard = false) => {
    if (!confirm(hard ? t('confirmHardDelete') : t('confirmDelete'))) return;
    try { await blogService.remove(id, hard); await fetchData(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : t('errors.deleteFailed')); }
  };

  const handleRestore = async (id: number) => {
    try { await blogService.restore(id); await fetchData(); }
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
          icon={<ArticleRoundedIcon />}
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
                <ArticleRoundedIcon sx={{ fontSize: 36, color: '#fff' }} />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>{t('emptyTitle')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360, mx: 'auto' }}>{t('emptyDescription')}</Typography>
              <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreateForm}>
                {t('createFirst')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Blog post cards grid ── */}
        <Grid container spacing={2.5}>
          {items.map((item, index) => {
            const meta = (item.metadata || {}) as Record<string, unknown>;
            const tags = Array.isArray(meta.tags) ? (meta.tags as string[]) : [];
            const category = typeof meta.category === 'string' ? meta.category : null;
            const status = getPostStatus(item);

            const statusColors: Record<string, string> = {
              primary: '#6366f1',
              warning: '#f59e0b',
              default: '#6b7280',
            };
            const statusColor = statusColors[status.color] || '#6b7280';

            return (
              <Grid key={item.id} size={{ xs: 12, lg: 6 }}>
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
                  {/* Thumbnail */}
                  {item.images && item.images.length > 0 ? (
                    <CardMedia component="img" height="170" image={item.images[0]} alt={item.title} sx={{ objectFit: 'cover' }} />
                  ) : (
                    <Box sx={{
                      height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--gradient-hero)', position: 'relative',
                      '&::after': {
                        content: '""', position: 'absolute', inset: 0,
                        background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)',
                      },
                    }}>
                      <ArticleRoundedIcon sx={{ fontSize: 40, color: 'text.disabled', opacity: 0.5 }} />
                    </Box>
                  )}

                  {/* Badges */}
                  <Stack direction="row" spacing={0.75} sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                    <Chip label={status.label} size="small" sx={{
                      fontWeight: 600, fontSize: '0.7rem', backdropFilter: 'blur(12px)',
                      bgcolor: alpha(statusColor, 0.85), color: '#fff',
                    }} />
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
                      /{item.slug} · #{item.id}
                    </Typography>

                    {category && (
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.75 }}>
                        <Chip label={category} size="small" sx={{
                          fontWeight: 600, fontSize: '0.68rem', height: 24,
                          bgcolor: (th) => alpha(th.palette.primary.main, 0.08),
                          color: 'primary.main',
                        }} />
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

                    {tags.length > 0 && (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
                        {tags.map((tag: string) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" sx={{
                            fontWeight: 600, fontSize: '0.68rem', height: 24,
                            borderColor: (th) => alpha(th.palette.primary.main, 0.25),
                            color: 'primary.main',
                            bgcolor: (th) => alpha(th.palette.primary.main, 0.06),
                          }} />
                        ))}
                      </Stack>
                    )}

                    <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                      {item.published_at && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          {new Date(item.published_at) > new Date() ? (
                            <ScheduleRoundedIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                          ) : (
                            <PublishRoundedIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                          )}
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {formatDate(item.published_at)}
                          </Typography>
                        </Stack>
                      )}
                      {item.images && item.images.length > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <ImageRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {item.images.length} {t('imagesCount')}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
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
              <TextField fullWidth label={t('form.description')} value={formData.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} size="small" placeholder={t('form.descriptionPlaceholder')} />

              <Typography variant="overline" color="primary.main" fontWeight={700} letterSpacing={1.5}>{t('form.content')}</Typography>
              <TextField fullWidth multiline rows={8} value={formData.content || ''} onChange={(e) => handleFieldChange('content', e.target.value)} size="small" placeholder={t('form.contentPlaceholder')} sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: 13 } }} />

              <Typography variant="overline" color="primary.main" fontWeight={700} letterSpacing={1.5}>{t('form.publishing')}</Typography>
              <FormControlLabel
                control={<Switch checked={useScheduledDate} onChange={(e) => {
                  setUseScheduledDate(e.target.checked);
                  if (!e.target.checked) handleFieldChange('published_at', null);
                }} />}
                label={<Typography variant="body2">{t('form.schedulePublish')}</Typography>}
              />
              {useScheduledDate && (
                <TextField
                  fullWidth label={t('form.publishedAt')} type="datetime-local"
                  value={formData.published_at ? formData.published_at.slice(0, 16) : ''}
                  onChange={(e) => handleFieldChange('published_at', e.target.value ? new Date(e.target.value).toISOString() : null)}
                  size="small" slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
              <Typography variant="caption" color="text.secondary">{t('form.publishHint')}</Typography>

              <Typography variant="overline" color="primary.main" fontWeight={700} letterSpacing={1.5}>{t('form.images')}</Typography>

              {formData.images && formData.images.length > 0 && (
                <Stack spacing={1}>
                  {formData.images.map((imgUrl: string, index: number) => (
                    <Stack key={index} direction="row" alignItems="center" spacing={1} sx={{
                      p: 1, borderRadius: 2,
                      bgcolor: (th) => alpha(th.palette.divider, 0.04),
                      border: '1px solid', borderColor: 'divider',
                    }}>
                      <Avatar variant="rounded" src={imgUrl} sx={{ width: 40, height: 40, borderRadius: 1.5 }}>
                        <ImageRoundedIcon />
                      </Avatar>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>{imgUrl}</Typography>
                      <IconButton size="small" color="error" onClick={() => removeImage(index)}>
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              )}

              <Stack direction="row" spacing={1} alignItems="flex-end">
                <TextField label={t('form.addImage')} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }} size="small" sx={{ flex: 1 }} placeholder="https://..." />
                <IconButton onClick={(e) => { e.preventDefault(); addImage(); }} color="primary" sx={{
                  mb: 0.25, bgcolor: (th) => alpha(th.palette.primary.main, 0.08),
                  '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.14) },
                }}>
                  <AddRoundedIcon />
                </IconButton>
              </Stack>

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
                <TextField label={t('form.metaKey')} value={metaKey} onChange={(e) => setMetaKey(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMetadata(); } }} size="small" sx={{ width: 130 }} placeholder="category" />
                <TextField label={t('form.metaValue')} value={metaValue} onChange={(e) => setMetaValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMetadata(); } }} size="small" sx={{ flex: 1 }} placeholder='Tech or ["react","node"]' />
                <IconButton onClick={(e) => { e.preventDefault(); addMetadata(); }} color="primary" sx={{
                  mb: 0.25, bgcolor: (th) => alpha(th.palette.primary.main, 0.08),
                  '&:hover': { bgcolor: (th) => alpha(th.palette.primary.main, 0.14) },
                }}>
                  <AddRoundedIcon />
                </IconButton>
              </Stack>

              <Divider sx={{ borderColor: 'var(--glass-border)' }} />
              <Typography variant="overline" color="primary.main" fontWeight={700} letterSpacing={1.5}>{t('form.settings')}</Typography>
              <FormControlLabel
                control={<Switch checked={formData.visible ?? true} onChange={(e) => handleFieldChange('visible', e.target.checked)} />}
                label={t('form.visible')}
              />
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
