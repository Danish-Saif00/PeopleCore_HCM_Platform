'use client';

import React, { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="motion-page-enter">
      {children}
    </div>
  );
}
