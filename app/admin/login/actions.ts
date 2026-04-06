'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_COOKIE_NAME, createAdminSessionValue, isValidAdminPassword } from '@/lib/admin';
import type { LoginFormState } from '@/types';

export async function loginAction(_: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const password = String(formData.get('password') ?? '').trim();

  if (!password) {
    return { error: 'Please enter the admin password.' };
  }

  if (!(await isValidAdminPassword(password))) {
    return { error: 'Incorrect password.' };
  }

  const cookieStore = cookies();

  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: await createAdminSessionValue(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });

  redirect('/admin');
}
