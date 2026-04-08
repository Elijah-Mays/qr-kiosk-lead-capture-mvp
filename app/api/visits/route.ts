import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { isUuid } from '@/lib/validation';

export async function POST(request: Request) {
  let payload: {
    ad_id?: unknown;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const adId = String(payload.ad_id ?? '').trim();

  if (!isUuid(adId)) {
    return NextResponse.json({ error: 'Invalid ad.' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from('ad_visits').insert({
    ad_id: adId
  });

  if (error) {
    return NextResponse.json({ error: 'Unable to track visit.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
