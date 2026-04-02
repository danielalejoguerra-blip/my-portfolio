'use client';

import { Box, TextField, IconButton, Typography, Paper, Stack } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'url';
  placeholder?: string;
  multiline?: boolean;
}

interface DynamicListProps<T extends Record<string, unknown>> {
  value: T[];
  onChange: (items: T[]) => void;
  fields: FieldDef[];
  label?: string;
  emptyItem: T;
  maxItems?: number;
}

/**
 * A dynamic list of structured items (e.g., tech_stack, achievements).
 * Each item renders a row of fields. User can add/remove rows.
 */
export default function DynamicList<T extends Record<string, unknown>>({
  value,
  onChange,
  fields,
  label,
  emptyItem,
  maxItems,
}: DynamicListProps<T>) {
  const add = () => {
    if (maxItems && value.length >= maxItems) return;
    onChange([...value, { ...emptyItem }]);
  };

  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  const update = (idx: number, key: string, val: unknown) => {
    const next = value.map((item, i) => (i === idx ? { ...item, [key]: val } : item));
    onChange(next);
  };

  return (
    <Box>
      {label && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" fontWeight={600}>{label}</Typography>
          <IconButton size="small" onClick={add} color="primary" disabled={!!maxItems && value.length >= maxItems}>
            <AddRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      <Stack spacing={1}>
        {value.map((item, idx) => (
          <Paper key={idx} variant="outlined" sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {fields.map((f) => (
                <TextField
                  key={f.key}
                  size="small"
                  label={f.label}
                  type={f.type ?? 'text'}
                  placeholder={f.placeholder}
                  multiline={f.multiline}
                  value={(item[f.key] as string | number) ?? ''}
                  onChange={(e) => {
                    const v = f.type === 'number' ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value;
                    update(idx, f.key, v);
                  }}
                  sx={{ flex: f.multiline ? '1 1 100%' : '1 1 140px', minWidth: 120 }}
                />
              ))}
            </Box>
            <IconButton size="small" color="error" onClick={() => remove(idx)} sx={{ mt: 0.5 }}>
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Paper>
        ))}
      </Stack>
      {!label && (
        <IconButton size="small" onClick={add} color="primary" sx={{ mt: 1 }} disabled={!!maxItems && value.length >= maxItems}>
          <AddRoundedIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}
