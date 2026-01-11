'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const links = [
  { href: '/', label: 'Overview' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Skills' },
  { href: '/about', label: 'About' },
  { href: '/task-board', label: 'Board' },
  { href: '/contact', label: 'Contact' },
];

const NavBar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-soft bg-gradient-to-b from-[rgba(17,21,28,0.92)] via-[rgba(17,21,28,0.78)] to-transparent backdrop-blur-lg">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold uppercase tracking-[0.35em] text-primary hover:text-primary">
          Samar Khajuria
        </Link>
        <ul className="hidden items-center gap-6 text-xs uppercase text-foreground-muted md:flex">
          {links.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname?.startsWith(`${href}/`));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-full px-4 py-2 transition ${
                    isActive ? 'bg-surface-soft text-foreground' : 'hover:text-foreground'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <X className="text-primary" /> : <Menu className="text-primary" />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-2 px-6 pb-6 text-xs uppercase text-foreground-muted">
            {links.map(({ href, label }) => {
              const isActive = pathname === href || (href !== '/' && pathname?.startsWith(`${href}/`));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block rounded-2xl px-4 py-3 transition ${
                      isActive ? 'bg-surface-soft text-foreground' : 'hover:bg-surface-soft hover:text-foreground'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
};

export default NavBar;


