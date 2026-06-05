'use client';

import React, { type ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** If true, re-runs the animation each time element scrolls into view (default: true) */
  repeat?: boolean;
}

export function ScrollReveal({ children, className, delay = 0, repeat = true }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    setEnabled(true);
    setRevealed(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (!repeat) {
            observer.disconnect();
          }
        } else if (repeat) {
          // Re-hide when scrolled out so it re-animates on next scroll in
          setRevealed(false);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <div
      ref={ref}
      className={cn('scroll-reveal', enabled && 'enabled', revealed && 'revealed', className)}
      style={{ transitionDelay: revealed ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
