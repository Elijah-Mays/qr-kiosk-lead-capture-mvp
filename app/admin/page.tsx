import { AdminPerformanceTable } from '@/components/AdminPerformanceTable';
import { AdminTable } from '@/components/AdminTable';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type {
  AdminDashboardAdQueryRow,
  AdminDashboardAdRow,
  AdminPerformanceRow,
  LeadQueryRow,
  LeadRow
} from '@/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { data: recentLeadData, error: recentLeadError } = await supabase
    .from('leads')
    .select(
      `
        id,
        created_at,
        ad_id,
        name,
        email,
        phone,
        advertiser:advertisers(name),
        ad:ads(title)
      `
    )
    .order('created_at', { ascending: false })
    .limit(15);

  const { data: adData, error: adError } = await supabase
    .from('ads')
    .select(
      `
        id,
        title,
        active,
        created_at,
        advertiser:advertisers(name)
      `
    )
    .order('created_at', { ascending: false });

  const { data: leadMetricData, error: leadMetricError } = await supabase
    .from('leads')
    .select('id, ad_id, created_at')
    .order('created_at', { ascending: false });

  const visitResult = await supabase.from('ad_visits').select('id, ad_id, visited_at').order('visited_at', { ascending: false });
  const visitData = visitResult.error ? [] : visitResult.data ?? [];

  const rows = recentLeadError ? [] : ((recentLeadData as LeadQueryRow[] | null) ?? []);
  const leads: LeadRow[] = rows.map((row) => ({
    id: row.id,
    created_at: row.created_at,
    ad_id: row.ad_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    advertiser: Array.isArray(row.advertiser) ? (row.advertiser[0] ?? null) : row.advertiser,
    ad: Array.isArray(row.ad) ? (row.ad[0] ?? null) : row.ad
  }));

  const ads = adError ? [] : (((adData as AdminDashboardAdQueryRow[] | null) ?? []).map((row): AdminDashboardAdRow => ({
    id: row.id,
    title: row.title,
    active: row.active,
    created_at: row.created_at,
    advertiser: Array.isArray(row.advertiser) ? (row.advertiser[0] ?? null) : row.advertiser
  })));

  const leadMetrics = leadMetricError ? [] : (leadMetricData ?? []);

  const visitCountByAd = new Map<string, number>();
  const lastVisitByAd = new Map<string, string>();

  for (const visit of visitData) {
    visitCountByAd.set(visit.ad_id, (visitCountByAd.get(visit.ad_id) ?? 0) + 1);
    if (!lastVisitByAd.has(visit.ad_id)) {
      lastVisitByAd.set(visit.ad_id, visit.visited_at);
    }
  }

  const leadCountByAd = new Map<string, number>();
  const lastLeadByAd = new Map<string, string>();

  for (const lead of leadMetrics) {
    leadCountByAd.set(lead.ad_id, (leadCountByAd.get(lead.ad_id) ?? 0) + 1);
    if (!lastLeadByAd.has(lead.ad_id)) {
      lastLeadByAd.set(lead.ad_id, lead.created_at);
    }
  }

  const performanceRows: AdminPerformanceRow[] = ads.map((ad) => {
    const visits = visitCountByAd.get(ad.id) ?? 0;
    const leadCount = leadCountByAd.get(ad.id) ?? 0;

    return {
      id: ad.id,
      advertiserName: ad.advertiser?.name ?? 'Unknown advertiser',
      title: ad.title,
      active: ad.active,
      visits,
      leads: leadCount,
      conversionRate: visits > 0 ? (leadCount / visits) * 100 : 0,
      lastVisit: lastVisitByAd.get(ad.id) ?? null,
      lastLead: lastLeadByAd.get(ad.id) ?? null,
      publicUrl: `${origin}/ad/${ad.id}`
    };
  });

  const totalAds = ads.length;
  const totalVisits = visitData.length;
  const totalLeads = leadMetrics.length;
  const overallConversionRate = totalVisits > 0 ? (totalLeads / totalVisits) * 100 : 0;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border border-border bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Admin</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">QR Campaign Dashboard</h1>
              <p className="mt-2 text-sm leading-6 text-slate">
                Monitor ad performance, kiosk visits, and recent leads from one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/new-ad"
                className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brandDark"
              >
                Create New Ad
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-medium text-ink transition hover:border-brand hover:text-brand"
              >
                View Public App
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
            <p className="text-sm font-medium text-slate">Total Ads</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">{totalAds}</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
            <p className="text-sm font-medium text-slate">Total Visits</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">{totalVisits}</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
            <p className="text-sm font-medium text-slate">Total Leads</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">{totalLeads}</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
            <p className="text-sm font-medium text-slate">Overall Conversion Rate</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">{overallConversionRate.toFixed(1)}%</p>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-panel p-5 shadow-soft sm:p-6">
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Ad Performance</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Campaign performance by ad</h2>
            <p className="mt-2 text-sm leading-6 text-slate">
              See which advertisers are getting traffic and which offers are converting.
            </p>
          </div>

          <AdminPerformanceTable rows={performanceRows} />
        </section>

        <section className="rounded-3xl border border-border bg-panel p-5 shadow-soft sm:p-6">
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Recent Leads</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Latest captured leads</h2>
            <p className="mt-2 text-sm leading-6 text-slate">
              Most recent lead submissions from the kiosk campaign.
            </p>
          </div>

          <AdminTable leads={leads} />
        </section>
      </div>
    </main>
  );
}
