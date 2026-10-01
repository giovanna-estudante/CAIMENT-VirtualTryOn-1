import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-caiment-purple-600 text-white hover:bg-caiment-purple-700 shadow-sm shadow-caiment-purple-600/20',
  secondary:
    'bg-caiment-lime text-caiment-ink hover:bg-caiment-lime-deep shadow-sm shadow-caiment-lime-deep/30',
  outline:
    'bg-transparent text-caiment-purple-700 border border-caiment-purple-200 hover:bg-caiment-purple-50',
  ghost: 'bg-transparent text-caiment-ink-soft hover:bg-caiment-purple-50 hover:text-caiment-ink',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3.5 py-2 rounded-full gap-1.5',
  md: 'text-sm px-5 py-2.5 rounded-full gap-2',
  lg: 'text-base px-7 py-3.5 rounded-full gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading,
  fullWidth,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caiment-purple-500',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon && iconPosition === 'left' && icon
      )}
      {children}
      {!isLoading && icon && iconPosition === 'right' && icon}
    </button>
  );
}
