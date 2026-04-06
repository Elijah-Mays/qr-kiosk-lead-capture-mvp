import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { isEmail, isNonEmpty, isUuid } from '@/lib/validation';

export async function POST(request: Request) {
  let payload: {
    ad_id?: unknown;
    name?: unknown;
    email?: unknown;
    phone?: unknown;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 400 });
  }

  const adId = String(payload.ad_id ?? '').trim();
  const name = String(payload.name ?? '').trim();
  const email = String(payload.email ?? '').trim();
  const phone = String(payload.phone ?? '').trim();

  if (!isNonEmpty(adId) || !isNonEmpty(name) || !isNonEmpty(email) || !isNonEmpty(phone)) {
    return NextResponse.json({ error: 'Please complete all fields.' }, { status: 400 });
  }

  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (!isUuid(adId)) {
    return NextResponse.json({ error: 'This offer is no longer available.' }, { status: 404 });
  }

  const supabase = createSupabaseServerClient();

  const { data: ad, error: adError } = await supabase
    .from('ads')
    .select('id, advertiser_id, active')
    .eq('id', adId)
    .maybeSingle();

  const resolvedAd = (ad as { id: string; advertiser_id: string; active: boolean } | null) ?? null;

  if (adError || !resolvedAd) {
    return NextResponse.json({ error: 'This offer is no longer available.' }, { status: 404 });
  }

  if (!resolvedAd.active) {
    return NextResponse.json({ error: 'This promotion has ended.' }, { status: 400 });
  }

  const { error: insertError } = await supabase.from('leads').insert({
    ad_id: resolvedAd.id,
    advertiser_id: resolvedAd.advertiser_id,
    name,
    email,
    phone
  });

  if (insertError) {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
