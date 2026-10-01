import type { CaimentMessage } from '@/types';

interface CaimentBubbleProps {
  message: string;
  size?: 'sm' | 'md';
  context?: CaimentMessage['context'];
}

export function CaimentAvatar({ size = 40 }: { size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="relative flex shrink-0 items-center justify-center rounded-full bg-white shadow-sm shadow-caiment-purple-600/20 border border-caiment-purple-100"
    >
      <svg viewBox="0 0 40 40" width={size * 0.72} height={size * 0.72}>
        <circle cx="6" cy="18" r="3" fill="#CDBEF2" />
        <circle cx="34" cy="18" r="3" fill="#CDBEF2" />
        <rect x="4" y="6" width="32" height="26" rx="12" fill="#FFFFFF" stroke="#E7E0FA" strokeWidth="1.4" />
        <rect x="9" y="12" width="22" height="14" rx="7" fill="#221B33" />
        <ellipse cx="16" cy="19" rx="2.3" ry="2.8" fill="#FFFFFF" />
        <ellipse cx="24" cy="19" rx="2.3" ry="2.8" fill="#FFFFFF" />
        <path d="M17 24c1.5 1.6 5.5 1.6 7 0" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      </svg>
      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-caiment-lime" />
    </span>
  );
}

export function CaimentBubble({ message, size = 'md' }: CaimentBubbleProps) {
  return (
    <div className="flex items-start gap-2.5 animate-fade-slide-up">
      <CaimentAvatar size={size === 'sm' ? 28 : 36} />
      <div className="relative rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 shadow-sm shadow-caiment-purple-900/5 border border-caiment-line">
        <p className="text-sm text-caiment-ink">{message}</p>
      </div>
    </div>
  );
}
