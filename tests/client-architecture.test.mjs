import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const app=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
const compatibility=await readFile(new URL('../dist/live-scan.js',import.meta.url),'utf8');

test('Link Lens has one live reputation implementation',()=>{
  assert.equal((app.match(/fetch\('\/api\/scan'/g)||[]).length,1);
  assert.doesNotMatch(compatibility,/addEventListener\(['"]submit/);
  assert.doesNotMatch(compatibility,/fetch\(/);
});
