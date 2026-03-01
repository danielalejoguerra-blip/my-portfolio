'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { personalInfoService } from '@/services';
import type { PersonalInfo, PersonalInfoCreate, PersonalInfoUpdate } from '@/types';

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
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

import { PageHeader } from '../_components';

type FormData = PersonalInfoCreate & { id?: number };

const emptyForm: FormData = {
  full_name: '',
  headline: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  avatar_url: '',
  resume_url: '',
  social_links: {},
  metadata: {},
  visible: true,
  order: 0,
};

export default function PersonalInfoPage() {
  const { isLoading: authLoading } = useAuth();
  const t = useTranslations('dashboard.personalInfo');

  const [items, setItems] = useState<PersonalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [socialKey, setSocialKey] = useState('');
  const [socialValue, setSocialValue] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await personalInfoService.adminGetAll({
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

  const openEditForm = (item: PersonalInfo) => {
    setEditingId(item.id);
    setFormData({
      full_name: item.full_name,
      headline: item.headline || '',
      bio: item.bio || '',
      email: item.email || '',
      phone: item.phone || '',
      location: item.location || '',
      website: item.website || '',
      avatar_url: item.avatar_url || '',
      resume_url: item.resume_url || '',
      social_links: item.social_links || {},
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
  };

  const handleFieldChange = (field: keyof FormData, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSocialLink = () => {
    if (!socialKey.trim() || !socialValue.trim()) return;
    setFormData((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [socialKey.trim().toLowerCase()]: socialValue.trim() },
    }));
    setSocialKey('');
    setSocialValue('');
  };

  const removeSocialLink = (key: string) => {
    setFormData((prev) => {
      const updated = { ...prev.social_links };
      delete updated[key];
      return { ...prev, social_links: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      setFormError(t('errors.nameRequired'));
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        const updateData: PersonalInfoUpdate = { ...formData };
        await personalInfoService.update(editingId, updateData);
      } else {
        const createData: PersonalInfoCreate = { ...formData };
        await personalInfoService.create(createData);
      }
      closeForm();
      await fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.saveFailed');
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, hard: boolean = false) => {
    const confirmMsg = hard ? t('confirmHardDelete') : t('confirmDelete');
    if (!confirm(confirmMsg)) return;
    try {
      await personalInfoService.remove(id, hard);
      await fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.deleteFailed');
      alert(message);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await personalInfoService.restore(id);
      await fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.restoreFailed');
      alert(message);
    }
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
          icon={<PersonRoundedIcon />}
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
                <PersonRoundedIcon sx={{ fontSize: 36, color: '#fff' }} />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>{t('emptyTitle')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360, mx: 'auto' }}>{t('emptyDescription')}</Typography>
              <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreateForm}>
                {t('createFirst')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Personal info cards */}
        {items.map((item, index) => (
          <Card
            key={item.id}
            className="fade-in-up"
            sx={{
              animationDelay: `${index * 80}ms`,
              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 'var(--shadow-elevated)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5}>
                {/* Avatar */}
                <Avatar
                  src={item.avatar_url || undefined}
                  sx={{
                    width: 72, height: 72, fontSize: '1.5rem',
                    background: 'var(--gradient-accent)', flexShrink: 0,
                    border: '3px solid', borderColor: (th) => alpha(th.palette.primary.main, 0.2),
                    boxShadow: (th) => `0 4px 20px ${alpha(th.palette.primary.main, 0.2)}`,
                  }}
                >
                  {!item.avatar_url && <PersonRoundedIcon sx={{ fontSize: 36 }} />}
                </Avatar>

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ mb: 0.5 }}>
                    <Typography variant="subtitle1" fontWeight={700}>{item.full_name}</Typography>
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
                        color: '#fff',
                      }} />
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                      #{item.id} · order: {item.order}
                    </Typography>
                  </Stack>

                  {item.headline && (
                    <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mb: 0.5 }}>{item.headline}</Typography>
                  )}
                  {item.bio && (
                    <Typography variant="body2" color="text.secondary" sx={{
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6,
                    }}>
                      {item.bio}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1.5 }}>
                    {item.email && (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <EmailRoundedIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>{item.email}</Typography>
                      </Stack>
                    )}
                    {item.phone && (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PhoneRoundedIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>{item.phone}</Typography>
                      </Stack>
                    )}
                    {item.location && (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PlaceRoundedIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>{item.location}</Typography>
                      </Stack>
                    )}
                    {item.website && (
                      <Stack direction="row" alignItems="center" spacing={0.5} component="a" href={item.website} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                        <LanguageRoundedIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>{item.website}</Typography>
                      </Stack>
                    )}
                  </Stack>

                  {item.social_links && Object.keys(item.social_links).length > 0 && (
                    <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1.5 }}>
                      {Object.entries(item.social_links).map(([key, url]) => (
                        <Chip
                          key={key}
                          label={key}
                          size="small"
                          clickable
                          component="a"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            fontWeight: 600, fontSize: '0.68rem', height: 24,
                            borderColor: (th) => alpha(th.palette.primary.main, 0.25),
                            color: 'primary.main',
                            bgcolor: (th) => alpha(th.palette.primary.main, 0.06),
                            border: '1px solid',
                          }}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0, alignSelf: { xs: 'flex-end', md: 'flex-start' } }}>
                  {item.deleted_at ? (
                    <>
                      <Tooltip title={t('restore')}>
                        <Button size="small" startIcon={<RestoreRoundedIcon />} onClick={() => handleRestore(item.id)}>
                          {t('restore')}
                        </Button>
                      </Tooltip>
                      <Tooltip title={t('hardDelete')}>
                        <Button size="small" color="error" startIcon={<DeleteForeverRoundedIcon />} onClick={() => handleDelete(item.id, true)}>
                          {t('hardDelete')}
                        </Button>
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
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
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
              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField fullWidth label={t('form.fullName')} value={formData.full_name} onChange={(e) => handleFieldChange('full_name', e.target.value)} required size="small" />
                </Grid>
                <Grid size={12}>
                  <TextField fullWidth label={t('form.headline')} value={formData.headline || ''} onChange={(e) => handleFieldChange('headline', e.target.value)} size="small" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label={t('form.email')} type="email" value={formData.email || ''} onChange={(e) => handleFieldChange('email', e.target.value)} size="small" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label={t('form.phone')} value={formData.phone || ''} onChange={(e) => handleFieldChange('phone', e.target.value)} size="small" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label={t('form.location')} value={formData.location || ''} onChange={(e) => handleFieldChange('location', e.target.value)} size="small" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label={t('form.website')} value={formData.website || ''} onChange={(e) => handleFieldChange('website', e.target.value)} size="small" />
                </Grid>
              </Grid>

              <TextField fullWidth label={t('form.bio')} value={formData.bio || ''} onChange={(e) => handleFieldChange('bio', e.target.value)} multiline rows={3} size="small" placeholder={t('form.bioPlaceholder')} />

              <Typography variant="overline" color="primary.main" fontWeight={700} letterSpacing={1.5}>{t('form.urlsSection')}</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label={t('form.avatarUrl')} value={formData.avatar_url || ''} onChange={(e) => handleFieldChange('avatar_url', e.target.value)} size="small" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label={t('form.resumeUrl')} value={formData.resume_url || ''} onChange={(e) => handleFieldChange('resume_url', e.target.value)} size="small" />
                </Grid>
              </Grid>

              <Typography variant="overline" color="primary.main" fontWeight={700} letterSpacing={1.5}>{t('form.socialLinks')}</Typography>

              {formData.social_links && Object.keys(formData.social_links).length > 0 && (
                <Stack spacing={1}>
                  {Object.entries(formData.social_links).map(([key, url]) => (
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
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>{url}</Typography>
                      <IconButton size="small" color="error" onClick={() => removeSocialLink(key)}>
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              )}

              <Stack direction="row" spacing={1} alignItems="flex-end">
                <TextField label={t('form.socialPlatform')} value={socialKey} onChange={(e) => setSocialKey(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSocialLink(); } }} size="small" sx={{ width: 130 }} placeholder="github" />
                <TextField label="URL" value={socialValue} onChange={(e) => setSocialValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSocialLink(); } }} size="small" sx={{ flex: 1 }} placeholder="https://github.com/user" />
                <IconButton onClick={(e) => { e.preventDefault(); addSocialLink(); }} color="primary" sx={{
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
