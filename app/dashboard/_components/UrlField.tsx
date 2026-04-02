'use client';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';

interface UrlFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

export default function UrlField({
  label,
  value,
  onChange,
  placeholder = 'https://',
  size = 'small',
  fullWidth = true,
}: UrlFieldProps) {
  const hasValue = value.trim().length > 0;

  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size={size}
      placeholder={placeholder}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <LinkRoundedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
            </InputAdornment>
          ),
          endAdornment: hasValue ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => window.open(value, '_blank', 'noopener')}
                sx={{ p: 0.5 }}
                aria-label="Open URL"
              >
                <OpenInNewRoundedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}
