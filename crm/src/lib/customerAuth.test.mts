import assert from 'node:assert/strict';
import test from 'node:test';

import { buildOtpResponse, sanitizeReturnUrl, shouldUpdateNewCustomerProfile } from './customerAuth.ts';

test('accepts only local return URLs and preserves checkout query strings', () => {
  assert.equal(sanitizeReturnUrl('/checkout?product=valorant&variant=avlon'), '/checkout?product=valorant&variant=avlon');
  assert.equal(sanitizeReturnUrl('https://evil.example/steal'), '/');
  assert.equal(sanitizeReturnUrl('//evil.example/steal'), '/');
  assert.equal(sanitizeReturnUrl(null), '/');
});

test('never exposes OTP preview in production', () => {
  assert.deepEqual(buildOtpResponse('123456', true, 'production'), { isNewUser: true });
  assert.deepEqual(buildOtpResponse('123456', false, 'development'), { isNewUser: false, otpPreview: '123456' });
});

test('profile input is applied only during first-time registration', () => {
  assert.equal(shouldUpdateNewCustomerProfile(true, 'Alex'), true);
  assert.equal(shouldUpdateNewCustomerProfile(false, 'Overwrite Attempt'), false);
  assert.equal(shouldUpdateNewCustomerProfile(true, '   '), false);
});
