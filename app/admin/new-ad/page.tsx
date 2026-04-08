import Link from 'next/link';

import { AdminAdSetupForm } from '@/components/AdminAdSetupForm';

export default function NewAdPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-3xl border border-border bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Admin</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Create a new ad</h1>
              <p className="mt-2 text-sm leading-6 text-slate">
                Create or reuse an advertiser, save an ad record, and get the public URL for the QR code.
              </p>
            </div>

            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-medium text-ink transition hover:border-brand hover:text-brand"
            >
              Back to leads
            </Link>
          </div>
        </header>

        <AdminAdSetupForm />
      </div>
    </main>
  );
}
