'use client';

import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface StyledDatePickerProps {
  label: string;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  helperText?: string;
  disablePast?: boolean;
  disableFuture?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const popperSx = {
  '& .MuiPaper-root': {
    borderRadius: 3,
    boxShadow: 'var(--shadow-elevated)',
    border: '1px solid var(--glass-border)',
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(20px)',
  },
};

const daySx = {
  borderRadius: 2,
  '&.Mui-selected': {
    background: 'var(--gradient-accent)',
    boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
  },
  '&.MuiPickersDay-today:not(.Mui-selected)': {
    borderColor: 'primary.main',
  },
};

export default function StyledDatePicker({
  label,
  value,
  onChange,
  helperText,
  disablePast,
  disableFuture,
  size = 'small',
  fullWidth = true,
}: StyledDatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={(v: Dayjs | null) => onChange(v ? v.format('YYYY-MM-DD') : null)}
        disablePast={disablePast}
        disableFuture={disableFuture}
        slotProps={{
          textField: { fullWidth, size, helperText },
          popper: { sx: popperSx },
          day: { sx: daySx },
        }}
      />
    </LocalizationProvider>
  );
}
