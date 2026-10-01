import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-caiment-ink/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl shadow-caiment-purple-900/20">
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="font-display text-lg font-medium text-caiment-ink">{title}</h3>}
          <button
            onClick={onClose}
            className="ml-auto rounded-full p-1.5 text-caiment-ink-soft hover:bg-caiment-purple-50"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
