'use client';

import { useEffect } from 'react';

const VISIT_TTL_MS = 30 * 60 * 1000;

type VisitTrackerProps = {
  adId: string;
};

export function VisitTracker({ adId }: VisitTrackerProps) {
  useEffect(() => {
    const storageKey = `qr-kiosk-visit:${adId}`;
    const lastTrackedAt = window.sessionStorage.getItem(storageKey);
    const now = Date.now();

    if (lastTrackedAt) {
      const elapsed = now - Number(lastTrackedAt);

      if (!Number.isNaN(elapsed) && elapsed < VISIT_TTL_MS) {
        return;
      }
    }

    window.sessionStorage.setItem(storageKey, String(now));

    void fetch('/api/visits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ad_id: adId
      }),
      keepalive: true
    }).catch(() => {
      // Visit tracking should never interrupt the public ad experience.
    });
  }, [adId]);

  return null;
}
