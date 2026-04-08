'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

import type { AdSetupFormState } from '@/types';

const initialState: AdSetupFormState = {
  error: null,
  publicUrl: null,
  absoluteUrl: null
};

export function AdminAdSetupForm() {
  const [state, setState] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function generateQrCode() {
      if (!state.absoluteUrl) {
        setQrCodeDataUrl(null);
        return;
      }

      try {
        const dataUrl = await QRCode.toDataURL(state.absoluteUrl, {
          margin: 1,
          width: 240
        });
        setQrCodeDataUrl(dataUrl);
      } catch {
        setQrCodeDataUrl(null);
      }
    }

    generateQrCode();
  }, [state.absoluteUrl]);

  async function copyLink() {
    if (!state.absoluteUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(state.absoluteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setState(initialState);
    setCopied(false);

    const formData = new FormData(form);
    const payload = {
      advertiserName: String(formData.get('advertiserName') ?? ''),
      title: String(formData.get('title') ?? ''),
      offerText: String(formData.get('offerText') ?? ''),
      redemptionInstructions: String(formData.get('redemptionInstructions') ?? ''),
      logoUrl: String(formData.get('logoUrl') ?? ''),
      active: formData.get('active') === 'on'
    };

    try {
      const response = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const rawBody = await response.text();
      const contentType = response.headers.get('content-type') ?? '';
      const isJson = contentType.includes('application/json');
      const result = isJson && rawBody ? (JSON.parse(rawBody) as {
        error?: string;
        publicUrl?: string;
        absoluteUrl?: string;
        success?: boolean;
      }) : {};

      if (!response.ok || !result.success || !result.publicUrl) {
        const fallbackError =
          !isJson && rawBody.includes('refreshing...')
            ? 'The server refreshed while saving. Your ad may have been created. Refresh this page and check the latest ad.'
            : 'Something went wrong. Please try again.';

        setState({
          error: result.error ?? fallbackError,
          publicUrl: null,
          absoluteUrl: null
        });
        return;
      }

      setState({
        error: null,
        publicUrl: result.publicUrl,
        absoluteUrl: result.absoluteUrl ?? `${window.location.origin}${result.publicUrl}`
      });
      form.reset();
    } catch {
      setState({
        error: 'Something went wrong. Please try again.',
        publicUrl: null,
        absoluteUrl: null
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border bg-white p-6 shadow-soft">
        <div>
          <label htmlFor="advertiserName" className="mb-2 block text-sm font-medium text-ink">
            Advertiser Name
          </label>
          <input
            id="advertiserName"
            name="advertiserName"
            type="text"
            className="w-full rounded-2xl border border-border px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
            placeholder="Sunrise Dental"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-ink">
            Ad Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full rounded-2xl border border-border px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
            placeholder="New Patient Special"
            required
          />
        </div>

        <div>
          <label htmlFor="offerText" className="mb-2 block text-sm font-medium text-ink">
            Offer Text
          </label>
          <textarea
            id="offerText"
            name="offerText"
            rows={5}
            className="w-full rounded-2xl border border-border px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
            placeholder="Claim a free consultation and a discounted first cleaning when you leave your details today."
            required
          />
        </div>

        <div>
          <label htmlFor="redemptionInstructions" className="mb-2 block text-sm font-medium text-ink">
            Redemption Instructions
          </label>
          <textarea
            id="redemptionInstructions"
            name="redemptionInstructions"
            rows={4}
            className="w-full rounded-2xl border border-border px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
            placeholder="Show this screen to staff to redeem."
            required
          />
        </div>

        <div>
          <label htmlFor="logoUrl" className="mb-2 block text-sm font-medium text-ink">
            Logo URL
          </label>
          <input
            id="logoUrl"
            name="logoUrl"
            type="url"
            className="w-full rounded-2xl border border-border px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm text-ink">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-border text-brand" />
          Active
        </label>

        {state.error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-3 text-base font-semibold text-white transition hover:bg-brandDark disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {submitting ? 'Creating ad...' : 'Create Ad'}
        </button>
      </form>

      <aside className="rounded-3xl border border-border bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Public Link</h2>
        <p className="mt-2 text-sm leading-6 text-slate">
          After creation, the public ad URL for the QR code will appear here.
        </p>

        {state.publicUrl ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-900">Ad created successfully.</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">Public URL</p>
            <p className="mt-2 break-all rounded-xl bg-white px-3 py-2 font-mono text-sm text-ink">
              {state.absoluteUrl ?? state.publicUrl}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={state.absoluteUrl ?? state.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:border-emerald-500"
              >
                Open public page
              </a>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex rounded-full border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:border-emerald-500"
              >
                {copied ? 'Copied' : 'Copy link'}
              </button>
              {qrCodeDataUrl ? (
                <a
                  href={qrCodeDataUrl}
                  download="qr-kiosk-ad.png"
                  className="inline-flex rounded-full border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:border-emerald-500"
                >
                  Download QR
                </a>
              ) : null}
            </div>

            {qrCodeDataUrl ? (
              <div className="mt-5 rounded-2xl bg-white p-4">
                <img src={qrCodeDataUrl} alt="QR code for public ad URL" className="mx-auto h-56 w-56" />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-slate">
            No ad created yet.
          </div>
        )}
      </aside>
    </div>
  );
}
