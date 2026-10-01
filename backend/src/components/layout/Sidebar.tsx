import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Scan,
  Shirt,
  Heart,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { to: '/dashboard', label: 'Início', icon: LayoutGrid },
  { to: '/avatar', label: 'Meu Avatar', icon: Scan },
  { to: '/provador', label: 'Provador', icon: Shirt },
  { to: '/favoritos', label: 'Favoritos', icon: Heart },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const content = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-7">
        <span className="font-display text-xl font-medium text-caiment-ink">
          <span className="italic">Meu</span>CAIMENT
        </span>

        <button
          onClick={onCloseMobile}
          className="rounded-full p-1.5 text-caiment-ink-soft hover:bg-caiment-purple-50 lg:hidden"
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 px-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-caiment-ink text-white shadow-sm'
                  : 'text-caiment-ink-soft hover:bg-caiment-purple-50 hover:text-caiment-ink',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Card Caiment */}
      <div className="mx-4 mb-6 overflow-hidden rounded-2xl bg-caiment-purple-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-caiment-purple-600 text-white">
            <Shirt size={14} />
          </div>

          <p className="text-xs font-semibold text-caiment-purple-700">
            Seu provador virtual
          </p>
        </div>

        <p className="text-xs leading-relaxed text-caiment-ink-soft">
          Escolha uma peça na Fitsense e experimente no seu avatar pelo Caiment.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-caiment-line bg-white lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-caiment-ink/40"
            onClick={onCloseMobile}
          />

          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl animate-[slideUp_0.25s_ease]">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}