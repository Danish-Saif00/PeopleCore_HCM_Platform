'use client';
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('pc_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pc_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className={cn("w-9 h-9 flex items-center justify-center rounded-lg bg-transparent text-[color:var(--muted-foreground)]", className)}>
        <Sun size={18} className="opacity-0" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-all duration-200 hover:scale-105 active:scale-95",
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon size={18} className="transition-transform duration-300" />
      ) : (
        <Sun size={18} className="text-amber-400 transition-transform duration-300" />
      )}
    </button>
  );
}
