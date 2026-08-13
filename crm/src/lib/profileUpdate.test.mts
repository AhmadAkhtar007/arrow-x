import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCustomerProfileUpdate } from './profileUpdate.ts';

test('customer profile updates exclude password credentials', () => {
  const update = parseCustomerProfileUpdate({
    name: 'Legend',
    username: 'legend',
    discordHandle: 'legend_01',
    currentPassword: 'old-password',
    newPassword: 'new-password',
  });

  assert.deepEqual(update, {
    name: 'Legend',
    username: 'legend',
    discordHandle: 'legend_01',
  });
  assert.equal('currentPassword' in update, false);
  assert.equal('newPassword' in update, false);
});
