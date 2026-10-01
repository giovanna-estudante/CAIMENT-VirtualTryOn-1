import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AuthDecoration } from './AuthDecoration';
import { cn } from '@/utils/cn';

interface AuthLayoutProps {
  children: ReactNode;
  wide?: boolean;
}

export function AuthLayout({ children, wide }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-caiment-purple-50/70 via-caiment-bg to-caiment-bg">
      <AuthDecoration />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-medium text-caiment-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-caiment-purple-600 text-xs text-white">
            C
          </span>
          CAIMENT
        </Link>
        <Link to="/login" className="text-sm font-medium text-caiment-lime-deep hover:text-caiment-ink">
          Entrar
        </Link>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-76px)] items-center justify-center px-6 py-10">
        <div
          className={cn(
            'w-full rounded-[32px] bg-white/90 p-8 shadow-xl shadow-caiment-purple-900/5 backdrop-blur-sm sm:p-10',
            wide ? 'max-w-3xl' : 'max-w-md',
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
