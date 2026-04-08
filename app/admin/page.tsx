import { AdminTable } from '@/components/AdminTable';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { LeadQueryRow, LeadRow } from '@/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('leads')
    .select(
      `
        id,
        created_at,
        ad_id,
        name,
        email,
        phone,
        ad:ads(title)
      `
    )
    .order('created_at', { ascending: false });

  const rows = error ? [] : ((data as LeadQueryRow[] | null) ?? []);
  const leads: LeadRow[] = rows.map((row) => ({
    id: row.id,
    created_at: row.created_at,
    ad_id: row.ad_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    ad: Array.isArray(row.ad) ? (row.ad[0] ?? null) : row.ad
  }));

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border border-border bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Admin</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Submitted leads</h1>
              <p className="mt-2 text-sm leading-6 text-slate">
                Review every lead captured from the kiosk QR landing pages.
              </p>
            </div>

            <Link
              href="/admin/new-ad"
              className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brandDark"
            >
              Create New Ad
            </Link>
          </div>
        </header>

        <AdminTable leads={leads} />
      </div>
    </main>
  );
}
