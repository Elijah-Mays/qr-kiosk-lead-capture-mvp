import { createHash } from 'crypto';
import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { isUuid } from '@/lib/validation';

export async function POST(request: Request) {
  let payload: {
    ad_id?: unknown;
    visitor_id?: unknown;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const adId = String(payload.ad_id ?? '').trim();
  const visitorId = String(payload.visitor_id ?? '').trim();

  if (!isUuid(adId)) {
    return NextResponse.json({ error: 'Invalid ad.' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const forwardedFor = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '';
  const clientIp = forwardedFor.split(',')[0]?.trim() ?? '';
  const ipHash = clientIp ? createHash('sha256').update(clientIp).digest('hex') : null;
  const globalDedupeSince = new Date(Date.now() - 5_000).toISOString();
  const dedupeSince = new Date(Date.now() - 10_000).toISOString();

  const { data: recentVisit, error: recentVisitError } = await supabase
    .from('ad_visits')
    .select('id')
    .eq('ad_id', adId)
    .gte('visited_at', globalDedupeSince)
    .order('visited_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!recentVisitError && recentVisit) {
    return NextResponse.json({ success: true, deduped: true, strategy: 'recent-ad-window' });
  }

  const dedupeQueries = [];

  if (visitorId) {
    dedupeQueries.push(
      supabase
        .from('ad_visits')
        .select('id')
        .eq('ad_id', adId)
        .eq('visitor_id', visitorId)
        .gte('visited_at', dedupeSince)
        .limit(1)
        .maybeSingle()
    );
  }

  if (ipHash) {
    dedupeQueries.push(
      supabase
        .from('ad_visits')
        .select('id')
        .eq('ad_id', adId)
        .eq('ip_hash', ipHash)
        .gte('visited_at', dedupeSince)
        .limit(1)
        .maybeSingle()
    );
  }

  if (dedupeQueries.length > 0) {
    const results = await Promise.all(dedupeQueries);
    const hasRecentDuplicate = results.some((result) => !result.error && result.data);

    if (hasRecentDuplicate) {
      return NextResponse.json({ success: true, deduped: true });
    }
  }

  const { error } = await supabase.from('ad_visits').insert({
    ad_id: adId,
    visitor_id: visitorId || null,
    ip_hash: ipHash
  });

  if (error) {
    if (error.code === '42703' || error.code === 'PGRST204') {
      const fallbackInsert = await supabase.from('ad_visits').insert({
        ad_id: adId
      });

      if (!fallbackInsert.error) {
        return NextResponse.json({ success: true, fallback: true });
      }
    }

    return NextResponse.json({ error: 'Unable to track visit.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
