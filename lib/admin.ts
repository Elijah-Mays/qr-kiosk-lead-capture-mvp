export const ADMIN_COOKIE_NAME = 'qr_kiosk_admin_session';

function getAdminSecret() {
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    throw new Error('Missing ADMIN_SECRET.');
  }

  return secret;
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function createAdminSessionValue() {
  return sha256(getAdminSecret());
}

export async function isValidAdminPassword(password: string) {
  return password === getAdminSecret();
}

export async function isValidAdminSessionValue(value?: string) {
  if (!value) {
    return false;
  }

  return value === (await createAdminSessionValue());
}
