import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">QR Kiosk Lead Capture MVP</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Lean pilot for a single kiosk.</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate">
          This app is built to support one flow only: a QR scan opens an offer page, a visitor submits their
          details, and an admin reviews submitted leads.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brandDark"
          >
            Admin Login
          </Link>
          <div className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm text-slate">
            Use <span className="mx-1 font-mono text-ink">/ad/[adId]</span> for a live offer page
          </div>
        </div>
      </div>
    </main>
  );
}
