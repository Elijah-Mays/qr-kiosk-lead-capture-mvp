'use client';

import { useFormState, useFormStatus } from 'react-dom';

import type { LoginFormState } from '@/types';

type AdminLoginFormProps = {
  action: (state: LoginFormState, formData: FormData) => Promise<LoginFormState>;
};

const initialState: LoginFormState = {
  error: null
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-3 text-base font-semibold text-white transition hover:bg-brandDark disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? 'Checking...' : 'Enter Admin'}
    </button>
  );
}

export function AdminLoginForm({ action }: AdminLoginFormProps) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-border bg-white p-6 shadow-soft">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded-2xl border border-border px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
          placeholder="Enter admin password"
          required
        />
      </div>

      {state.error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}
