import test from 'node:test';
import assert from 'node:assert/strict';
import {localCheck,levelFor} from '../dist/link-lens.js';

test('trusted government domains stay low',()=>{
  const result=localCheck('https://www.uscis.gov/tools');
  assert.equal(result.host,'www.uscis.gov');
  assert.equal(levelFor(result.score),'low');
  assert.equal(result.signals.some(signal=>signal.text.includes('USCIS')),false);
});

test('lookalike government login link is high risk',()=>{
  const result=localCheck('http://uscis-gov.secure-login.example.xyz/account/verify');
  assert.equal(levelFor(result.score),'high');
  assert.ok(result.signals.some(signal=>signal.text.includes('USCIS')));
  assert.ok(result.signals.some(signal=>signal.text.includes('http')));
  assert.ok(result.signals.some(signal=>signal.text.includes('login or verification')));
});

test('short links are marked for review',()=>{
  const result=localCheck('https://bit.ly/visa-update');
  assert.equal(levelFor(result.score),'review');
  assert.ok(result.signals.some(signal=>signal.text.includes('shortened link')));
});
