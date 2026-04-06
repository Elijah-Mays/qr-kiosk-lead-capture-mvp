import { LeadForm } from '@/components/LeadForm';
import { OfferState } from '@/components/OfferState';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { isUuid } from '@/lib/validation';
import type { AdPageQueryRow, AdPageRecord } from '@/types';

export const dynamic = 'force-dynamic';

type AdPageProps = {
  params: {
    adId: string;
  };
};

export default async function AdPage({ params }: AdPageProps) {
  if (!isUuid(params.adId)) {
    return <OfferState message="This offer is no longer available." />;
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('ads')
    .select(
      `
        id,
        title,
        offer_text,
        logo_url,
        active,
        advertiser:advertisers(name)
      `
    )
    .eq('id', params.adId)
    .maybeSingle();

  const row = (data as AdPageQueryRow | null) ?? null;
  const ad: AdPageRecord | null = row
    ? {
        id: row.id,
        title: row.title,
        offer_text: row.offer_text,
        logo_url: row.logo_url,
        active: row.active,
        advertiser: Array.isArray(row.advertiser) ? (row.advertiser[0] ?? null) : row.advertiser
      }
    : null;

  if (error || !ad) {
    return <OfferState message="This offer is no longer available." />;
  }

  if (!ad.active) {
    return <OfferState message="This promotion has ended." />;
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <section className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
          {ad.logo_url ? (
            <div className="mb-5">
              <img
                src={ad.logo_url}
                alt={`${ad.advertiser?.name ?? 'Advertiser'} logo`}
                className="max-h-16 w-auto rounded-xl object-contain"
              />
            </div>
          ) : null}

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            {ad.advertiser?.name ?? 'Featured offer'}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{ad.title}</h1>
          <p className="mt-4 text-base leading-7 text-slate sm:text-lg">{ad.offer_text}</p>
        </section>

        <LeadForm adId={ad.id} />
      </div>
    </main>
  );
}
