import test from 'node:test';
import assert from 'node:assert/strict';
import { dollars, quoteFor, renderMessage } from '../lib/policy.mjs';
test('outbound amounts preserve cents and expiration specifies the exact time zone and time', () => {
  const l = { name:'Test Customer', vehicle:'2021 BMW X3', salesperson:'Jordan Ellis', originalCents:2850051, capCents:50000, expiresAt:'2026-09-13T14:15:00.000Z' };
  const q = quoteFor(l,50000);
  assert.equal(dollars(q.totalCents),'$29,000.51');
  assert.equal(dollars(50000),'$500');
  const text = renderMessage('followup',{lead:l,quote:q});
  assert.match(text,/\$29,000\.51/);
  assert.match(text,/10:15 AM EDT/);
});
