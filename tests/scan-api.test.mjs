import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequestPost} from '../functions/api/scan.js';

const requestFor=url=>new Request('https://verifybridgecheck.com/api/scan',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({url})});

test('live scan requires server configuration',async()=>{
  const response=await onRequestPost({request:requestFor('https://example.com'),env:{}});
  assert.equal(response.status,503);
});

test('live scan rejects non-web and credential-bearing links',async()=>{
  const env={WEB_RISK_API_KEY:'test'};
  assert.equal((await onRequestPost({request:requestFor('javascript:alert(1)'),env})).status,400);
  assert.equal((await onRequestPost({request:requestFor('https://user:pass@example.com'),env})).status,400);
});

test('live scan rejects excessive URL input',async()=>{
  const response=await onRequestPost({request:requestFor('https://example.com/'+ 'a'.repeat(2050)),env:{WEB_RISK_API_KEY:'test'}});
  assert.equal(response.status,400);
});
