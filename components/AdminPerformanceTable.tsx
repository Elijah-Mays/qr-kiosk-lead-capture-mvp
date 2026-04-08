'use client';

import QRCode from 'qrcode';

import type { AdminPerformanceRow } from '@/types';

type AdminPerformanceTableProps = {
  rows: AdminPerformanceRow[];
};

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString() : 'No activity yet';
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

async function downloadQrCode(url: string, fileName: string) {
  const dataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 280
  });

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

export function AdminPerformanceTable({ rows }: AdminPerformanceTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-white p-10 text-center text-slate shadow-soft">
        No ads yet. Create the first ad to start tracking visits and leads.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50">
            <tr className="text-sm font-semibold text-ink">
              <th className="px-4 py-3">Advertiser</th>
              <th className="px-4 py-3">Ad Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Visits</th>
              <th className="px-4 py-3">Leads</th>
              <th className="px-4 py-3">Conversion</th>
              <th className="px-4 py-3">Last Visit</th>
              <th className="px-4 py-3">Last Lead</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate">
            {rows.map((row) => (
              <tr key={row.id} className="align-top">
                <td className="px-4 py-4 text-ink">{row.advertiserName}</td>
                <td className="px-4 py-4">
                  <div className="font-medium text-ink">{row.title}</div>
                  <div className="mt-1 font-mono text-xs text-slate">{row.id}</div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      row.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {row.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-4 text-ink">{row.visits}</td>
                <td className="px-4 py-4 text-ink">{row.leads}</td>
                <td className="px-4 py-4 text-ink">{formatPercent(row.conversionRate)}</td>
                <td className="px-4 py-4">{formatDate(row.lastVisit)}</td>
                <td className="px-4 py-4">{formatDate(row.lastLead)}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <a
                      href={row.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-border px-3 py-2 text-xs font-medium text-ink transition hover:border-brand hover:text-brand"
                    >
                      Open Page
                    </a>
                    <button
                      type="button"
                      onClick={() => downloadQrCode(row.publicUrl, `qr-${row.id}.png`)}
                      className="inline-flex rounded-full border border-border px-3 py-2 text-xs font-medium text-ink transition hover:border-brand hover:text-brand"
                    >
                      Download QR
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
