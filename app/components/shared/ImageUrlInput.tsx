'use client';

import { useState } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import { normalizeImageUrl } from '@/app/lib/utils';

/**
 * TextField wrapper that auto-converts pasted image-sharing URLs
 * (Google Drive, Imgur, Dropbox) to direct/embeddable image URLs.
 * A green checkmark adornment appears when a URL has been converted.
 */
export default function ImageUrlInput({ onChange, onBulkAdd, slotProps, ...props }: TextFieldProps & { onBulkAdd?: (urls: string[]) => void }) {
  const [converted, setConverted] = useState(false);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');

    // Multiple URLs separated by comma or newline
    const parts = pasted.split(/[\n,]+/).map(s => s.trim()).filter(s => s.startsWith('http'));
    if (parts.length > 1 && onBulkAdd) {
      e.preventDefault();
      onBulkAdd(parts.map(normalizeImageUrl));
      setConverted(false);
      return;
    }

    const normalized = normalizeImageUrl(pasted);
    if (normalized !== pasted) {
      e.preventDefault();
      setConverted(true);
      onChange?.({
        target: { value: normalized },
        currentTarget: { value: normalized },
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      setConverted(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConverted(false);
    onChange?.(e);
  };

  const existingInputSlot = (slotProps?.input ?? {}) as Record<string, unknown>;

  return (
    <TextField
      {...props}
      onChange={handleChange}
      slotProps={{
        ...slotProps,
        htmlInput: {
          ...(slotProps?.htmlInput as Record<string, unknown> ?? {}),
          onPaste: handlePaste,
        },
        input: {
          ...existingInputSlot,
          endAdornment: converted ? (
            <InputAdornment position="end">
              <Tooltip title="URL convertida a formato directo de imagen" placement="top">
                <CheckCircleRoundedIcon sx={{ fontSize: 16, color: 'success.main' }} />
              </Tooltip>
            </InputAdornment>
          ) : (existingInputSlot.endAdornment as React.ReactNode ?? null),
        },
      }}
    />
  );
}
