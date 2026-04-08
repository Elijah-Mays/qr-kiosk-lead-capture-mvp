'use client';

import { useState } from 'react';

import { isEmail, isNonEmpty } from '@/lib/validation';

type LeadFormProps = {
  adId: string;
  advertiserName: string;
  adTitle: string;
  redemptionInstructions: string;
};

export function LeadForm({ adId, advertiserName, adTitle, redemptionInstructions }: LeadFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isNonEmpty(name) || !isNonEmpty(email) || !isNonEmpty(phone)) {
      setError('Please complete all fields.');
      return;
    }

    if (!isEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ad_id: adId,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim()
        })
      });

      const payload = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !payload.success) {
        setError(payload.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-900">Redemption Confirmed</p>
        <h2 className="mt-3 text-2xl font-semibold text-emerald-950">You&apos;re in.</h2>
        <p className="mt-4 text-sm font-medium text-emerald-950">{advertiserName}</p>
        <p className="mt-1 text-lg font-semibold text-emerald-950">{adTitle}</p>
        <div className="mt-5 rounded-2xl bg-white px-4 py-4 text-sm leading-6 text-emerald-950">
          {redemptionInstructions}
        </div>
        <p className="mt-4 text-sm leading-6 text-emerald-900">
          Show this screen to staff to redeem.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border bg-white p-6 shadow-soft">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-2xl border border-border px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
          placeholder="Your full name"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-border px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-ink">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full rounded-2xl border border-border px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
          placeholder="(555) 555-5555"
          required
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-3 text-base font-semibold text-white transition hover:bg-brandDark disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {submitting ? 'Submitting...' : 'Get This Offer'}
      </button>
    </form>
  );
}
