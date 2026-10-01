import { Menu, Bell, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/services/firebase/users';

interface HeaderProps {
  title: string;
  onOpenMobileMenu: () => void;
}

export function Header({ title, onOpenMobileMenu }: HeaderProps) {
  const { user } = useAuth();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function loadUserName() {
      if (!user) return;

      try {
        const profile = await getUserProfile(user.uid);

        if (profile?.name) {
          setUserName(profile.name);
        } else if (user.displayName) {
          setUserName(user.displayName);
        } else {
          setUserName(user.email?.split('@')[0] || '');
        }
      } catch (error) {
        console.error('Erro ao carregar nome do usuário:', error);
      }
    }

    loadUserName();
  }, [user]);

  const initials = userName
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-caiment-line bg-caiment-bg/90 px-5 py-4 backdrop-blur-sm lg:px-8">
      <button
        onClick={onOpenMobileMenu}
        className="rounded-full p-2 text-caiment-ink-soft hover:bg-caiment-purple-50 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      <h1 className="font-display text-xl font-medium text-caiment-ink">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-caiment-line bg-white px-3.5 py-2 sm:flex">
          <Search size={15} className="text-caiment-ink-soft" />

          <input
            placeholder="Buscar peças..."
            className="w-40 bg-transparent text-sm text-caiment-ink placeholder:text-caiment-ink-soft focus:outline-none"
          />
        </div>

        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-caiment-line bg-white text-caiment-ink-soft hover:bg-caiment-purple-50"
          aria-label="Notificações"
        >
          <Bell size={16} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-caiment-lime-deep" />
        </button>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-caiment-purple-600 text-xs font-semibold text-white">
          {initials || '?'}
        </span>
      </div>
    </header>
  );
}