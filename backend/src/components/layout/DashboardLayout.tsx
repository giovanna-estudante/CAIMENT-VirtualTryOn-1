import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

export function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-caiment-bg">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
