import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'glass' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ variant = 'solid', padding = 'md', className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl',
        variant === 'solid' && 'bg-white border border-caiment-line',
        variant === 'glass' && 'glass',
        variant === 'outline' && 'border border-caiment-line bg-transparent',
        paddingClasses[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
