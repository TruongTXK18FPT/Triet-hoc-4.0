'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

const UPDATE_INTERVAL = 60000; // Update every 60 seconds (1 minute)

export function useStudyTime() {
  const { data: session, status } = useSession();
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (status !== 'authenticated' || !session) {
      return;
    }

    // Set start time when component mounts or user logs in
    startTimeRef.current = Date.now();
    lastUpdateRef.current = 0;

    // Update study time every minute
    intervalRef.current = setInterval(async () => {
      if (!startTimeRef.current) return;

      const now = Date.now();
      const elapsedMinutes = Math.floor((now - startTimeRef.current) / 60000);
      
      // Only update if at least 1 minute has passed since last update
      if (elapsedMinutes > lastUpdateRef.current) {
        const minutesToAdd = elapsedMinutes - lastUpdateRef.current;
        
        try {
          await fetch('/api/study-time', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ minutes: minutesToAdd }),
          });
          lastUpdateRef.current = elapsedMinutes;
        } catch (error) {
          console.error('Error updating study time:', error);
        }
      }
    }, UPDATE_INTERVAL);

    // Cleanup on unmount or when user logs out
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Final update when leaving
      if (startTimeRef.current && lastUpdateRef.current > 0) {
        const now = Date.now();
        const elapsedMinutes = Math.floor((now - startTimeRef.current) / 60000);
        const minutesToAdd = elapsedMinutes - lastUpdateRef.current;
        
        if (minutesToAdd > 0) {
          fetch('/api/study-time', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ minutes: minutesToAdd }),
          }).catch(console.error);
        }
      }
    };
  }, [session, status]);

  // Also handle page visibility to pause/resume tracking
  useEffect(() => {
    if (status !== 'authenticated') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, save current time
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else {
        // Page is visible again, resume tracking
        if (startTimeRef.current) {
          const now = Date.now();
          const elapsedMinutes = Math.floor((now - startTimeRef.current) / 60000);
          lastUpdateRef.current = elapsedMinutes;
        }

        intervalRef.current = setInterval(async () => {
          if (!startTimeRef.current) return;

          const now = Date.now();
          const elapsedMinutes = Math.floor((now - startTimeRef.current) / 60000);
          
          if (elapsedMinutes > lastUpdateRef.current) {
            const minutesToAdd = elapsedMinutes - lastUpdateRef.current;
            
            try {
              await fetch('/api/study-time', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ minutes: minutesToAdd }),
              });
              lastUpdateRef.current = elapsedMinutes;
            } catch (error) {
              console.error('Error updating study time:', error);
            }
          }
        }, UPDATE_INTERVAL);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status]);
}

