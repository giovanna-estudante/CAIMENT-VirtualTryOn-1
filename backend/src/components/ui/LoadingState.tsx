import { Sparkles } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Carregando...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-caiment-purple-50">
        <Sparkles size={20} className="text-caiment-purple-500" />
        <span className="absolute inset-0 rounded-full animate-pulse-ring" />
      </span>
      <p className="text-sm text-caiment-ink-soft">{label}</p>
    </div>
  );
}
