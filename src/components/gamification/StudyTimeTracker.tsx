'use client';

import { useStudyTime } from '@/hooks/use-study-time';

export function StudyTimeTracker() {
  useStudyTime();
  return null; // This component doesn't render anything, it just tracks time
}

