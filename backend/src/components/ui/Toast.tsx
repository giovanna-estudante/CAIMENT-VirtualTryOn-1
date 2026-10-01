import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import {
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';

import { cn } from '@/utils/cn';

type ToastKind =
  | 'success'
  | 'info'
  | 'warning';

interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  show: (
    message: string,
    kind?: ToastKind,
  ) => void;
}

const ToastContext =
  createContext<ToastContextValue | null>(
    null,
  );

const icons: Record<
  ToastKind,
  ReactNode
> = {
  success: (
    <CheckCircle2
      size={18}
      className="text-caiment-lime-deep"
    />
  ),

  info: (
    <Info
      size={18}
      className="text-caiment-purple-500"
    />
  ),

  warning: (
    <AlertTriangle
      size={18}
      className="text-amber-500"
    />
  ),
};

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] =
    useState<ToastItem[]>([]);

  const show = useCallback(
    (
      message: string,
      kind: ToastKind = 'success',
    ) => {
      const id =
        Date.now() +
        Math.random();

      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          kind,
        },
      ]);

      window.setTimeout(() => {
        setToasts((prev) =>
          prev.filter(
            (toast) =>
              toast.id !== id,
          ),
        );
      }, 3200);
    },
    [],
  );

  const dismiss = (id: number) => {
    setToasts((prev) =>
      prev.filter(
        (toast) =>
          toast.id !== id,
      ),
    );
  };

  return (
    <ToastContext.Provider
      value={{ show }}
    >
      {children}

      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'glass flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-lg shadow-caiment-purple-900/10',
              'animate-[slideUp_0.25s_ease]',
            )}
          >
            {icons[toast.kind]}

            <span className="text-sm text-caiment-ink">
              {toast.message}
            </span>

            <button
              onClick={() =>
                dismiss(toast.id)
              }
              className="ml-2 rounded-full p-0.5 text-caiment-ink-soft hover:bg-white/60"
              aria-label="Fechar notificação"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx =
    useContext(ToastContext);

  if (!ctx) {
    throw new Error(
      'useToast deve ser usado dentro de ToastProvider',
    );
  }

  return ctx;
}