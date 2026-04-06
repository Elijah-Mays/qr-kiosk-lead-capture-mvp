import { AdminLoginForm } from '@/components/AdminLoginForm';

import { loginAction } from './actions';

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Admin Access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Sign in to view leads</h1>
          <p className="mt-3 text-sm leading-6 text-slate">
            Use the internal admin password to access the lead table for this kiosk pilot.
          </p>
        </div>

        <AdminLoginForm action={loginAction} />
      </div>
    </main>
  );
}
