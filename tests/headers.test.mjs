import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const headers=await readFile(new URL('../dist/_headers',import.meta.url),'utf8');

test('deployment headers prevent framing and MIME sniffing',()=>{
  assert.match(headers,/frame-ancestors 'none'/);
  assert.match(headers,/X-Frame-Options: DENY/);
  assert.match(headers,/X-Content-Type-Options: nosniff/);
});

test('deployment headers restrict scripts and sensitive browser APIs',()=>{
  assert.match(headers,/script-src 'self'/);
  assert.match(headers,/object-src 'none'/);
  assert.match(headers,/camera=\(\), microphone=\(\), geolocation=\(\), payment=\(\)/);
});

test('service worker and API responses avoid stale caching',()=>{
  assert.match(headers,/\/sw\.js[\s\S]*no-cache, no-store/);
  assert.match(headers,/\/api\/\*[\s\S]*Cache-Control: no-store/);
});
