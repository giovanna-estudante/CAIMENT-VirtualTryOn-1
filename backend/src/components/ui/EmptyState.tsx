import { type ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-caiment-purple-200 bg-caiment-purple-50/40 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-caiment-purple-400 shadow-sm">
        {icon}
      </span>
      <div>
        <h3 className="font-display text-lg font-medium text-caiment-ink">{title}</h3>
        <p className="mx-auto mt-1 max-w-xs text-sm text-caiment-ink-soft">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
