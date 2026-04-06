import Link from 'next/link';

type OfferStateProps = {
  message: string;
};

export function OfferState({ message }: OfferStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">QR Kiosk Offer</p>
        <h1 className="mt-4 text-3xl font-semibold text-ink">{message}</h1>
        <p className="mt-3 text-sm leading-6 text-slate">
          If you believe this is a mistake, please contact the business directly.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full border border-border px-5 py-3 text-sm font-medium text-ink transition hover:border-brand hover:text-brand"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
