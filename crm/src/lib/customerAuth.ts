export function sanitizeReturnUrl(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';
  return value;
}

export function buildOtpResponse(
  otpCode: string,
  isNewUser: boolean,
  environment: string | undefined,
): { isNewUser: boolean; otpPreview?: string } {
  return environment === 'production' ? { isNewUser } : { isNewUser, otpPreview: otpCode };
}

export function shouldUpdateNewCustomerProfile(isNewUser: boolean, value?: string): boolean {
  return isNewUser && Boolean(value?.trim());
}
