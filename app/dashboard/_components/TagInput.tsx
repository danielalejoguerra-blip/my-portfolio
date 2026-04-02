'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import { Box, Chip, TextField, type TextFieldProps } from '@mui/material';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  size?: TextFieldProps['size'];
  helperText?: string;
}

/**
 * Modern tag input: type and press Enter/comma to add, click × to remove.
 */
export default function TagInput({ value, onChange, label, placeholder, size = 'small', helperText }: TagInputProps) {
  const [input, setInput] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <Box>
      <TextField
        fullWidth
        size={size}
        label={label}
        placeholder={placeholder ?? 'Type and press Enter'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => input.trim() && addTag(input)}
        inputRef={ref}
        helperText={helperText}
      />
      {value.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {value.map((tag, i) => (
            <Chip key={`${tag}-${i}`} label={tag} size="small" onDelete={() => remove(i)} />
          ))}
        </Box>
      )}
    </Box>
  );
}
