import type { LeadRow } from '@/types';

type AdminTableProps = {
  leads: LeadRow[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function AdminTable({ leads }: AdminTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-white p-10 text-center text-slate shadow-soft">
        No leads yet. Waiting for first scan.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50">
            <tr className="text-sm font-semibold text-ink">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Advertiser</th>
              <th className="px-4 py-3">Ad Title</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate">
            {leads.map((lead) => (
              <tr key={lead.id} className="align-top">
                <td className="px-4 py-3 text-ink">{formatDate(lead.created_at)}</td>
                <td className="px-4 py-3">{lead.advertiser?.name ?? 'Unknown advertiser'}</td>
                <td className="px-4 py-3">{lead.ad?.title ?? 'Unknown ad'}</td>
                <td className="px-4 py-3">{lead.name}</td>
                <td className="px-4 py-3">{lead.email}</td>
                <td className="px-4 py-3">{lead.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
