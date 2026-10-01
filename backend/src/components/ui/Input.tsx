import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, trailing, error, hint, className, id, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-caiment-ink">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 transition-colors',
            error
              ? 'border-red-300 focus-within:border-red-400'
              : 'border-caiment-line focus-within:border-caiment-purple-400',
          )}
        >
          {icon && <span className="text-caiment-ink-soft shrink-0">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-transparent text-sm text-caiment-ink placeholder:text-caiment-ink-soft/70 focus:outline-none',
              className,
            )}
            {...rest}
          />
          {trailing && <span className="shrink-0">{trailing}</span>}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-caiment-ink-soft">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';
