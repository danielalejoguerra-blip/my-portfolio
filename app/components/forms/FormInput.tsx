'use client';

// ============================================
// FormInput - Componente de input reutilizable
// ============================================

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/app/lib/utils';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-lg border bg-[var(--background)] text-[var(--foreground)]',
            'placeholder:text-[var(--muted-foreground)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-[var(--border)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
