import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { ADMIN_COOKIE_NAME, isValidAdminSessionValue } from '@/lib/admin';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { slugify } from '@/lib/slug';
import { isNonEmpty } from '@/lib/validation';

async function createUniqueSlug(table: 'advertisers' | 'ads', value: string) {
  const supabase = createSupabaseServerClient();
  const baseSlug = slugify(value);

  const { data: existing, error } = await supabase.from(table).select('slug').eq('slug', baseSlug).maybeSingle();

  if (error || !existing) {
    return baseSlug;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function POST(request: Request) {
  const cookieValue = cookies().get(ADMIN_COOKIE_NAME)?.value;

  if (!(await isValidAdminSessionValue(cookieValue))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let payload: {
    advertiserName?: unknown;
    title?: unknown;
    offerText?: unknown;
    redemptionInstructions?: unknown;
    logoUrl?: unknown;
    active?: unknown;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 400 });
  }

  const advertiserName = String(payload.advertiserName ?? '').trim();
  const title = String(payload.title ?? '').trim();
  const offerText = String(payload.offerText ?? '').trim();
  const redemptionInstructions = String(payload.redemptionInstructions ?? '').trim();
  const logoUrl = String(payload.logoUrl ?? '').trim();
  const active = Boolean(payload.active);

  if (
    !isNonEmpty(advertiserName) ||
    !isNonEmpty(title) ||
    !isNonEmpty(offerText) ||
    !isNonEmpty(redemptionInstructions)
  ) {
    return NextResponse.json(
      { error: 'Please complete advertiser name, ad title, offer text, and redemption instructions.' },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();
  const requestUrl = new URL(request.url);

  const { data: existingAdvertiser } = await supabase
    .from('advertisers')
    .select('id')
    .ilike('name', advertiserName)
    .limit(1)
    .maybeSingle();

  let advertiserId = existingAdvertiser?.id ?? null;

  if (!advertiserId) {
    const advertiserSlug = await createUniqueSlug('advertisers', advertiserName);
    const { data: newAdvertiser, error: advertiserError } = await supabase
      .from('advertisers')
      .insert({
        name: advertiserName,
        slug: advertiserSlug
      })
      .select('id')
      .single();

    if (advertiserError || !newAdvertiser) {
      return NextResponse.json({ error: 'Unable to create advertiser right now.' }, { status: 500 });
    }

    advertiserId = newAdvertiser.id;
  }

  const adSlug = await createUniqueSlug('ads', `${advertiserName}-${title}`);
  const { data: newAd, error: adError } = await supabase
    .from('ads')
    .insert({
      advertiser_id: advertiserId,
      slug: adSlug,
      title,
      offer_text: offerText,
      redemption_instructions: redemptionInstructions,
      logo_url: logoUrl || null,
      active
    })
    .select('id')
    .single();

  if (adError || !newAd) {
    if (adError?.code === '42703' || adError?.code === 'PGRST204') {
      return NextResponse.json(
        { error: 'Database update needed. Run supabase/add-redemption-instructions.sql and try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: 'Unable to create ad right now.' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    publicUrl: `/ad/${newAd.id}`,
    absoluteUrl: `${requestUrl.origin}/ad/${newAd.id}`
  });
}
