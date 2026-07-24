'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, History, Home, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/', label: 'Hoje', icon: Home },
  { href: '/historico', label: 'Histórico', icon: History },
  { href: '/calendario', label: 'Calendário', icon: Calendar },
  { href: '/remedios', label: 'Remédios', icon: Pill },
];

export function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-30 backdrop-blur bg-background/85 border-b border-border/50">
      <div className="mx-auto max-w-md sm:max-w-2xl px-5 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight"
          style={{ fontFamily: 'var(--font-fraunces), serif' }}
        >
          Dose
        </Link>
        <div className="flex items-center gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
