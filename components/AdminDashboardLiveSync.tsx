'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { createSupabaseBrowserClient } from '@/lib/supabase';

export function AdminDashboardLiveSync() {
  const router = useRouter();
  const refreshTimeoutRef = useRef<number | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const lastRefreshAtRef = useRef(0);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const queueRefresh = () => {
      const now = Date.now();

      if (now - lastRefreshAtRef.current < 1500) {
        return;
      }

      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = window.setTimeout(() => {
        lastRefreshAtRef.current = Date.now();
        router.refresh();
      }, 150);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        queueRefresh();
      }
    };

    const channel = supabase
      .channel('admin-dashboard-sync')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads'
        },
        queueRefresh
      )
      .subscribe();

    pollIntervalRef.current = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        queueRefresh();
      }
    }, 5000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', queueRefresh);

    return () => {
      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }

      if (pollIntervalRef.current) {
        window.clearInterval(pollIntervalRef.current);
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', queueRefresh);
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
