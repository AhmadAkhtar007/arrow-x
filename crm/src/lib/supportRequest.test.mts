import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSupportRequest } from './supportRequest.ts';

test('support request payload excludes legacy inquiry category', () => {
  const request = parseSupportRequest({
    orderId: 'ORD-101',
    customerEmail: 'customer@example.com',
    discordHandle: 'customer',
    category: 'HWID Reset',
    subject: 'A question',
    initialMessage: 'Please help.',
  });

  assert.deepEqual(request, {
    orderId: 'ORD-101',
    customerEmail: 'customer@example.com',
    discordHandle: 'customer',
    subject: 'A question',
    initialMessage: 'Please help.',
  });
  assert.equal('category' in request, false);
});

test('support request payload requires email, subject, and message', () => {
  assert.throws(
    () => parseSupportRequest({ customerEmail: '', subject: '', initialMessage: '' }),
    /Email, subject, and message are required/,
  );
});
