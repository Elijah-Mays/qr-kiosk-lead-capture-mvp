const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isUuid(value: string) {
  return UUID_REGEX.test(value);
}

export function isEmail(value: string) {
  return EMAIL_REGEX.test(value);
}

export function isNonEmpty(value: string) {
  return value.trim().length > 0;
}
