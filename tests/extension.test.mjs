import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('extension uses explicit active-tab scanning without persistent site access', async () => {
  const manifest = JSON.parse(await readFile(new URL('extension/manifest.json', root), 'utf8'));
  assert.deepEqual(manifest.permissions.sort(), ['activeTab', 'scripting']);
  assert.equal(manifest.host_permissions, undefined);
  assert.equal(manifest.content_scripts, undefined);
});

test('extension supports opt-in Gmail and Outlook selection checks', async () => {
  const source = await readFile(new URL('extension/popup.js', root), 'utf8');
  assert.match(source, /mail\\\.google\\\.com/);
  assert.match(source, /outlook\\\.live\\\.com/);
  assert.match(source, /chrome\.scripting\.executeScript/);
  assert.match(source, /window\.getSelection/);
});

test('extension exposes English and Spanish interface choices', async () => {
  const markup = await readFile(new URL('extension/popup.html', root), 'utf8');
  assert.match(markup, /value="en"/);
  assert.match(markup, /value="es"/);
  assert.match(markup, /Nada se revisa automáticamente|data-copy="privacy"/);
});
