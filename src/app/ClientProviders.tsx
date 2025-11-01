'use client';

import { SessionProvider } from 'next-auth/react';
import { StudyTimeTracker } from '@/components/gamification/StudyTimeTracker';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <StudyTimeTracker />
    </SessionProvider>
  );
}


